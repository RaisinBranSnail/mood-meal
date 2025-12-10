import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  View,
} from 'react-native';

interface DailyLog {
  id: string;
  date: string;
  meals: Array<{
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }>;
  total_calories: number;
  total_carbs: number;
  total_protein: number;
  total_fat: number;
  water_intake: number;
}

interface DayData {
  date: Date;
  hasData: boolean;
  calories?: number;
  water?: number;
  mealCount?: number;
}

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyLogs, setDailyLogs] = useState<Map<string, DailyLog>>(new Map());
  const [selectedDayData, setSelectedDayData] = useState<DailyLog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formWater, setFormWater] = useState(0);
  const [formMeals, setFormMeals] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { height, width } = useWindowDimensions();
  const modalMaxWidth = Math.min(400, width - 24); // keep within phone frame on web

  useEffect(() => {
    fetchDailyLogs();
  }, [currentMonth]);

  const fetchDailyLogs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get first and last day of current month
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching daily logs:', error);
        setDailyLogs(new Map());
      } else {
        const logsMap = new Map<string, DailyLog>();
        data?.forEach((log) => {
          logsMap.set(log.date, log);
        });
        setDailyLogs(logsMap);
      }
    } catch (error) {
      console.error('Error:', error);
      setDailyLogs(new Map());
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (DayData | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const log = dailyLogs.get(dateString);
      const mealCount = log?.meals?.length || 0;
      const waterIntake = Number(log?.water_intake ?? 0);
      const hasData = !!log && (mealCount > 0 || waterIntake > 0);

      days.push({
        date,
        hasData,
        calories: log?.total_calories,
        water: waterIntake,
        mealCount,
      });
    }

    return days;
  };

  const handleDayPress = (dayData: DayData) => {
    const dateString = dayData.date.toISOString().split('T')[0];
    const log = dailyLogs.get(dateString);
    setSelectedDayData(log || null);
    setSelectedDate(dayData.date);
    setFormWater(log?.water_intake || 0);
    setFormMeals(log?.meals?.length || 0);
    setErrorMsg('');
    setModalVisible(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth();

  const handleSaveLog = async () => {
    if (!selectedDate) return;
    setSaving(true);
    setErrorMsg('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMsg('Please log in to save your day.');
        return;
      }

      const mealCount = Math.max(0, Math.floor(formMeals));
      const waterIntake = Math.max(0, Math.floor(formWater));
      const dateString = selectedDate.toISOString().split('T')[0];

      const existingMeals = selectedDayData?.meals
        ? [...selectedDayData.meals]
        : [];

      if (mealCount > existingMeals.length) {
        const toAdd = mealCount - existingMeals.length;
        for (let i = 0; i < toAdd; i++) {
          existingMeals.push({
            name: `Meal ${existingMeals.length + 1}`,
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
            meal_type: 'snack',
          });
        }
      } else if (mealCount < existingMeals.length) {
        existingMeals.length = mealCount;
      }

      const totals = existingMeals.reduce(
        (acc, meal) => {
          acc.calories += Number(meal.calories || 0);
          acc.carbs += Number(meal.carbs || 0);
          acc.protein += Number(meal.protein || 0);
          acc.fat += Number(meal.fat || 0);
          return acc;
        },
        { calories: 0, carbs: 0, protein: 0, fat: 0 }
      );

      const { data, error } = await supabase
        .from('daily_logs')
        .upsert(
          {
            user_id: user.id,
            date: dateString,
            meals: existingMeals,
            total_calories: totals.calories,
            total_carbs: totals.carbs,
            total_protein: totals.protein,
            total_fat: totals.fat,
            water_intake: waterIntake,
          },
          { onConflict: 'user_id,date' }
        )
        .select()
        .single();

      if (error) throw error;

      const newLog = data as DailyLog;
      const newMap = new Map(dailyLogs);
      newMap.set(dateString, newLog);
      setDailyLogs(newMap);
      setSelectedDayData(newLog);
      setModalVisible(false);
    } catch (err) {
      console.error('Error saving daily log:', err);
      setErrorMsg('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'sunny';
      case 'lunch':
        return 'restaurant';
      case 'dinner':
        return 'moon';
      case 'snack':
        return 'fast-food';
      default:
        return 'restaurant';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigateMonth('prev')}
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#43274F" />
        </TouchableOpacity>
        <View style={styles.monthTitleContainer}>
          <Text style={styles.monthTitle}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigateMonth('next')}
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={28} color="#43274F" />
        </TouchableOpacity>
      </View>

      {/* Week Days Header */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <ScrollView contentContainerStyle={styles.calendarContainer}>
        <View style={styles.calendarGrid}>
          {days.map((dayData, index) => {
            if (!dayData) {
              return <View key={index} style={styles.dayCell} />;
            }

            const mealCount = Number(dayData.mealCount || 0);
            const waterCount = Number(dayData.water || 0);
            const isToday =
              dayData.date.toDateString() === new Date().toDateString();
            const isSelected =
              selectedDate?.toDateString() === dayData.date.toDateString();

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  isToday && styles.todayCell,
                  isSelected && styles.selectedCell,
                  dayData.hasData && styles.hasDataCell,
                ]}
                onPress={() => handleDayPress(dayData)}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isToday && styles.todayText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {dayData.date.getDate()}
                </Text>
                {mealCount > 0 || waterCount > 0 ? (
                  <View style={styles.dayIndicators}>
                    {mealCount > 0 && (
                      <View style={styles.indicatorDot} />
                    )}
                    {waterCount > 0 && (
                      <View style={[styles.indicatorDot, styles.waterDot]} />
                    )}
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.calorieDot]} />
            <Text style={styles.legendText}>Meals logged</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.waterDot]} />
            <Text style={styles.legendText}>Water tracked</Text>
          </View>
        </View>
      </ScrollView>

      {/* Day Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              width: '100%',
              maxWidth: modalMaxWidth,
              alignSelf: 'center',
              height: '100%',
              maxHeight: height,
              paddingTop: 24,
              paddingBottom: 24,
            },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              {
                maxHeight: Math.min(height * 0.85, 720),
                minHeight: height * 0.55,
                width: '100%',
                maxWidth: modalMaxWidth,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate &&
                  selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={32} color="#43274F" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollContent}
              contentContainerStyle={styles.modalScrollInner}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.quickLogCard}>
                <Text style={styles.sectionTitle}>Log your day</Text>
                <View style={styles.logRow}>
                  <View style={styles.logLabelRow}>
                    <Ionicons name="restaurant" size={20} color="#E76F51" />
                    <Text style={styles.logLabel}>Meals</Text>
                  </View>
                  <View style={styles.counter}>
                    <TouchableOpacity
                      onPress={() => setFormMeals((prev) => Math.max(0, prev - 1))}
                      style={styles.counterBtn}
                      disabled={saving}
                    >
                      <Ionicons name="remove" size={18} color="#43274F" />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{formMeals}</Text>
                    <TouchableOpacity
                      onPress={() => setFormMeals((prev) => prev + 1)}
                      style={styles.counterBtn}
                      disabled={saving}
                    >
                      <Ionicons name="add" size={18} color="#43274F" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.logRow}>
                  <View style={styles.logLabelRow}>
                    <Ionicons name="water" size={20} color="#4A90E2" />
                    <Text style={styles.logLabel}>Cups of water</Text>
                  </View>
                  <View style={styles.counter}>
                    <TouchableOpacity
                      onPress={() => setFormWater((prev) => Math.max(0, prev - 1))}
                      style={styles.counterBtn}
                      disabled={saving}
                    >
                      <Ionicons name="remove" size={18} color="#43274F" />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{formWater}</Text>
                    <TouchableOpacity
                      onPress={() => setFormWater((prev) => prev + 1)}
                      style={styles.counterBtn}
                      disabled={saving}
                    >
                      <Ionicons name="add" size={18} color="#43274F" />
                    </TouchableOpacity>
                  </View>
                </View>

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                  onPress={handleSaveLog}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save day</Text>
                  )}
                </TouchableOpacity>
              </View>

              {selectedDayData && (
                <>
                  {/* Summary Cards */}
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                      <Ionicons name="water" size={20} color="#4A90E2" />
                      <Text style={styles.summaryValue}>
                        {selectedDayData.water_intake || 0}
                      </Text>
                      <Text style={styles.summaryLabel}>glasses</Text>
                    </View>
                    <View style={styles.summaryCard}>
                      <Ionicons name="restaurant" size={20} color="#43274F" />
                      <Text style={styles.summaryValue}>
                        {selectedDayData.meals?.length || 0}
                      </Text>
                      <Text style={styles.summaryLabel}>meals</Text>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#EBDDD4',
    // @ts-ignore - web-only style
    minWidth: 44,
    // @ts-ignore - web-only style
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2A3E',
    letterSpacing: 0.5,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#F8C9A0',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 12,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#43274F',
    letterSpacing: 0.3,
  },
  calendarContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  dayCell: {
    flexBasis: `${100 / 7}%`,
    maxWidth: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5D4D2',
    backgroundColor: '#FFF',
    position: 'relative',
    borderRadius: 12,
    // @ts-ignore - web-only style
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  todayCell: {
    backgroundColor: '#F8C9A0',
    borderColor: '#43274F',
    borderWidth: 2.5,
    // @ts-ignore - web-only style
    boxShadow: '0 4px 8px rgba(67, 39, 79, 0.2)',
  },
  selectedCell: {
    backgroundColor: '#EBDDD4',
    borderColor: '#43274F',
    borderWidth: 2.5,
    // @ts-ignore - web-only style
    boxShadow: '0 4px 8px rgba(67, 39, 79, 0.25)',
  },
  hasDataCell: {
    backgroundColor: '#E5D4D2',
    borderColor: '#D3CCC8',
  },
  dayNumber: {
    fontSize: 18,
    color: '#3C2A3E',
    fontWeight: '600',
  },
  todayText: {
    fontWeight: 'bold',
    color: '#43274F',
    fontSize: 20,
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#43274F',
    fontSize: 20,
  },
  dayIndicators: {
    position: 'absolute',
    bottom: 6,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  indicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E76F51',
    // @ts-ignore - web-only style
    boxShadow: '0 1px 2px rgba(231, 111, 81, 0.4)',
  },
  waterDot: {
    backgroundColor: '#4A90E2',
    // @ts-ignore - web-only style
    boxShadow: '0 1px 2px rgba(74, 144, 226, 0.4)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#F8C9A0',
    borderRadius: 12,
    marginHorizontal: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // @ts-ignore - web-only style
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
  },
  calorieDot: {
    backgroundColor: '#E76F51',
  },
  legendText: {
    fontSize: 13,
    color: '#43274F',
    fontWeight: '600',
  },
  quickLogCard: {
    backgroundColor: '#EBDDD4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    // @ts-ignore - web-only style
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3C2A3E',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8C9A0',
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-ignore - web-only style
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
  },
  counterValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#43274F',
  },
  saveButton: {
    backgroundColor: '#43274F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: '#D64545',
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#FFF4E9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 40,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5D4D2',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C2A3E',
    flex: 1,
  },
  modalScrollContent: {
    padding: 24,
  },
  modalScrollInner: {
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#EBDDD4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43274F',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});


import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomNavbar = ({ activeTab, onTabPress }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onTabPress('home')} style={styles.tab}>
        <Ionicons name="home" size={24} color={activeTab === 'home' ? '#43274F' : '#A9A9A9'} />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onTabPress('stats')} style={styles.tab}>
        <MaterialIcons name="bar-chart" size={24} color={activeTab === 'stats' ? '#43274F' : '#A9A9A9'} />
        <Text style={styles.label}>My plan</Text>
      </TouchableOpacity>

      <View style={styles.centerTab}>
        <FontAwesome5 name="smile" size={24} color="#43274F" />
      </View>

      <TouchableOpacity onPress={() => onTabPress('calendar')} style={styles.tab}>
        <Ionicons name="calendar" size={24} color={activeTab === 'calendar' ? '#43274F' : '#A9A9A9'} />
        <Text style={styles.label}>Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onTabPress('settings')} style={styles.tab}>
        <Ionicons name="settings" size={24} color={activeTab === 'settings' ? '#43274F' : '#A9A9A9'} />
        <Text style={styles.label}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF4E9',
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
  },
  tab: {
    alignItems: 'center',
    gap: 2,
  },
  centerTab: {
    backgroundColor: '#FFE075',
    padding: 16,
    borderRadius: 40,
    marginTop: -24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: '#3C2A3E',
  },
});

export default BottomNavbar;

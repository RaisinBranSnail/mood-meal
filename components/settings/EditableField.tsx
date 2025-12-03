import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<boolean>;
  type: 'text' | 'number' | 'select' | 'height' | 'weight';
  options?: string[];
  unit?: 'cm' | 'kg' | 'lbs' | 'ft';
  min?: number;
  max?: number;
}

export default function EditableField({
  label,
  value,
  onSave,
  type,
  options = [],
  unit = 'cm',
  min = 1,
  max = 100,
}: EditableFieldProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(unit);

  const handleSave = async () => {
    if (!editValue.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    setSaving(true);
    const success = await onSave(editValue);
    setSaving(false);

    if (success) {
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Failed to save. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setModalVisible(false);
  };

  const renderInput = () => {
    if (type === 'select' && options.length > 0) {
      return (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                editValue === option && styles.optionButtonSelected,
              ]}
              onPress={() => setEditValue(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  editValue === option && styles.optionTextSelected,
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (type === 'height' || type === 'weight') {
      const isHeight = type === 'height';
      const isWeight = type === 'weight';
      const numericValue = parseFloat(editValue) || (isHeight ? 160 : 70);
      const displayValue = currentUnit === 'ft' && isHeight
        ? Math.floor(numericValue / 30.48) * 12 + Math.round((numericValue % 30.48) / 2.54)
        : currentUnit === 'lbs' && isWeight
        ? Math.round(numericValue * 2.205)
        : Math.round(numericValue);

      const minVal = isHeight
        ? (currentUnit === 'ft' ? 48 : 120)
        : (currentUnit === 'lbs' ? 70 : 30);
      const maxVal = isHeight
        ? (currentUnit === 'ft' ? 84 : 210)
        : (currentUnit === 'lbs' ? 300 : 140);

      return (
        <View>
          <View style={styles.unitToggle}>
            {isHeight ? (
              <>
                <TouchableOpacity
                  style={[styles.unitOption, currentUnit === 'cm' && styles.activeUnit]}
                  onPress={() => {
                    if (currentUnit === 'ft') {
                      const inches = parseFloat(editValue) || 63;
                      setEditValue(Math.round(inches * 2.54).toString());
                    }
                    setCurrentUnit('cm');
                  }}
                >
                  <Text style={styles.unitLabel}>cm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitOption, currentUnit === 'ft' && styles.activeUnit]}
                  onPress={() => {
                    if (currentUnit === 'cm') {
                      const cm = parseFloat(editValue) || 160;
                      setEditValue(Math.round(cm / 2.54).toString());
                    }
                    setCurrentUnit('ft');
                  }}
                >
                  <Text style={styles.unitLabel}>ft</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.unitOption, currentUnit === 'kg' && styles.activeUnit]}
                  onPress={() => {
                    if (currentUnit === 'lbs') {
                      const lbs = parseFloat(editValue) || 150;
                      setEditValue(Math.round(lbs / 2.205).toString());
                    }
                    setCurrentUnit('kg');
                  }}
                >
                  <Text style={styles.unitLabel}>kg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitOption, currentUnit === 'lbs' && styles.activeUnit]}
                  onPress={() => {
                    if (currentUnit === 'kg') {
                      const kg = parseFloat(editValue) || 68;
                      setEditValue(Math.round(kg * 2.205).toString());
                    }
                    setCurrentUnit('lbs');
                  }}
                >
                  <Text style={styles.unitLabel}>lbs</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Slider
            style={styles.slider}
            minimumValue={minVal}
            maximumValue={maxVal}
            step={1}
            value={displayValue}
            onValueChange={(val) => {
              const converted = currentUnit === 'ft' && isHeight
                ? Math.round(val * 2.54)
                : currentUnit === 'lbs' && isWeight
                ? Math.round(val / 2.205)
                : val;
              setEditValue(converted.toString());
            }}
            minimumTrackTintColor="#43274F"
            maximumTrackTintColor="#DDD"
            thumbTintColor="#43274F"
          />
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>
              {displayValue} {currentUnit}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <TextInput
        style={styles.input}
        value={editValue}
        onChangeText={setEditValue}
        keyboardType={type === 'number' ? 'numeric' : 'default'}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
      />
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.fieldRow}
        onPress={() => {
          setEditValue(value);
          setModalVisible(true);
        }}
      >
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.fieldValueContainer}>
          <Text style={styles.fieldValue}>
            {value || 'Not set'} {type === 'height' ? 'cm' : type === 'weight' ? 'kg' : ''}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#43274F" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {label}</Text>
            {renderInput()}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 16,
    color: '#3C2A3E',
    fontWeight: '500',
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF4E9',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2A3E',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#D3CCC8',
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    color: '#000',
    marginBottom: 24,
  },
  unitToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  unitOption: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#EEE',
  },
  activeUnit: {
    backgroundColor: '#43274F',
  },
  unitLabel: {
    color: '#FFF',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  displayBox: {
    backgroundColor: '#43274F',
    padding: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 24,
  },
  displayText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  optionButtonSelected: {
    borderColor: '#43274F',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#3C2A3E',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#43274F',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FDBE9C',
  },
  saveButton: {
    backgroundColor: '#43274F',
  },
  cancelButtonText: {
    color: '#3C2A3E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


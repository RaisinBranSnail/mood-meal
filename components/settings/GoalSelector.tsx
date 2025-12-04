import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface GoalOption {
  value: string;
  label: string;
  icon?: string;
}

interface GoalSelectorProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<boolean>;
  options: GoalOption[];
}

export default function GoalSelector({
  label,
  value,
  onSave,
  options,
}: GoalSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(selectedValue);
    setSaving(false);

    if (success) {
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Failed to save. Please try again.');
    }
  };

  const handleCancel = () => {
    setSelectedValue(value);
    setModalVisible(false);
  };

  const getCurrentLabel = () => {
    const option = options.find((opt) => opt.value === value);
    return option?.label || value;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.fieldRow}
        onPress={() => {
          setSelectedValue(value);
          setModalVisible(true);
        }}
      >
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.fieldValueContainer}>
          <Text style={styles.fieldValue}>{getCurrentLabel()}</Text>
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
            <Text style={styles.modalTitle}>Select {label}</Text>
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    selectedValue === option.value && styles.optionCardSelected,
                  ]}
                  onPress={() => setSelectedValue(option.value)}
                >
                  {option.icon && (
                    <FontAwesome5
                      name={option.icon as any}
                      size={24}
                      color={selectedValue === option.value ? '#43274F' : '#666'}
                      style={styles.optionIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedValue === option.value && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCardSelected: {
    borderColor: '#43274F',
    borderWidth: 2,
    backgroundColor: '#F8F4F0',
  },
  optionIcon: {
    marginRight: 4,
  },
  optionLabel: {
    fontSize: 16,
    color: '#3C2A3E',
  },
  optionLabelSelected: {
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



import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Alert } from 'react-native';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';

const AddSlotModal = ({ visible, onClose, onSave }) => {
  const [date, setDate] = useState(''); // e.g., 'YYYY-MM-DD'
  const [startTime, setStartTime] = useState(''); // e.g., 'HH:MM'
  const [endTime, setEndTime] = useState(''); // e.g., 'HH:MM'
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Basic validation
    if (!date || !startTime || !endTime) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }

    // Combine date and time strings into Date objects
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        Alert.alert('Invalid Format', 'Please use YYYY-MM-DD for date and HH:MM (24-hour format) for time.');
        return;
    }

    if (startDateTime >= endDateTime) {
        Alert.alert('Invalid Times', 'Start time must be before end time.');
        return;
    }

    setLoading(true);
    await onSave(startDateTime, endDateTime);
    setLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Slot</Text>
          <CustomTextInput label="Date (YYYY-MM-DD)" placeholder="2025-09-01" value={date} onChangeText={setDate} />
          <CustomTextInput label="Start Time (HH:MM)" placeholder="09:00" value={startTime} onChangeText={setStartTime} />
          <CustomTextInput label="End Time (HH:MM)" placeholder="09:30" value={endTime} onChangeText={setEndTime} />
          <View style={styles.buttonContainer}>
            <CustomButton title="Cancel" onPress={onClose} style={styles.cancelButton} textStyle={styles.cancelButtonText} />
            <CustomButton title={loading ? 'Saving...' : 'Save Slot'} onPress={handleSave} disabled={loading} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  cancelButton: {
    backgroundColor: '#CCC',
    flex: 1,
    marginRight: 10
  },
  cancelButtonText: {
    color: '#333'
  }
});

export default AddSlotModal;

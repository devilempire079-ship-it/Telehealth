import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// A helper function to format time
const formatTime = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return 'Invalid time';
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const SlotCard = ({ slot, onDelete }) => {
  return (
    <View style={[styles.card, slot.isBooked && styles.bookedCard]}>
      <View>
        <Text style={styles.dateText}>{slot.startTime.toDateString()}</Text>
        <Text style={styles.timeText}>
          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        {slot.isBooked ? (
          <Text style={styles.bookedStatus}>Booked</Text>
        ) : (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bookedCard: {
    backgroundColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  bookedStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C9A50',
  },
  deleteButton: {
    backgroundColor: '#FF4136',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default SlotCard;

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton';
import SlotCard from '../components/SlotCard';
import AddSlotModal from '../components/AddSlotModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';

const DoctorAvailabilityScreen = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchAvailability = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('doctor_id', user.id)
      .order('start_time', { ascending: true });

    if (error) {
      Alert.alert('Error fetching availability', error.message);
    } else {
      // Convert string dates from Supabase to Date objects
      const formattedData = data.map(slot => ({
          ...slot,
          startTime: new Date(slot.start_time),
          endTime: new Date(slot.end_time),
      }));
      setAvailability(formattedData);
    }
    setLoading(false);
  };

  // useFocusEffect runs when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAvailability();
    }, [user])
  );

  const handleAddSlot = async (startTime, endTime) => {
    if (!user) return;

    const { error } = await supabase
      .from('availability_slots')
      .insert({
        doctor_id: user.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      });

    if (error) {
      Alert.alert('Error Adding Slot', error.message);
    } else {
      Alert.alert('Success', 'Availability slot added successfully.');
      setModalVisible(false);
      fetchAvailability(); // Refresh the list
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!user) return;

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this slot? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from('availability_slots')
              .delete()
              .match({ id: slotId, doctor_id: user.id });

            if (error) {
              Alert.alert('Error Deleting Slot', error.message);
            } else {
              // Optimistic update: remove from UI immediately
              setAvailability(prev => prev.filter(slot => slot.id !== slotId));
            }
          },
        },
      ]
    );
  };

  if (loading && availability.length === 0) {
      return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <AddSlotModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddSlot}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Your Availability</Text>
        <CustomButton title="+ Add Slot" onPress={() => setModalVisible(true)} style={styles.addButton} textStyle={styles.addButtonText} />
      </View>
      <FlatList
        data={availability}
        renderItem={({ item }) => (
            <SlotCard
                slot={item}
                onDelete={() => handleDeleteSlot(item.id)}
            />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>You have no availability slots. Tap "Add Slot" to create one.</Text> : null}
        onRefresh={fetchAvailability}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: '#FFF' },
    title: { fontSize: 24, fontWeight: 'bold' },
    addButton: { width: 110, paddingVertical: 10, backgroundColor: '#28A745' },
    addButtonText: { fontSize: 14, fontWeight: 'bold' },
    list: { padding: 20 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default DoctorAvailabilityScreen;

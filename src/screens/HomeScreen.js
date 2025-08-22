import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthProvider';

// This screen will act as a hub for logged-in users.
// In a real app, we'd fetch the user's role from the 'profiles' table
// and conditionally render the UI based on that role.
// For now, we'll just show buttons for both roles for demonstration.
const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.identifier}>{user?.phone}</Text>

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Doctor Menu</Text>
        <CustomButton
          title="Manage Availability"
          onPress={() => navigation.navigate('DoctorAvailability')}
          style={styles.button}
        />

        <Text style={styles.menuTitle}>Patient Menu</Text>
        <CustomButton
          title="Book Appointment"
          onPress={() => Alert.alert("Coming Soon!", "This feature is under construction.")}
          style={styles.button}
        />
      </View>

      <CustomButton
        title="Sign Out"
        onPress={() => supabase.auth.signOut()}
        style={styles.signOutButton}
        textStyle={styles.signOutButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20
  },
  identifier: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333'
  },
  menu: {
    width: '100%',
    marginBottom: 40
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 5
  },
  button: {
    marginVertical: 10
  },
  signOutButton: {
    backgroundColor: '#FF4136',
    position: 'absolute',
    bottom: 40,
    width: '90%'
  },
  signOutButtonText: {
    color: '#FFF',
  },
});

export default HomeScreen;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DoctorAvailabilityScreen from '../screens/DoctorAvailabilityScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="DoctorAvailability"
        component={DoctorAvailabilityScreen}
        options={{ title: 'Manage Availability' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

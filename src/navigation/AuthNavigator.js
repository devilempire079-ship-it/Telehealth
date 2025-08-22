import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Login or Register' }} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ title: 'Verify OTP' }} />
    </Stack.Navigator>
  );
};

export default RootNavigator;

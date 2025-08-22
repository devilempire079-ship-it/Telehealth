import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { supabase } from '../lib/supabase';

const VerifyOtpScreen = ({ route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    const { error, data: { session } } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms',
    });

    if (error) {
      Alert.alert('Verification Error', error.message);
    }

    // On success, the onAuthStateChange listener in AuthProvider will automatically
    // navigate the user to the main app. We don't need to manually navigate here.
    // If there's no session, it means the OTP was incorrect, though Supabase
    // usually returns an error in that case.
    if (!session) {
        Alert.alert('Verification Failed', 'The code you entered is incorrect. Please try again.');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to your number:</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>

        <CustomTextInput
          label="Verification Code"
          placeholder="123456"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.otpInput}
        />

        <CustomButton
          title={loading ? 'Verifying...' : 'Verify Code'}
          onPress={handleVerifyOtp}
          disabled={loading || otp.length !== 6}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 15,
    fontSize: 24,
  },
});

export default VerifyOtpScreen;

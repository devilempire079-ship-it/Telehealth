import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { supabase } from '../lib/supabase';

const AuthScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number, including the country code (e.g., +1).');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) {
      Alert.alert('Error Sending Code', error.message);
    } else {
      Alert.alert('Code Sent!', 'A verification code has been sent to your phone.');
      navigation.navigate('VerifyOtp', { phoneNumber });
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Enter your phone number to sign in or create an account.</Text>

        <CustomTextInput
          label="Phone Number"
          placeholder="+11234567890"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoComplete="tel"
        />

        <CustomButton
          title={loading ? 'Sending...' : 'Send Code'}
          onPress={handleSendOtp}
          disabled={loading || phoneNumber.length < 10}
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
    marginBottom: 40,
  },
});

export default AuthScreen;

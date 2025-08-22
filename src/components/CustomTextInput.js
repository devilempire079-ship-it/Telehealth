import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  style,
  keyboardType,
  maxLength,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
});

export default CustomTextInput;

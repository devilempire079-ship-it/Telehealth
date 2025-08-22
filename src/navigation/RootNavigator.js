import React from 'react';
import { useAuth } from '../contexts/AuthProvider';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const RootNavigator = () => {
  const { session } = useAuth();

  return session && session.user ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;

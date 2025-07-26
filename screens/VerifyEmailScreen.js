import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebase/firebase';
import { reload } from 'firebase/auth';

export default function VerifyEmailScreen({ navigation }) {
  const [checking, setChecking] = useState(false);

  const checkVerification = async () => {
    setChecking(true);
    await reload(auth.currentUser);
    if (auth.currentUser.emailVerified) {
      Alert.alert('Verified!', 'Your email is verified. You can log in now.');
      navigation.navigate('SignIn');
    } else {
      Alert.alert('Not Verified', 'Please check your email and click the verification link.');
    }
    setChecking(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>Please verify your email.</Text>
      <TouchableOpacity onPress={checkVerification} disabled={checking} style={{
        backgroundColor: '#1D4ED8', padding: 12, borderRadius: 8
      }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          {checking ? 'Checking...' : 'I have verified my email'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

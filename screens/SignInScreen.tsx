import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useUser } from '../context/UserContext';
import { signIn } from '../api/auth';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await signIn(email, password);
      await login(data.user);
      Alert.alert('Login Successful');
    } catch (err) {
      console.error(err);
      Alert.alert('Login Failed', err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (placeholder, value, setValue, iconName, secure = false) => (
    <View style={{ marginBottom: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Feather name={iconName} size={16} color="#555" style={{ marginRight: 8 }} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          secureTextEntry={secure}
          autoCapitalize="none"
          style={{ flex: 1, fontSize: 13 }}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: '#1D4ED8',
          }}
        >
          Sign In
        </Text>

        {renderInput('Email', email, setEmail, 'mail')}
        {renderInput('Password', password, setPassword, 'lock', true)}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9CA3AF' : '#1D4ED8',
            paddingVertical: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 14 }}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{ textAlign: 'center', color: '#1D4ED8', fontSize: 12 }}>
            Don’t have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

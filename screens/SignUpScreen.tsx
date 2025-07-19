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
import { signUp } from '../api/auth';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    password: '',
    userRole: 'user',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isValidMobileNumber = (number) => /^[6-9]\d{9}$/.test(number);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length >= 6 && /\d/.test(password) && /[A-Z]/.test(password)) return 'Strong';
    return 'Moderate';
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    if (!isValidMobileNumber(form.mobileNumber)) {
      newErrors.mobileNumber = 'Enter valid 10-digit mobile number';
      valid = false;
    }
    if (!isValidEmail(form.email)) {
      newErrors.email = 'Enter valid email address';
      valid = false;
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { data } = await signUp(form);
      if (data?.user) {
        Alert.alert('Signup Successful', 'Please sign in to continue.');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Signup failed', 'Invalid response from server.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Signup Failed', err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (field, placeholder, iconName, keyboardType = 'default', secure = false, maxLength = null) => (
    <View style={{ marginBottom: 12 }} key={field}>
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
          value={form[field]}
          onChangeText={(value) => handleChange(field, value)}
          secureTextEntry={secure}
          style={{ flex: 1, fontSize: 13 }}
          autoCapitalize={field.includes('Name') ? 'words' : 'none'}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
      {errors[field] && (
        <Text style={{ color: 'red', fontSize: 11, marginTop: 3 }}>{errors[field]}</Text>
      )}
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
          Create Account
        </Text>

        {renderInput('firstName', 'First Name', 'user')}
        {renderInput('lastName', 'Last Name', 'users')}
        {renderInput('mobileNumber', 'Mobile Number', 'phone', 'phone-pad', false, 10)}
        {renderInput('email', 'Email', 'mail', 'email-address')}
        {renderInput('password', 'Password', 'lock', 'default', true)}

        {form.password.length > 0 && (
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              marginBottom: 10,
              color:
                getPasswordStrength(form.password) === 'Weak'
                  ? 'red'
                  : getPasswordStrength(form.password) === 'Moderate'
                  ? 'orange'
                  : 'green',
            }}
          >
            Password Strength: {getPasswordStrength(form.password)}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleRegister}
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
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={{ textAlign: 'center', color: '#1D4ED8', fontSize: 12 }}>
            Already have an account? <Text style={{ fontWeight: 'bold' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

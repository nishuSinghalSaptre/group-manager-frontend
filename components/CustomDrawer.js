import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../context/UserContext';

export default function CustomDrawer({ navigation }) {
  const { user, logout } = useUser();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View className="flex-1 justify-between bg-white p-6">
      <View>
        <Text className="text-xl font-bold mb-4"> Hello {user?.first_name || 'User'}!</Text>
        <TouchableOpacity
          className="py-4 bg-blue-600 rounded-xl mb-2"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-white text-center font-semibold text-lg">Home</Text>
        </TouchableOpacity>
         <TouchableOpacity
                className="bg-green-600 p-4 rounded-xl mb-4"
                onPress={() => navigation.navigate('CreateGroup')}>
            <Text className="text-white text-center font-semibold text-lg">Create Group</Text>
         </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="py-4 bg-red-600 rounded-xl"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-bold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

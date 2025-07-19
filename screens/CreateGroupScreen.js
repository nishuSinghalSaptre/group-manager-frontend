import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getAllUsers } from '../api/user';
import { createGroup } from '../api/group';

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const resetForm = () => {
    setGroupName('');
    setSelected([]);
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
      return () => {};
    }, [])
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const toggleUser = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Enter group name');
      return;
    }

    const creatorId = user.user_id;
    const updatedSelected = selected.includes(creatorId)
      ? selected
      : [...selected, creatorId];

    if (updatedSelected.length === 0) {
      Alert.alert('Please select at least one user');
      return;
    }

    try {
      setLoading(true);
      const reqObj = {
        groupName,
        userIds: updatedSelected,
        createdBy: user.email,
        userRole: user.user_role,
      };
      console.log('Sending request:', reqObj);
      await createGroup(reqObj);
      Alert.alert('Group created successfully ✅');
      resetForm();
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
      Alert.alert('Group creation failed');
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }) => {
    const userId = item.user_id;
    const isCreator = userId === user.user_id;
    const isSelected = selected.includes(userId) || isCreator;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 10,
          backgroundColor: isSelected ? '#DBEAFE' : '#fff',
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            flexShrink: 1,
            color: '#111827',
          }}
        >
          {item.first_name} {item.last_name} {isCreator ? '(You)' : ''}
        </Text>

        {isCreator ? (
          <Text style={{ fontSize: 11, color: '#6B7280' }}>Always included</Text>
        ) : (
          <CheckBox
            isChecked={selected.includes(userId)}
            onClick={() => toggleUser(userId)}
            checkBoxColor="#1D4ED8"
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 16,
            textAlign: 'center',
            color: '#1D4ED8',
          }}
        >
          Create New Group
        </Text>

        <View style={{ marginBottom: 12 }}>
          <TextInput
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 13,
            }}
          />
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => (item.user_id || item.id).toString()}
          renderItem={renderUserItem}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', fontSize: 12, color: '#6B7280', marginVertical: 20 }}>
              No users available.
            </Text>
          }
          style={{ flexGrow: 0 }}
        />

        <TouchableOpacity
          onPress={handleCreateGroup}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9CA3AF' : '#10B981',
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            >
              Create Group
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

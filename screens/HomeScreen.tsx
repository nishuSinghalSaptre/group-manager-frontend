import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { getGroupByEmail } from '../api/group';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useUser();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getGroupByEmail(user.email);
      setGroups(res.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const handleRefresh = () => fetchGroups();

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          style={{
            width: '100%',
            backgroundColor: '#1D4ED8',
            paddingVertical: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={{
            width: '100%',
            borderWidth: 1,
            borderColor: '#1D4ED8',
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#1D4ED8', textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16, paddingTop: 40 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#1D4ED8' }}>
        Hello, {user.first_name}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Your Groups</Text>

      {loading ? (
        <ActivityIndicator size="small" color="#1D4ED8" />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.group_id.toString()}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('GroupChat', {
                  groupId: item.group_id,
                  groupName: item.group_name,
                })
              }
              style={{
                padding: 12,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                backgroundColor: '#F3F4F6',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>{item.group_name}</Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Tap to chat</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#6B7280', textAlign: 'center', fontSize: 13, marginTop: 20 }}>
              No groups found.
            </Text>
          }
        />
      )}
    </View>
  );
}

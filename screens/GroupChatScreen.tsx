import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { getMessages, sendMessage } from '../api/messages';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function GroupChatScreen() {
  const { user } = useUser();
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, groupName } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const convertToIST = (utcDateStr) => {
    if (!utcDateStr) return null;
    const utcDate = new Date(utcDateStr);
    return new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
  };

  const formatDateLabel = (dateStr) => {
    const istDate = convertToIST(dateStr);
    const today = convertToIST(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (istDate.toDateString() === today.toDateString()) return 'Today';
    if (istDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return istDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getMessages(groupId);
      const sorted = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setMessages(sorted);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    navigation.setOptions({ title: groupName });
    setMessages([]);
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const data = await sendMessage({
        groupId,
        senderEmail: user.email,
        messageText: newMessage,
      });
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      Keyboard.dismiss();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  const renderMessagesWithDates = () => {
    const result = [];
    let lastDate = null;

    messages.forEach((msg) => {
      const istDate = convertToIST(msg.created_at);
      if (!istDate) return;
      const msgDate = `${istDate.getFullYear()}-${String(istDate.getMonth() + 1).padStart(2, '0')}-${String(istDate.getDate()).padStart(2, '0')}`;

      if (msgDate !== lastDate) {
        result.push({ type: 'date', date: msgDate });
        lastDate = msgDate;
      }

      result.push({
        type: 'message',
        ...msg,
        istTime: istDate.toTimeString().slice(0, 5),
      });
    });

    return result;
  };

  const chatData = renderMessagesWithDates().slice().reverse();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1D4ED8" />
            <Text style={{ marginTop: 10, fontSize: 12, color: '#6B7280' }}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            data={chatData}
            inverted
            contentContainerStyle={{ padding: 12 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            keyExtractor={(item, index) =>
              item.message_id?.toString() || item.date || index.toString()
            }
            renderItem={({ item }) => {
              if (item.type === 'date') {
                return (
                  <View style={{ alignItems: 'center', marginVertical: 8 }}>
                    <Text style={{ fontSize: 11, color: '#6B7280' }}>
                      {formatDateLabel(item.date)}
                    </Text>
                  </View>
                );
              }

              const isOwnMessage = item.sender_email === user.email;

              return (
                <View
                  style={{
                    alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                    backgroundColor: isOwnMessage ? '#DCFCE7' : '#F3F4F6',
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 8,
                    maxWidth: '75%',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 11,
                      marginBottom: 2,
                      color: '#111827',
                    }}
                  >
                    {item.sender_email}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#111827', marginBottom: 4 }}>
                    {item.message_text}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#6B7280',
                      alignSelf: 'flex-end',
                    }}
                  >
                    {item.istTime}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: 12,
                  marginTop: 20,
                }}
              >
                No messages yet.
              </Text>
            }
          />
        )}

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 12,
            paddingVertical: Platform.OS === 'ios' ? 16 : 12,
            borderTopWidth: 1,
            borderColor: '#E5E7EB',
            backgroundColor: '#fff',
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: Platform.OS === 'ios' ? 10 : 8,
              fontSize: 13,
              marginRight: 8,
              color: '#111827',
            }}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{
              backgroundColor: '#10B981',
              paddingHorizontal: 18,
              justifyContent: 'center',
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

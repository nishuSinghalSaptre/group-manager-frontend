// src/screens/JitsiLauncher.js

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';

export default function JitsiLauncher({ route, navigation }) {
  const { roomName, userName, audioOnly } = route.params;
  const jitsiMeetViewRef = useRef(null);

  useEffect(() => {
    const startCall = async () => {
      // Ask permissions only on Android
      if (Platform.OS === 'android') {
        const micGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone for audio call.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (micGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Microphone permission denied');
          navigation.goBack();
          return;
        }
      }

      const url = `https://meet.jit.si/${roomName}`;
      const userInfo = {
        displayName: userName,
        email: '',
        avatar: '', // optional
      };

      setTimeout(() => {
        if (audioOnly) {
          JitsiMeet.audioCall(url, userInfo);
        } else {
          JitsiMeet.call(url, userInfo);
        }
      }, 500);
    };

    startCall();

    return () => {
      JitsiMeet.endCall();
    };
  }, []);

  const onConferenceTerminated = () => {
    navigation.goBack();
  };

  const onConferenceJoined = () => {
    console.log('Conference Joined');
  };

  const onConferenceWillJoin = () => {
    console.log('Conference Will Join');
  };

  return (
    <View style={styles.container}>
      <JitsiMeetView
        ref={jitsiMeetViewRef}
        onConferenceTerminated={onConferenceTerminated}
        onConferenceJoined={onConferenceJoined}
        onConferenceWillJoin={onConferenceWillJoin}
        style={styles.jitsiMeet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  jitsiMeet: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

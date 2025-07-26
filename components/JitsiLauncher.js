import React, { useEffect } from 'react';
import JitsiMeet, { JitsiMeetEvents } from 'react-native-jitsi-meet';
import { View } from 'react-native';

export default function JitsiLauncher({ route, navigation }) {
  const { roomName, userName, audioOnly } = route.params;

  useEffect(() => {
    const url = `https://meet.jit.si/${roomName}`;
    const userInfo = {
      displayName: userName,
      email: '',
      avatar: '',
    };

    setTimeout(() => {
      JitsiMeet.call(url, userInfo, audioOnly);
    }, 1000);

    const onConferenceTerminated = () => navigation.goBack();
    const onConferenceLeft = () => navigation.goBack();

    JitsiMeetEvents.addListener('CONFERENCE_TERMINATED', onConferenceTerminated);
    JitsiMeetEvents.addListener('CONFERENCE_LEFT', onConferenceLeft);

    return () => {
      JitsiMeet.endCall();
    };
  }, []);

  return <View style={{ flex: 1, backgroundColor: 'black' }} />;
}

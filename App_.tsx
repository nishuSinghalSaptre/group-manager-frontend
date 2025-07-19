    import React from 'react';
    import { NavigationContainer } from '@react-navigation/native';
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import { createDrawerNavigator } from '@react-navigation/drawer';
    import { UserProvider, useUser } from './context/UserContext';

    import HomeScreen from './screens/HomeScreen';
    import SignInScreen from './screens/SignInScreen';
    import SignUpScreen from './screens/SignUpScreen';
    import CreateGroupScreen from './screens/CreateGroupScreen';
    import GroupChatScreen from './screens/GroupChatScreen'
    import CustomDrawer from './components/CustomDrawer';

    import './global.css';

    const Stack = createNativeStackNavigator();
    const Drawer = createDrawerNavigator();

    const DrawerNavigator = () => (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{ headerShown: true }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
        <Drawer.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
        <Drawer.Screen
          name="GroupChat"
          component={GroupChatScreen}
          options={({ route }) => ({
            title: route?.params?.groupName ?? 'Group Chat',
          })}
        />
      </Drawer.Navigator>
    );

    const AppNavigator = () => {
      const { user, loading } = useUser();

      if (loading) return null;

      return (
        <NavigationContainer>
          {user ? (
            <DrawerNavigator />
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      );
    };

    export default function App() {
      return (
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      );
    }

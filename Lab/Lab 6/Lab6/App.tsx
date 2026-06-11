import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import NotesScreen from './src/screens/NotesScreen';
import NoteDetailScreen from './src/screens/NoteDetailScreen';
import { LoginScreen } from './src/screens/Login';
import FirebaseService from './src/services/firebase';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] =
    useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe =
      FirebaseService.onAuthStateChanged(
        currentUser => {
          setUser(currentUser);
          setInitializing(false);
        },
      );

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#E278E9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Notes"
              component={NotesScreen}
            />

            <Stack.Screen
              name="NoteDetail"
              component={NoteDetailScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

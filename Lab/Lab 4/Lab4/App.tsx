import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NotesScreen from './src/screens/NotesScreen';
import NoteDetailScreen from './src/screens/NoteDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Notes"
          component={NotesScreen}
        />

        <Stack.Screen
          name="NoteDetail"
          component={NoteDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
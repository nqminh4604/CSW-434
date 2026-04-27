import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BatteryScreen from "./src/screens/BatteryScreen";
import BrightnessScreen from "./src/screens/BrigtnessScreen";


const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 60,
        },
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tab.Screen name="Battery" component={BatteryScreen} />
      <Tab.Screen name="Brightness" component={BrightnessScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
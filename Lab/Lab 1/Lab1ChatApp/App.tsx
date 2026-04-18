import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/Login';
import { ChatScreen } from './src/screens/Chat';
import { createStaticNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screens: {
    Login: {
      screen: LoginScreen,
      options: { title: 'Login' },
    },
    Chat: {
      screen: ChatScreen,
      options: ({ navigation }) => ({
        title: 'Group CSE 434',
        headerLeft: () => (
          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
            />
          </TouchableOpacity>
        )
      }),
    }
  }
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <Navigation />
  );
}

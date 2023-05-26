import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./pages/home";
import ChatScreen from "./pages/chat";
import VoiceScreen from "./pages/voice";
import Store from "./storage/store";
import MyScreen from "./pages/My";
import LogoTitle from "./components/logo_title";
import SettingScreen from "./pages/settings";
import LoginScreen from "./pages/login";
import SignupScreen from "./pages/signup";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="홈" component={HomeScreen}/>
          <Stack.Screen name="로그인" component={LoginScreen}/>
          <Stack.Screen name="회원가입" component={SignupScreen}/>
          <Stack.Screen name="대화" component={VoiceScreen}             options={{
              headerTitle: () => <LogoTitle title="대화" />,
            }}/>
          <Stack.Screen name="기록" component={ChatScreen}             options={{
              headerTitle: () => <LogoTitle title="기록" />,
            }}/>
          <Stack.Screen
            name="MY"
            component={MyScreen}
            options={{
              headerTitle: () => <LogoTitle title="MY" />,
            }}
          />
          <Stack.Screen name="설정" component={SettingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

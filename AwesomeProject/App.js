
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Signup from './screens/signup';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

export default function App() {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  return (
    
    <NavigationContainer>
    {hideSplashScreen ? (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen
          name="signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />  */}

      </Stack.Navigator>
    ) : null}
  </NavigationContainer>
);
}

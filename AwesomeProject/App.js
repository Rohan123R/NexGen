import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Landingpage from "./screens/Landingpage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  let [fontsLoaded] = useFonts({
    // Define fonts if needed
  });

  if (!fontsLoaded) {
    // You can show a loading indicator while fonts are loading
    return null;
  }

  return (
    <NavigationContainer>
      {hideSplashScreen ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="Landingpage"
            component={Landingpage}
            options={{ headerShown: false }}
          />
          {/* Add more screens if needed */}
        </Stack.Navigator>
      ) : null}
    </NavigationContainer>
  );
}

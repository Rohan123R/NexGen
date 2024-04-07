
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Signup from './screens/signup';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import Landingpage from "./screens/landingpage";
import Login from "./screens/login";
import StylizedImageScreen from "./screens/StylizedImage";
import GallerySelectionPage from "./screens/gallerypage";
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
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        /> 
         <Stack.Screen
          name="landingpage"
          component={Landingpage}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="StylizedImage"
          component={StylizedImageScreen}
          options={{ headerShown: true }}
        />
         <Stack.Screen
          name="gallerypage"
          component={GallerySelectionPage}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    ) : null}
  </NavigationContainer>
);
}
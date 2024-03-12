import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import CameraScreen from "../screens/CameraScreen";
import CustomCameraScreen from "../screens/CustomCameraScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",
          headerTitle: () => <HeaderFont />, // Use a function to define the content of header. That contains a button to home to the Image and title
        }}
      >
        {/* Each Stack.Screen should be directly inside Stack.Navigator */}
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="CustomCamera" component={CustomCameraScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
/* Custom header component */
const HeaderFont = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Home')}>
    { /* Logo Image of Ready Meals */}
      <Image
        source={require("../assets/img/LogoReadyMeals.jpg")}
        style={{ width: 40, height: 40, borderRadius: 80 }}
      />
      <Text style={{ color: "white", marginLeft: 10, fontSize: 20 }}>
        Ready Meals
      </Text>
    </TouchableOpacity>
  );
};
export default AppNavigator;

const styles = StyleSheet.create({});

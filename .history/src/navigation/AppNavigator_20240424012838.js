import { StyleSheet, Text, TouchableOpacity, Image , View } from "react-native";
import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/registration/LoginScreen";
import RegisterScreen from "../screens/registration/RegisterScreen";
import CameraScreen from "../screens/CameraScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import SettingScreen from "../screens/user/SettingScreen";
import FavouritesScreen from "../screens/user/FavouritesScreen";
import EditScreen from "../screens/EditScreen";

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
          headerTitle: () => <HeaderFont />,
        }}
      >
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Favourites" component={FavouritesScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            headerTitle: () => <ProfileHeader />,
            headerStyle: { backgroundColor: 'black' },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen name="Setting" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HeaderFont = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Home')}>
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
const ProfileHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={require("../assets/img/LogoReadyMeals.jpg")}
          style={{ width: 40, height: 40, borderRadius: 80 }}
        />
        <Text style={{ color: "white", marginLeft: 10, fontSize: 20 }}>
          Ready Meals
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={{ marginLeft: 120 }}>
        <Image
          source={require("../assets/img/icon_img/setting-icon.png")}
          style={{ width: 40, height: 40, borderRadius: 80  }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});

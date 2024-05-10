import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screen/Login";
import Register from "./screen/Register";
import ViewProfile from "./screen/ViewProfile";
import Home from "./screen/Home";
import EditProfile from "./screen/EditProfile ";
import SpinAndWin from "./screen/SpinAndWin";
import SpinDataPage from "./screen/SpinDataPage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ViewProfile" component={ViewProfile} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SpinData" component={SpinDataPage} />
        <Stack.Screen name="Spinner" component={SpinAndWin} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

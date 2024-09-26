import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfile from "../components/UserProfile";
import ReviewForm from "../components/ReviewForm";
import LoanManagementScreen from "../screens/LoanManagementScreen";

const Stack = createNativeStackNavigator();

const LoanManagementStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoansManagement"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LoansManagement" component={LoanManagementScreen} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="ReviewForm" component={ReviewForm} />
    </Stack.Navigator>
  );
};

export default LoanManagementStackNavigator;

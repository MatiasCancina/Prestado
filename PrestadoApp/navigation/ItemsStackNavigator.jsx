import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemsListScreen from "../screens/ItemsListScreen";
import RequestLoanScreen from "../screens/RequestLoanScreen";
import LoanManagementScreen from "../screens/LoanManagementScreen";

const Stack = createNativeStackNavigator();

const ItemsStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ItemsList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ItemsList" component={ItemsListScreen} />
      <Stack.Screen name="RequestLoan" component={RequestLoanScreen} />
      <Stack.Screen name="LoanManagement" component={LoanManagementScreen} />
    </Stack.Navigator>
  );
};

export default ItemsStackNavigator;

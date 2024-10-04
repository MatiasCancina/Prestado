import { View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import HomeScreen from "../screens/HomeScreen";
import ItemsStackNavigator from "./ItemsStackNavigator";
import LoanManagementStackNavigator from "./LoansManagementStackNavigator";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <FontAwesome5
                  name="home"
                  size={24}
                  color={focused ? "blue" : "black"}
                />
              </View>
            );
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="List"
        component={ItemsStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <FontAwesome5
                  name="list"
                  size={24}
                  color={focused ? "blue" : "black"}
                />
              </View>
            );
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Loans"
        component={LoanManagementStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <FontAwesome5
                  name="clipboard-list"
                  size={24}
                  color={focused ? "blue" : "black"}
                />
              </View>
            );
          },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

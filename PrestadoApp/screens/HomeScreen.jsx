import { View, Text } from "react-native";
import React from "react";
import { useAuthContext } from "../context/AuthContext";
import AddItemScreen from "./AddItemScreen";

const HomeScreen = () => {
  const { user } = useAuthContext();
  return (
    <View className="flex-1 justify-center items-center bg-black pt-5">
      <Text className="text-white text-2xl font-bold">
        Bienvenido {user.email}!
      </Text>
      <AddItemScreen/>
    </View>
  );
};

export default HomeScreen;

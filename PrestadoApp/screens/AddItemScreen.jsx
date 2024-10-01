import React from "react";
import { View } from "react-native";
import AddItemForm from "../components/AddItemForm";
import { useNavigation } from "@react-navigation/native";

const AddItemScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <AddItemForm navigation={navigation} />
    </View>
  );
};

export default AddItemScreen;

import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const AddItemForm = ({ navigation }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [availability, setAvailability] = useState(true);
  const [rating, setRating] = useState("");

  const handleSubmit = async () => {
    try {
      // Referencia a la colección 'items' en Firestore
      const itemsRef = collection(db, "items");

      // Agrega el nuevo ítem a Firestore
      await addDoc(itemsRef, {
        name,
        category,
        description,
        location: {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
        },
        availability,
        rating: parseFloat(rating),
      });

      Alert.alert("Success", "Item added successfully!");
      navigation.navigate("ItemsList");
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  return (
    <View className="p-4 bg-gray-200 w-screen mt-3">
      <Text className="text-2xl font-semibold text-center mb-4">Add New Item</Text>
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Latitude"
        value={location.latitude}
        onChangeText={(text) => setLocation({ ...location, latitude: text })}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Longitude"
        value={location.longitude}
        onChangeText={(text) => setLocation({ ...location, longitude: text })}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Rating"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <Button title="Add Item" onPress={handleSubmit} />
    </View>
  );
};

export default AddItemForm;

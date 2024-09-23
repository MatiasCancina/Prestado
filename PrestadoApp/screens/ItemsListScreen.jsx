import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TextInput } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ItemCard from "../components/ItemCard";

const ItemsListScreen = () => {
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const docs = [];

        querySnapshot.forEach((doc) => {
          const {
            availability,
            category,
            description,
            location,
            name,
            rating,
          } = doc.data();
          docs.push({
            id: doc.id,
            availability,
            category,
            description,
            location,
            name,
            rating,
          });
        });
        setItemsList(docs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getItemsList();
  }, []);
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Filtrar items según el texto de búsqueda
  const filteredItems = itemsList.filter((item) => {
    const searchTextLower = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchTextLower) ||
      item.category.toLowerCase().includes(searchTextLower) ||
      (item.location &&
        `${item.location.latitude}, ${item.location.longitude}`.includes(
          searchTextLower
        ))
    );
  });

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Items List</Text>

      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search by name, category or location"
        className="border-b p-2 mb-4"
      />

      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={({ item }) => <ItemCard item={item} />}
          keyExtractor={(item) => item.id}
          className="w-full"
        />
      ) : (
        <Text className="text-center text-gray-500 text-lg mt-6">
          No items found
        </Text>
      )}
    </View>
  );
};

export default ItemsListScreen;

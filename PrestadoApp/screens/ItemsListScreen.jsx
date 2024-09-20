import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ItemCard from "../components/ItemCard";

const ItemsListScreen = () => {
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Items List</Text>
      {itemsList.length > 0 ? (
        <FlatList
          data={itemsList}
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

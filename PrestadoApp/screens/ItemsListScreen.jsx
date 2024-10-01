import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TextInput,
  Switch,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ItemCard from "../components/ItemCard";
import { useIsFocused } from "@react-navigation/native";

const ItemsListScreen = ({ navigation }) => {
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [ratingMin, setRatingMin] = useState(1);
  const [ratingMax, setRatingMax] = useState(5);
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const isFocused = useIsFocused();

  const getItemsList = async () => {
    setLoading(true);
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
          lenderId,
          imageUrl,
        } = doc.data();
        docs.push({
          id: doc.id,
          availability,
          category,
          description,
          location,
          name,
          rating,
          lenderId,
          imageUrl,
        });
      });
      setItemsList(docs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getItemsList();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const filteredItems = itemsList.filter((item) => {
    const searchTextLower = searchText.toLowerCase();
    const matchesSearchText =
      item.name.toLowerCase().includes(searchTextLower) ||
      item.category.toLowerCase().includes(searchTextLower);

    const matchesRating =
      item.rating >= Number(ratingMin) && item.rating <= Number(ratingMax);

    const matchesAvailability = availabilityFilter ? item.availability : true;

    return matchesSearchText && matchesRating && matchesAvailability;
  });

  return (
    <View className="flex-1 bg-gray-100">
      {/* Filtros */}
      <View className="p-4">
        <Text className="font-bold">Filter by Rating</Text>
        <View className="mb-4 flex flex-row justify-between">
          <View className="flex-row items-center mb-2">
            <Text className="mr-2">Min Rating:</Text>
            <TextInput
              value={String(ratingMin)}
              onChangeText={(value) => setRatingMin(value)}
              keyboardType="numeric"
              className="border-b p-1 w-16 text-center"
              placeholder="1"
            />
          </View>

          <View className="flex-row items-center">
            <Text className="mr-2">Max Rating:</Text>
            <TextInput
              value={String(ratingMax)}
              onChangeText={(value) => setRatingMax(value)}
              keyboardType="numeric"
              className="border-b p-1 w-16 text-center"
              placeholder="5"
            />
          </View>
        </View>
        <View className="mb-4 flex flex-row justify-between">
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by name or category"
            className="border-b p-2 mb-4"
          />

          <View className="flex-row items-center mb-4">
            <Text className="mr-2">Available Only:</Text>
            <Switch
              value={availabilityFilter}
              onValueChange={setAvailabilityFilter}
            />
          </View>
        </View>
      </View>

      {/* Mapa */}
      <View style={{ height: 300, marginBottom: 20 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: itemsList[0]?.location?.latitude || 0,
            longitude: itemsList[0]?.location?.longitude || 0,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {filteredItems.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              title={item.name}
              description={item.description}
            />
          ))}
        </MapView>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <ItemCard item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
        className="w-full"
      />
    </View>
  );
};

export default ItemsListScreen;

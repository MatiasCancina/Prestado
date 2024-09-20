import { Text, View } from "react-native";

const ItemCard = ({ item }) => (
  <View className="bg-blue-300 rounded-lg p-4 mb-4 shadow-md">
    <Text className="text-lg font-bold mb-2">{item.name}</Text>
    <Text className="text-gray-600">Category: {item.category}</Text>
    <Text className="text-gray-600">Description: {item.description}</Text>
    <Text className="text-gray-600">
      Availability: {item.availability ? "Available" : "Not Available"}
    </Text>
    <Text className="text-gray-600">Rating: {item.rating}</Text>
    <Text className="text-gray-600">
      Location: {item.location.latitude}, {item.location.longitude}
    </Text>
  </View>
);

export default ItemCard;

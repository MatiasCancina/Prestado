import { Button, Image, Text, View } from "react-native";

const ItemCard = ({ item, navigation }) => {
  return (
    <View className="flex flex-row justify-between bg-blue-300 rounded-lg p-4 mb-4 shadow-md">
      <View>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              marginBottom: 10,
            }}
          />
        )}
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
      <View>
        <Button
          title="Solicitar Préstamo"
          onPress={() =>
            navigation.navigate("RequestLoan", {
              itemId: item.id,
              lenderId: item.lenderId,
              itemName: item.name,
            })
          }
        />
      </View>
    </View>
  );
};
export default ItemCard;

import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ItemCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("ItemDetails", {
          itemId: item.id,
          lenderId: item.lenderId,
          itemName: item.name,
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} className="w-1/3 h-full" />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
        </View>
        <Text
          style={[
            styles.availability,
            { color: item.availability ? "#6C63FF" : "#FF4C4C" },
          ]}
        >
          {item.availability ? "Available" : "Not Available"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() =>
          navigation.navigate("ItemDetails", {
            itemId: item.id,
            lenderId: item.lenderId,
            itemName: item.name,
          })
        }
      >
        <Feather name="arrow-right" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
  },
  availability: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
export default ItemCard;

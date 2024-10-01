import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuthContext } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const { user } = useAuthContext();

  const navigateToAddItem = () => {
    navigation.navigate("List", { screen: "AddItem" });
  };

  const navigateToMyItems = () => {
    navigation.navigate("MyItems");
  };

  const navigateToAllItems = () => {
    navigation.navigate("List", { screen: "ItemsList" });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user.email}!</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToAddItem}
        >
          <Feather name="plus-circle" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Add New Item</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.actionButton} onPress={navigateToMyItems}>
          <Feather name="list" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>My Items</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToAllItems}
        >
          <Feather name="search" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Explore Items</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Stats</Text>
        <View style={styles.statItem}>
          <Feather name="box" size={20} color="#6C63FF" />
          <Text style={styles.statText}>5 Items Lent</Text>
        </View>
        <View style={styles.statItem}>
          <Feather name="star" size={20} color="#6C63FF" />
          <Text style={styles.statText}>4.8 Average Rating</Text>
        </View>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F7",
  },
  header: {
    backgroundColor: "#6C63FF",
    padding: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "30%",
  },
  actionButtonText: {
    color: "#FFFFFF",
    marginTop: 5,
    textAlign: "center",
  },
  statsContainer: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default HomeScreen;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useAuthContext } from "../context/AuthContext";
import { useUserStats } from "../context/UserStatsContext";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuthContext();
  const { userStats, loading } = useUserStats();

  const navigateToAddItem = () => {
    navigation.navigate("List", { screen: "AddItem" });
  };

  const navigateToAllItems = () => {
    navigation.navigate("List", { screen: "ItemsList" });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#6C63FF" />
          ) : (
            <>
              <View style={styles.statCard}>
                <Feather name="star" size={32} color="#FFD700" />
                <Text style={styles.statValue}>{userStats?.averageRating || '0.0'}</Text>
                <Text style={styles.statLabel}>Average Rating</Text>
              </View>
              <View style={styles.statCard}>
                <Feather name="message-square" size={32} color="#6C63FF" />
                <Text style={styles.statValue}>{userStats?.reviewsCount || '0'}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              <View style={styles.statCard}>
                <Feather name="box" size={32} color="#4CAF50" />
                <Text style={styles.statValue}>{userStats?.lentItemsCount || '0'}</Text>
                <Text style={styles.statLabel}>Items Listed</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addItemButton]}
            onPress={navigateToAddItem}
          >
            <Feather name="plus-circle" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add New Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.exploreButton]}
            onPress={navigateToAllItems}
          >
            <Feather name="search" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Explore Items</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F7",
  },
  header: {
    padding: 20,
    backgroundColor: "#6C63FF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userEmail: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 5,
  },
  content: {
    flex: 1,
    backgroundColor: "#F0F0F7",
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: width * 0.28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#333",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
    flexDirection: "row",
    justifyContent: "center",
  },
  addItemButton: {
    backgroundColor: "#6C63FF",
  },
  exploreButton: {
    backgroundColor: "#4CAF50",
  },
  actionButtonText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get('window');

const ItemDetailsScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lender, setLender] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  useEffect(() => {
    if (item && item.lenderId) {
      const fetchLenderDetails = async () => {
        try {
          const lenderRef = doc(db, "users", item.lenderId);
          const lenderSnap = await getDoc(lenderRef);

          if (lenderSnap.exists()) {
            setLender(lenderSnap.data());
          } else {
            console.log("Lender not found!");
          }
        } catch (error) {
          console.error("Error fetching lender details:", error);
        }
      };

      fetchLenderDetails();
    }
  }, [item]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <Feather name="tag" size={20} color="#6C63FF" />
          <Text style={styles.infoText}>{item.category}</Text>
        </View>
        <View style={styles.infoCard}>
          <Feather name={item.availability ? "check-circle" : "x-circle"} size={20} color={item.availability ? "#4CAF50" : "#F44336"} />
          <Text style={[styles.infoText, { color: item.availability ? "#4CAF50" : "#F44336" }]}>
            {item.availability ? "Available" : "Not Available"}
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Feather name="map-pin" size={20} color="#6C63FF" />
          <Text style={styles.infoText}>
            {item.location.latitude.toFixed(6)}, {item.location.longitude.toFixed(6)}
          </Text>
        </View>
        {lender && (
          <TouchableOpacity
            style={styles.lenderCard}
            onPress={() => navigation.navigate('Loans', { screen: "UserProfile", params: { userId: item.lenderId } })}
          >
            <View style={styles.lenderAvatarContainer}>
              <Text style={styles.lenderAvatar}>{lender.email[0].toUpperCase()}</Text>
            </View>
            <View style={styles.lenderInfo}>
              <Text style={styles.lenderName}>Lender</Text>
              <Text style={styles.lenderEmail}>{lender.email}</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#6C63FF" />
          </TouchableOpacity>
        )}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() =>
            navigation.navigate("RequestLoan", {
              itemId: item.id,
              lenderId: item.lenderId,
              itemName: item.name,
            })
          }
        >
          <Text style={styles.requestButtonText}>Request Loan</Text>
          <Feather name="arrow-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#F44336",
  },
  imageContainer: {
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F7",
    borderRadius: 12,
    padding: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  lenderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  lenderAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },
  lenderAvatar: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  lenderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  lenderName: {
    fontSize: 14,
    color: "#666",
  },
  lenderEmail: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  requestButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default ItemDetailsScreen;
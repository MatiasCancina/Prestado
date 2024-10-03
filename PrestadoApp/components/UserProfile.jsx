import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import getUserReputation from "../utils/getUserReputation";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const UserProfile = ({ route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const animatedValue = new Animated.Value(0);

  // Función para obtener el email del reviewer
  const getReviewerEmail = async (reviewerId) => {
    try {
      const reviewerDoc = await getDoc(doc(db, "users", reviewerId));
      if (reviewerDoc.exists()) {
        return reviewerDoc.data().email;
      }
    } catch (error) {
      console.error("Error fetching reviewer email:", error);
    }
    return "Email not available";
  };

  // Función para obtener los datos del ítem asociado a cada reseña
  const getItemData = async (loanId) => {
    try {
      // Obtener el préstamo para obtener el itemId
      const loanDoc = await getDoc(doc(db, "loans", loanId));
      if (loanDoc.exists()) {
        const { itemId } = loanDoc.data();
        // Obtener los datos del ítem usando el itemId
        const itemDoc = await getDoc(doc(db, "items", itemId));
        if (itemDoc.exists()) {
          return itemDoc.data();
        }
      }
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
    return null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener los datos del usuario
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) {
          throw new Error("User not found");
        }
        setUserData(userDoc.data());

        // Obtener la reputación
        const avgRating = await getUserReputation(userId);
        setReputation(avgRating);

        // Obtener las reseñas
        const q = query(
          collection(db, "reviews"),
          where("lenderId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const reviewsSnapshot = await getDocs(q);
        const reviewsData = await Promise.all(
          reviewsSnapshot.docs.map(async (doc) => {
            const review = doc.data();
            const reviewerEmail = await getReviewerEmail(review.reviewerId);
            const itemData = await getItemData(review.loanId); // Obtener los datos del ítem

            return {
              id: doc.id,
              ...review,
              reviewerEmail,
              itemData, // Añadir los datos del ítem
            };
          })
        );
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Feather
        key={index}
        name={index < Math.round(rating) ? "star" : "star"}
        size={16}
        color={index < Math.round(rating) ? "#FFD700" : "#E0E0E0"}
        style={styles.star}
      />
    ));
  };

  const renderReviewItem = ({ item }) => (
    <Animated.View style={[styles.reviewItem, { opacity: animatedValue }]}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerEmail}>{item.reviewerEmail}</Text>
        <Text style={styles.reviewDate}>
          {new Date(item.createdAt.toDate()).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.ratingContainer}>
        {renderStars(item.rating)}
      </View>
      <Text style={styles.reviewText}>{item.review}</Text>
      {item.itemData && (
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>Item Reviewed: {item.itemData.name}</Text>
          <Text style={styles.itemDescription}>{item.itemData.description}</Text>
        </View>
      )}
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="user-x" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.reputationContainer, { opacity: animatedValue }]}>
        <Text style={styles.reputationTitle}>User Profile</Text>
        <View style={styles.userInfoContainer}>
          <Feather name="user" size={24} color="#6C63FF" style={styles.userIcon} />
          <Text style={styles.userEmail}>{userData.email || "Email not available"}</Text>
        </View>
        <View style={styles.reputationContent}>
          <Text style={styles.reputationScore}>{reputation ? reputation.toFixed(1) : "N/A"}</Text>
          <View style={styles.starsContainer}>
            {reputation ? renderStars(reputation) : <Text>No ratings yet</Text>}
          </View>
        </View>
        <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
      </Animated.View>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reviewsList}
          ListHeaderComponent={<Text style={styles.reviewsTitle}>Recent Reviews</Text>}
        />
      ) : (
        <Text style={styles.noReviewsText}>No reviews yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F7",
    padding: 16,
    marginTop: 50,
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
    marginTop: 16,
    fontSize: 18,
    color: "#FF6B6B",
    textAlign: "center",
  },
  reputationContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  reputationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userIcon: {
    marginRight: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "#333",
  },
  reputationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reputationScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  reviewsList: {
    paddingBottom: 16,
  },
  reviewItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
  reviewerEmail: {
    fontSize: 14,
    color: "#888",
  },
  noReviewsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default UserProfile;
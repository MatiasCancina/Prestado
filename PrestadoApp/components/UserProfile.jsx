import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Animated, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import getUserReputation from "../utils/getUserReputation";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const { width } = Dimensions.get('window');

const UserProfile = ({ route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const animatedValue = new Animated.Value(0);

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

  const getItemData = async (loanId) => {
    try {
      const loanDoc = await getDoc(doc(db, "loans", loanId));
      if (loanDoc.exists()) {
        const { itemId } = loanDoc.data();
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
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) {
          throw new Error("User not found");
        }
        setUserData(userDoc.data());

        const avgRating = await getUserReputation(userId);
        setReputation(avgRating);

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
            const itemData = await getItemData(review.loanId);

            return {
              id: doc.id,
              ...review,
              reviewerEmail,
              itemData,
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
        <View style={styles.reviewerInfo}>
          <Feather name="user" size={16} color="#6C63FF" style={styles.reviewerIcon} />
          <Text style={styles.reviewerEmail}>{item.reviewerEmail}</Text>
        </View>
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
          <Text style={styles.itemTitle}>{item.itemData.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>{item.itemData.description}</Text>
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
      <Animated.View style={[styles.userInfoContainer, { opacity: animatedValue }]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{userData.email[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.userEmail}>{userData.email || "Email not available"}</Text>
        <View style={styles.reputationContent}>
          <Text style={styles.reputationScore}>{reputation ? reputation.toFixed(1) : "N/A"}</Text>
          <View style={styles.starsContainer}>
            {reputation ? renderStars(reputation) : <Text style={styles.noRatingsText}>No ratings yet</Text>}
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
  userInfoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userEmail: {
    fontSize: 18,
    color: "#333",
    marginBottom: 16,
  },
  reputationContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reputationScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#6C63FF",
    marginRight: 16,
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    marginRight: 4,
  },
  noRatingsText: {
    fontSize: 14,
    color: "#666",
  },
  reviewCount: {
    fontSize: 16,
    color: "#666",
  },
  reviewsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  reviewsList: {
    paddingBottom: 16,
  },
  reviewItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerIcon: {
    marginRight: 8,
  },
  reviewerEmail: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  itemInfo: {
    backgroundColor: "#F0F0F7",
    borderRadius: 8,
    padding: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: "#666",
  },
  noReviewsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default UserProfile;
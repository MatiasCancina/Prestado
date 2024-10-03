import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";

const ReviewForm = ({ route, navigation }) => {
  const { loanId, lenderId, reviewerId, itemName } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reviewInputRef = useRef(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "reviews"), {
        loanId,
        lenderId,
        reviewerId,
        rating,
        review,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Review submitted", "Thank you for your rating.", [
        { text: "OK", onPress: () => navigation.navigate("UserProfile", { userId: lenderId }) },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while submitting the review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starContainer}
        >
          <Feather
            name={i <= rating ? "star" : "star"}
            size={40}
            color={i <= rating ? "#6C63FF" : "#c8c7c8"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleReviewSubmit = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Feather name="star" size={50} color="#6C63FF" style={styles.icon} />
        <Text style={styles.title}>Rate the loan</Text>
        <Text style={styles.itemName}>{itemName}</Text>

        <View style={styles.ratingContainer}>{renderStars()}</View>

        <TextInput
          ref={reviewInputRef}
          placeholder="Describe your experience with the loan"
          value={review}
          onChangeText={setReview}
          style={styles.input}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          blurOnSubmit={true}
          onSubmitEditing={handleReviewSubmit}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F7",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    alignItems: "center",
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  starContainer: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: "100%",
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ReviewForm;
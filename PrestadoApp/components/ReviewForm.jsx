import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { Rating } from "react-native-ratings";
import { db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const ReviewForm = ({ route, navigation }) => {
  const { loanId, lenderId, reviewerId } = route.params;
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    if (parseInt(rating, 10) < 1 || parseInt(rating, 10) > 5) {
      Alert.alert("Error", "La calificación debe estar entre 1 y 5.");
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        loanId,
        lenderId,
        reviewerId,
        rating: parseInt(rating, 10),
        review,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Reseña enviada", "Gracias por tu valoración.");
      navigation.navigate("LoanManagement");
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      Alert.alert("Error", "Ocurrió un error al enviar la reseña.");
    }
  };

  return (
    <View>
      <Text>Valorar el préstamo</Text>

      <Rating
        showRating
        startingValue={rating}
        onFinishRating={setRating}
        style={{ paddingVertical: 10 }}
        minValue={1}
        maxValue={5}
      />

      <TextInput
        placeholder="Escribe una reseña"
        value={review}
        onChangeText={setReview}
        style={{ borderWidth: 1, marginBottom: 10, height: 100 }}
        multiline
      />
      <Button title="Enviar Reseña" onPress={handleSubmit} />
    </View>
  );
};

export default ReviewForm;

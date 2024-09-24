import { View, Text, Button } from "react-native";
import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const RequestLoanScreen = ({ route, navigation }) => {
  const { itemId, lenderId, itemName } = route.params;
  const { user } = useAuthContext();

  const handleRequestLoan = async () => {
    try {
      await addDoc(collection(db, "loans"), {
        itemId: itemId,
        borrowerId: user.uid,
        lenderId: lenderId,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert("Solicitud de préstamo enviada");
      navigation.navigate("ItemsList");
    } catch (error) {
      console.error("Error requesting loan:", error);
    }
  };

  return (
    <View className='flex-1 justify-center items-center'>
      <Text>Estás solicitando el préstamo del ítem: {itemName}</Text>
      <Button title="Confirmar Solicitud" onPress={handleRequestLoan} />
    </View>
  );
};

export default RequestLoanScreen;

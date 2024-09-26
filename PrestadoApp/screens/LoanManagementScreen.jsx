import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, ActivityIndicator } from "react-native";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const LoanManagementScreen = () => {
  const { user } = useAuthContext();  // Obtener el usuario autenticado
  const [loans, setLoans] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();  // Hook para la navegación

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "loans"),
        where("borrowerId", "==", user.uid)  // Préstamos donde es prestatario
      );

      const loansSnapshot = await getDocs(q);
      const fetchedLoans = loansSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate ? data.startDate.toDate() : null,
          endDate: data.endDate ? data.endDate.toDate() : null,
        };
      });

      setLoans(fetchedLoans);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markLoanStart = async (loanId) => {
    try {
      const loanDoc = doc(db, "loans", loanId);
      const startDate = new Date(); 
      await updateDoc(loanDoc, {
        status: "active",
        startDate: startDate, 
        updatedAt: serverTimestamp(),
      });

      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === loanId
            ? { ...loan, status: "active", startDate: startDate }
            : loan
        )
      );
      alert("Préstamo iniciado");
    } catch (error) {
      console.error("Error al iniciar el préstamo:", error);
    }
  };

  const markLoanEnd = async (loan) => {
    try {
      const loanDoc = doc(db, "loans", loan.id);
      const endDate = new Date(); 
      await updateDoc(loanDoc, {
        status: "completed",
        endDate: endDate, 
        updatedAt: serverTimestamp(),
      });
  
      setLoans((prevLoans) =>
        prevLoans.map((l) =>
          l.id === loan.id
            ? { ...l, status: "completed", endDate: endDate }
            : l
        )
      );
      alert("Préstamo finalizado");
  
      // Redirigir al formulario de reseñas después de completar el préstamo
      navigation.navigate('ReviewForm', {
        loanId: loan.id,         // ID del préstamo
        lenderId: loan.lenderId, // ID del prestador
        reviewerId: user.uid,    // Prestatario es el que deja la reseña
      });
    } catch (error) {
      console.error("Error al finalizar el préstamo:", error);
    }
  };
  

  useEffect(() => {
    if (isFocused) {
      fetchLoans();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <Text className="font-semibold text-xl mb-5">Gestión de Préstamos</Text>
      <FlatList
        data={loans}
        keyExtractor={(loan) => loan.id}
        renderItem={({ item: loan }) => (
          <View className="bg-blue-200 my-2 p-4">
            <Text>Ítem: {loan.itemId}</Text>
            <Text>Estado: {loan.status}</Text>
            <Text>
              Fecha de inicio:
              {loan.startDate ? loan.startDate.toString() : "No iniciado"}
            </Text>
            <Text>
              Fecha de fin:
              {loan.endDate ? loan.endDate.toString() : "No finalizado"}
            </Text>

            {/* Botón para ver el perfil del prestador */}
            <Button
              title="Ver perfil del prestador"
              onPress={() =>
                navigation.navigate('UserProfile', { userId: loan.lenderId })
              }
            />

            {loan.status === "pending" && (
              <Button
                title="Iniciar Préstamo"
                onPress={() => markLoanStart(loan.id)}
              />
            )}

            {loan.status === "active" && (
              <Button
                title="Finalizar Préstamo"
                onPress={() => markLoanEnd(loan)}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default LoanManagementScreen;

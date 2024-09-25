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
import { useIsFocused } from "@react-navigation/native";

const LoanManagementScreen = () => {
  const { user } = useAuthContext();
  const [loans, setLoans] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "loans"),
        where("borrowerId", "==", user.uid) // Préstamos donde es prestatario
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

  // Función para marcar el inicio del préstamo
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
    
  //Funcion para marcar fin de prestamo 
  const markLoanEnd = async (loanId) => {
    try {
      const loanDoc = doc(db, "loans", loanId);
      const endDate = new Date(); 
      await updateDoc(loanDoc, {
        status: "completed",
        endDate: endDate, 
        updatedAt: serverTimestamp(),
      });

      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === loanId
            ? { ...loan, status: "completed", endDate: endDate }
            : loan
        )
      );
      alert("Préstamo finalizado");
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

  console.log(loans);

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
              Fecha de inicio:{" "}
              {loan.startDate ? loan.startDate.toString() : "No iniciado"}
            </Text>
            <Text>
              Fecha de fin:{" "}
              {loan.endDate ? loan.endDate.toString() : "No finalizado"}
            </Text>

            {loan.status === "pending" && (
              <Button
                title="Iniciar Préstamo"
                onPress={() => markLoanStart(loan.id)}
              />
            )}

            {loan.status === "active" && (
              <Button
                title="Finalizar Préstamo"
                onPress={() => markLoanEnd(loan.id)}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default LoanManagementScreen;

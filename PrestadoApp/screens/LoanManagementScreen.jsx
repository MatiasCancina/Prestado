import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
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
import { Feather } from "@expo/vector-icons";

const LoanManagementScreen = () => {
  const { user } = useAuthContext();
  const [loans, setLoans] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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
          plannedStartDate: data.plannedStartDate
            ? data.plannedStartDate.toDate()
            : null,
          plannedEndDate: data.plannedEndDate
            ? data.plannedEndDate.toDate()
            : null,
          actualStartDate: data.actualStartDate
            ? data.actualStartDate.toDate()
            : null,
          actualEndDate: data.actualEndDate
            ? data.actualEndDate.toDate()
            : null,
        };
      });

      setLoans(fetchedLoans);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markLoanStart = async (loan) => {
    let loanId = loan.id;
    try {
      const loanDoc = doc(db, "loans", loanId);
      const itemDoc = doc(db, "items", loan.itemId);
      const actualStartDate = new Date();

      // Actualizar el estado del préstamo
      await updateDoc(loanDoc, {
        status: "active",
        actualStartDate: actualStartDate,
        updatedAt: serverTimestamp(),
      });

      // Actualizar la disponibilidad del ítem a 'false'
      await updateDoc(itemDoc, {
        availability: false,
      });

      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === loanId
            ? { ...loan, status: "active", actualStartDate: actualStartDate }
            : loan
        )
      );
      alert("Loan started successfully");
    } catch (error) {
      console.error("Error starting the loan:", error);
    }
  };

  const markLoanEnd = async (loan) => {
    try {
      if (!loan.id || !loan.itemId) {
        throw new Error("Invalid loan data: missing id or itemId");
      }

      const loanDoc = doc(db, "loans", loan.id);
      const itemDoc = doc(db, "items", loan.itemId);
      const actualEndDate = new Date();

      await updateDoc(loanDoc, {
        status: "completed",
        actualEndDate: actualEndDate,
        updatedAt: serverTimestamp(),
      });

      // Actualizar la disponibilidad del ítem a 'false'
      try {
        await updateDoc(itemDoc, {
          availability: true,
        });
      } catch (itemUpdateError) {
        console.error("Error updating item availability:", itemUpdateError);
      }

      setLoans((prevLoans) =>
        prevLoans.map((l) =>
          l.id === loan.id
            ? { ...l, status: "completed", actualEndDate: actualEndDate }
            : l
        )
      );
      Alert.alert("Loan completed successfully");

      navigation.navigate("ReviewForm", {
        loanId: loan.id,
        lenderId: loan.lenderId,
        reviewerId: user.uid,
        itemName: loan.itemName,
      });
    } catch (error) {
      Alert.alert(`Error ending the loan: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchLoans();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  const renderLoanItem = ({ item: loan }) => (
    <View style={styles.loanCard}>
      <View style={styles.loanHeader}>
        <Text style={styles.loanTitle}>Loan for Item: {loan.itemName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(loan.status) },
          ]}
        >
          <Text style={styles.statusText}>{loan.status}</Text>
        </View>
      </View>
      <View style={styles.loanDetails}>
        <View style={styles.detailRow}>
          <Feather name="calendar" size={16} color="#6C63FF" />
          <Text style={styles.detailText}>
            Planned Start:{" "}
            {loan.plannedStartDate
              ? loan.plannedStartDate.toLocaleDateString()
              : "Not set"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Feather name="calendar" size={16} color="#6C63FF" />
          <Text style={styles.detailText}>
            Planned End:{" "}
            {loan.plannedEndDate
              ? loan.plannedEndDate.toLocaleDateString()
              : "Not set"}
          </Text>
        </View>
        {loan.actualStartDate && (
          <View style={styles.detailRow}>
            <Feather name="play-circle" size={16} color="#4CAF50" />
            <Text style={styles.detailText}>
              Actual Start: {loan.actualStartDate.toLocaleDateString()}
            </Text>
          </View>
        )}
        {loan.actualEndDate && (
          <View style={styles.detailRow}>
            <Feather name="check-circle" size={16} color="#F44336" />
            <Text style={styles.detailText}>
              Actual End: {loan.actualEndDate.toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("UserProfile", { userId: loan.lenderId })
          }
        >
          <Feather name="user" size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Lender Profile</Text>
        </TouchableOpacity>
        {loan.status === "pending" && (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={() => markLoanStart(loan)}
          >
            <Feather name="play" size={16} color="#FFFFFF" />
            <Text style={styles.buttonText}>Start Loan</Text>
          </TouchableOpacity>
        )}
        {loan.status === "active" && (
          <TouchableOpacity
            style={[styles.button, styles.endButton]}
            onPress={() => markLoanEnd(loan)}
          >
            <Feather name="check" size={16} color="#FFFFFF" />
            <Text style={styles.buttonText}>End Loan</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "active":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      default:
        return "#6C63FF";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Loan Management</Text>
      {loans.length ? (
        <FlatList
          data={loans}
          keyExtractor={(loan) => loan.id}
          renderItem={renderLoanItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (<Text style={{color: 'gray'}}>No loans yet</Text>)}
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
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 16,
  },
  loanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  loanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  loanTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  loanDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C63FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  endButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default LoanManagementScreen;

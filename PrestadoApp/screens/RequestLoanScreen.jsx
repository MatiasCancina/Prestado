import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuthContext } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const RequestLoanScreen = ({ route, navigation }) => {
  const { itemId, lenderId, itemName } = route.params;
  const { user } = useAuthContext();
  const [plannedStartDate, setPlannedStartDate] = useState(new Date());
  const [plannedEndDate, setPlannedEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleRequestLoan = async () => {
    if (plannedStartDate >= plannedEndDate) {
      Alert.alert("Error", "End date must be after start date");
      return;
    }

    try {
      await addDoc(collection(db, "loans"), {
        itemId: itemId,
        borrowerId: user.uid,
        lenderId: lenderId,
        itemName: itemName,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        plannedStartDate: plannedStartDate,
        plannedEndDate: plannedEndDate,
        actualStartDate: null,
        actualEndDate: null
      });
      Alert.alert("Success", "Loan request sent successfully", [
        { text: "OK", onPress: () => navigation.navigate("Loans") }
      ]);
    } catch (error) {
      console.error("Error requesting loan:", error);
      Alert.alert("Error", "Failed to send loan request. Please try again.");
    }
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || plannedStartDate;
    setShowStartPicker(false);
    setPlannedStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || plannedEndDate;
    setShowEndPicker(false);
    setPlannedEndDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Feather name="package" size={50} color="#6C63FF" style={styles.icon} />
        <Text style={styles.title}>Loan Request</Text>
        <Text style={styles.itemName}>{itemName}</Text>
        
        <View style={styles.dateContainer}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
            <Feather name="calendar" size={24} color="#6C63FF" />
            <Text style={styles.dateButtonText}>Planned Start: {plannedStartDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={plannedStartDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.dateContainer}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
            <Feather name="calendar" size={24} color="#6C63FF" />
            <Text style={styles.dateButtonText}>Planned End: {plannedEndDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={plannedEndDate}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
              minimumDate={plannedStartDate}
            />
          )}
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleRequestLoan}>
          <Text style={styles.confirmButtonText}>Confirm Request</Text>
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
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    width: "90%",
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
  dateContainer: {
    width: "100%",
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F7",
    borderRadius: 10,
    padding: 15,
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RequestLoanScreen;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ItemCard from "../components/ItemCard";
import { useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const ItemsListScreen = ({ navigation }) => {
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [ratingMin, setRatingMin] = useState(1);
  const [ratingMax, setRatingMax] = useState(5);
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isFocused = useIsFocused();

  const getItemsList = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
      const docs = [];

      querySnapshot.forEach((doc) => {
        const {
          availability,
          category,
          description,
          location,
          name,
          rating,
          lenderId,
          imageUrl,
        } = doc.data();
        docs.push({
          id: doc.id,
          availability,
          category,
          description,
          location,
          name,
          rating,
          lenderId,
          imageUrl,
        });
      });
      setItemsList(docs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getItemsList();
    }
  }, [isFocused]);

  const filteredItems = itemsList.filter((item) => {
    const searchTextLower = searchText.toLowerCase();
    const matchesSearchText =
      item.name.toLowerCase().includes(searchTextLower) ||
      item.category.toLowerCase().includes(searchTextLower);

    const matchesRating =
      item.rating >= Number(ratingMin) && item.rating <= Number(ratingMax);

    const matchesAvailability = availabilityFilter ? item.availability : true;

    return matchesSearchText && matchesRating && matchesAvailability;
  });

  const openMapView = () => {
    navigation.navigate("MapView", { items: filteredItems });
  };

  const incrementRating = (setter, value, max) => {
    setter((prevValue) => Math.min(prevValue + 1, max));
  };

  const decrementRating = (setter, value, min) => {
    setter((prevValue) => Math.max(prevValue - 1, min));
  };

  const resetFilters = () => {
    setRatingMin(1);
    setRatingMax(5);
    setAvailabilityFilter(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Items</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
            <Feather name="sliders" size={24} color="#6C63FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openMapView} style={styles.mapButton}>
            <Feather name="map" size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#6C63FF"
          style={styles.searchIcon}
        />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by name or category"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <ItemCard item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilters}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>Filters</Text>
            <View style={styles.ratingFilter}>
              <Text style={styles.filterLabel}>Min Rating: {ratingMin}</Text>
              <View style={styles.ratingControls}>
                <TouchableOpacity
                  onPress={() => decrementRating(setRatingMin, ratingMin, 1)}
                  style={styles.ratingButton}
                >
                  <Feather name="minus" size={20} color="#6C63FF" />
                </TouchableOpacity>
                <Text style={styles.ratingValue}>{ratingMin}</Text>
                <TouchableOpacity
                  onPress={() => incrementRating(setRatingMin, ratingMin, 5)}
                  style={styles.ratingButton}
                >
                  <Feather name="plus" size={20} color="#6C63FF" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.ratingFilter}>
              <Text style={styles.filterLabel}>Max Rating: {ratingMax}</Text>
              <View style={styles.ratingControls}>
                <TouchableOpacity
                  onPress={() => decrementRating(setRatingMax, ratingMax, 1)}
                  style={styles.ratingButton}
                >
                  <Feather name="minus" size={20} color="#6C63FF" />
                </TouchableOpacity>
                <Text style={styles.ratingValue}>{ratingMax}</Text>
                <TouchableOpacity
                  onPress={() => incrementRating(setRatingMax, ratingMax, 5)}
                  style={styles.ratingButton}
                >
                  <Feather name="plus" size={20} color="#6C63FF" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.availabilityFilter}>
              <Text style={styles.filterLabel}>Available Only</Text>
              <Switch
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
                trackColor={{ false: "#767577", true: "#6C63FF" }}
                thumbColor={availabilityFilter ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
            <View style={styles.filterButtonsContainer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
  },
  filterButton: {
    padding: 8,
    marginRight: 8,
  },
  mapButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    margin: 16,
    paddingHorizontal: 16,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  filterLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  ratingFilter: {
    marginBottom: 16,
  },
  ratingControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F0F7",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ratingButton: {
    padding: 8,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  availabilityFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resetButton: {
    backgroundColor: "#F0F0F7",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  resetButtonText: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ItemsListScreen;
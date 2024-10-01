import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db, storage } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Feather } from "@expo/vector-icons";

const AddItemForm = ({ navigation }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [availability, setAvailability] = useState(true);
  const [rating, setRating] = useState(0);
  const [imageUri, setImageUri] = useState(null);
  const { user } = useAuthContext();

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || galleryStatus !== "granted") {
      Alert.alert(
        "Permisos faltantes",
        "Se requieren permisos para acceder a la cámara y a la galería.",
        [{ text: "Ok" }]
      );
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating for the item.");
      return;
    }

    try {
      let imageUrl = "";
      if (imageUri) {
        const imageName = `items/${generateUniqueId()}`;
        const storageRef = ref(storage, imageName);
        const img = await fetch(imageUri);
        const bytes = await img.blob();
        await uploadBytes(storageRef, bytes);
        imageUrl = await getDownloadURL(storageRef);
      }

      const itemsRef = collection(db, "items");

      await addDoc(itemsRef, {
        name,
        category,
        description,
        location: {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
        },
        availability,
        rating,
        lenderId: user.uid,
        imageUrl,
        createdAt: new Date(),
      });

      navigation.navigate("ItemsList");
      Alert.alert("Success", "Item added successfully!");
    } catch (error) {
      console.log("Error", error.message);
      Alert.alert("Error", "Ocurrió un error al agregar el ítem.");
    }
  };

  const RatingStars = () => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
          >
            <Feather
              name='star'
              size={30}
              color={star <= rating ? "#FFD700" : "#6C63FF"}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Text style={styles.title}>Add New Item</Text>

      <View style={styles.inputContainer}>
        <Feather
          name="box"
          size={20}
          color="#6C63FF"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather
          name="tag"
          size={20}
          color="#6C63FF"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather
          name="file-text"
          size={20}
          color="#6C63FF"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather
          name="map-pin"
          size={20}
          color="#6C63FF"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={location.latitude}
          onChangeText={(text) => setLocation({ ...location, latitude: text })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather
          name="map-pin"
          size={20}
          color="#6C63FF"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={location.longitude}
          onChangeText={(text) => setLocation({ ...location, longitude: text })}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.ratingLabel}>Rating:</Text>
      <RatingStars />

      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImageFromGallery}
        >
          <Feather name="image" size={20} color="#FFFFFF" />
          <Text style={styles.imageButtonText}>Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Feather name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.imageButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F0F0F7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    paddingTop: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: "#FFFFFF",
    marginLeft: 5,
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddItemForm;
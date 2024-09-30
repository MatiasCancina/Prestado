import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, Image, ScrollView } from "react-native";
import { db, storage } from "../firebaseConfig"; // Asegúrate de tener la configuración de Firebase Storage
import { addDoc, collection } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Importar funciones de Firebase Storage

const AddItemForm = ({ navigation }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [availability, setAvailability] = useState(true);
  const [rating, setRating] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const { user } = useAuthContext();

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
      Alert.alert(
        "Permisos faltantes",
        "Se requieren permisos para acceder a la cámara y a la galería.",
        [{ text: "Ok" }]
      );
    }
  };

  // Llama a requestPermissions en el primer renderizado
  useEffect(() => {
    requestPermissions();
  }, []);

  // Función para abrir la galería de imágenes
  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Almacenar URI de la imagen seleccionada
    }
  };

  // Función para sacar una foto desde la cámara
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Almacenar URI de la imagen tomada
    }
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Genera un ID único basado en la fecha y un número aleatorio
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = "";
      if (imageUri) {
        const imageName = `items/${generateUniqueId()}`; // Nombre único para la imagen
        const storageRef = ref(storage, imageName);
        const img = await fetch(imageUri);
        const bytes = await img.blob(); // Convertir la imagen en blob
        await uploadBytes(storageRef, bytes); // Subir la imagen a Firebase Storage
        imageUrl = await getDownloadURL(storageRef); // Obtener la URL de la imagen
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
        rating: parseFloat(rating),
        lenderId: user.uid, // ID del prestador
        imageUrl,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Item added successfully!");
    } catch (error) {
      console.log("Error", error.message);
      Alert.alert("Error", "Ocurrió un error al agregar el ítem.");
    }
  };

  return (
    <ScrollView className="p-4 bg-gray-200 w-screen mt-3 mb-4">
      <Text className="text-2xl font-semibold text-center mb-4">
        Add New Item
      </Text>
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Latitude"
        value={location.latitude}
        onChangeText={(text) => setLocation({ ...location, latitude: text })}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Longitude"
        value={location.longitude}
        onChangeText={(text) => setLocation({ ...location, longitude: text })}
      />
      <TextInput
        className="h-10 border-b border-gray-400 mb-3 px-2"
        placeholder="Rating"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <Button
        title="Choose Image from Gallery"
        onPress={pickImageFromGallery}
      />
      <Button title="Take Photo" onPress={takePhoto} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}

      <Button title="Add Item" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default AddItemForm;

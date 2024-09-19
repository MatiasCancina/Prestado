import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebaseConfig"; // Asegúrate de la ruta correcta
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { TouchableOpacity } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
<View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <View className="w-full max-w-sm">
        <Text className="text-2xl font-bold mb-6 text-center text-gray-800">Login / Register</Text>
        
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 mb-6"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity
          className="w-full bg-blue-500 rounded-md py-2 mb-4"
          onPress={handleRegister}
        >
          <Text className="text-white text-center font-semibold">Register</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="w-full bg-green-500 rounded-md py-2"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>  );
};

export default LoginScreen;

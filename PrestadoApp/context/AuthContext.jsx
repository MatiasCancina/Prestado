// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "../firebaseConfig";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/auth";
// import { useNavigation } from "@react-navigation/native";

// const AuthContext = createContext();

// export const useAuthContext = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const navigation = useNavigation();

//   const registerUser = async (email, password) => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error("Error registering user:", error.message);
//     }
//   };

//   const loginUser = async (email, password) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error("Error logging in:", error.message);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       navigation.navigate("Login");
//     } catch (error) {
//       console.error("Error logging out:", error.message);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//         navigation.navigate("Home");
//       } else {
//         setUser(null);
//         navigation.navigate("Login");
//       }
//     });

//     return () => unsubscribe();
//   }, [navigation]);

//   return (
//     <AuthContext.Provider value={{ user, registerUser, loginUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  // Función para guardar el usuario en AsyncStorage
  const storeUser = async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to AsyncStorage:", error.message);
    }
  };

  // Función para recuperar el usuario de AsyncStorage
  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error loading user from AsyncStorage:", error.message);
    }
  };

  // Función para eliminar el usuario de AsyncStorage (cuando se cierra sesión)
  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error("Error removing user from AsyncStorage:", error.message);
    }
  };

  const registerUser = async (email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      storeUser(user); // Guardar el usuario en AsyncStorage
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      storeUser(user); // Guardar el usuario en AsyncStorage
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      removeUser(); // Eliminar el usuario de AsyncStorage
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    // Verificar si hay un usuario almacenado al cargar la app
    loadUser();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        storeUser(user); // Guardar el usuario en AsyncStorage
        navigation.navigate("Home");
      } else {
        setUser(null);
        removeUser(); // Eliminar el usuario de AsyncStorage si se desloguea
        navigation.navigate("Login");
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <AuthContext.Provider value={{ user, registerUser, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

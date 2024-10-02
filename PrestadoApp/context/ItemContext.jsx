import React, { createContext, useContext, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const ItemContext = createContext();

export const useItemContext = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = async (newItem) => {
    try {
      const docRef = await addDoc(collection(db, "items"), newItem);
      setItems([...items, { ...newItem, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding item:", error.message);
    }
  };

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemsList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setItems(itemsList);
    } catch (error) {
      console.error("Error fetching items:", error.message);
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const itemRef = doc(db, "items", id);
      await updateDoc(itemRef, updatedItem);
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
    } catch (error) {
      console.error("Error updating item:", error.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  return (
    <ItemContext.Provider
      value={{ items, addItem, fetchItems, updateItem, deleteItem }}
    >
      {children}
    </ItemContext.Provider>
  );
};

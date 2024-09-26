import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const getUserReputation = async (userId) => {
  try {
    // Consultar todas las reseñas donde el 'lenderId' es el 'userId'
    const q = query(collection(db, "reviews"), where("lenderId", "==", userId));
    const reviewsSnapshot = await getDocs(q);

    let totalRating = 0;
    let reviewCount = 0;

    // Iterar a través de las reseñas y calcular el total y el número de reseñas
    reviewsSnapshot.forEach((doc) => {
      const reviewData = doc.data();
      totalRating += reviewData.rating; // Sumar cada rating
      reviewCount += 1;
    });

    // Calcular la media del rating, o devolver 0 si no hay reseñas
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    return averageRating;
  } catch (error) {
    console.error("Error al calcular la reputación:", error);
    return 0;
  }
};

export default getUserReputation;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthContext } from "./AuthContext";

const UserStatsContext = createContext();

export const useUserStats = () => useContext(UserStatsContext);

export const UserStatsProvider = ({ children }) => {
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();

    const fetchUserStats = async () => {
        try {
            const reviewsQuery = query(
                collection(db, "reviews"),
                where("lenderId", "==", user.uid)
            );
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviewsCount = reviewsSnapshot.size;

            let totalRating = 0;
            reviewsSnapshot.forEach((doc) => {
                totalRating += doc.data().rating;
            });
            const averageRating = reviewsCount > 0 ? (totalRating / reviewsCount).toFixed(1) : 0;

            const itemsQuery = query(
                collection(db, "items"),
                where("lenderId", "==", user.uid)
            );
            const itemsSnapshot = await getDocs(itemsQuery);
            const lentItemsCount = itemsSnapshot.size;

            setUserStats({
                reviewsCount,
                averageRating,
                lentItemsCount,
            });
        } catch (error) {
            console.error("Error fetching user stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserStats();
        }
    }, [user]);

    const updateLentItemsCount = (increment = 1) => {
        setUserStats(prevStats => ({
            ...prevStats,
            lentItemsCount: prevStats.lentItemsCount + increment
        }));
    };

    return (
        <UserStatsContext.Provider value={{ userStats, loading, fetchUserStats, updateLentItemsCount }}>
            {children}
        </UserStatsContext.Provider>
    );
};
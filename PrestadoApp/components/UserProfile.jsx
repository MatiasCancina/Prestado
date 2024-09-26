import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import getUserReputation from "../utils/getUserReputation"; 

const UserProfile = ({ route }) => {
  const { userId } = route.params;  // userId del prestador
  const [reputation, setReputation] = useState(null);

  useEffect(() => {
    const fetchReputation = async () => {
      const avgRating = await getUserReputation(userId); 
      setReputation(avgRating);
    };

    fetchReputation();
  }, [userId]);

  if (reputation === null) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>Reputación del usuario: {reputation.toFixed(1)} / 5</Text>
    </View>
  );
};

export default UserProfile;

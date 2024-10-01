import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

const CustomMarker = ({ item }) => (
  <View style={styles.markerContainer}>
    <Image source={{ uri: item.imageUrl }} style={styles.markerImage} />
  </View>
);

const MapScreen = ({ route }) => {
  const { items } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: items[0]?.location?.latitude || 0,
          longitude: items[0]?.location?.longitude || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {items.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
          >
            <CustomMarker item={item} />
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{item.name}</Text>
                <Text style={styles.calloutDescription}>{item.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  markerImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
  },
});

export default MapScreen;
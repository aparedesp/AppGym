import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const athletes = [
  { id: "1", name: "Usain Bolt", image: require("../assets/bolt.png") },
  { id: "2", name: "Muhammad ali", image: require("../assets/ali.png") },
  { id: "3", name: "Ronaldo", image: require("../assets/ronaldo.png") },
  { id: "4", name: "Nadal", image: require("../assets/nadal.png") },
  {
    id: "5",
    name: "Michael Jordan",
    image: require("../assets/jordan.png"),
  },
];

const AtletasScreen = () => {
  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.header}>Lista de Atletas</Text>

      {/* Lista de Atletas */}
      <View style={styles.body}>
        {athletes.map((athlete) => (
          <TouchableOpacity key={athlete.id} style={styles.circleButton}>
            <ImageBackground
              source={athlete.image}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <Text style={styles.buttonText}>{athlete.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfadf",
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#3a8c0c",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  circleButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#567838",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    overflow: "hidden",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute", // Esto coloca el texto sobre la imagen
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});

export default AtletasScreen;

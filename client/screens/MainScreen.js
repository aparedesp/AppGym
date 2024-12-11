import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MainScreen({ route, navigation }) {
  const { user } = route.params; // Obtiene los parámetros enviados

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const items = [
    {
      index: "1",
      name: "Perfil",
      imagen: require("../assets/perfil.png"),
      screen: "Perfil",
    },
    {
      index: "2",
      name: "Reserva",
      imagen: require("../assets/reserva.png"),
      screen: "Reserva", // Define la ruta de navegación
    },
    {
      index: "3",
      name: "Pagos",
      imagen: require("../assets/pagos.png"),
      screen: "Pagos",
    },
    {
      index: "4",
      name: "Chat",
      imagen: require("../assets/chat2.png"),
      screen: "Chat",
    },
    {
      index: "5",
      name: "Equipate",
      imagen: require("../assets/equipate.png"),
      screen: "Equipate",
    },
    {
      index: "6",
      name: "Atletas",
      imagen: require("../assets/atleta.png"),
      screen: "Atletas",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.title}>Proyecto DAM - Grupo 5</Text>
        <Ionicons name="logo-react" size={32} color="#fff" />
      </View>

      {/* Cuerpo */}

      <View style={styles.body}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.index}
            style={styles.circleButton}
            onPress={() => {
              if (item.screen) {
                navigation.navigate(item.screen); // Navega a la pantalla indicada
              }
            }}
          >
            <ImageBackground
              source={item.imagen} // Ruta local de la imagen
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <Text style={styles.buttonText}>{item.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pie */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => openLink("https://facebook.com")}>
          <Ionicons name="logo-facebook" size={32} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("https://twitter.com")}>
          <Ionicons name="logo-twitter" size={32} color="#1DA1F2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("https://instagram.com")}>
          <Ionicons name="logo-instagram" size={32} color="#C13584" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfadf",
  },
  header: {
    height: 60,
    backgroundColor: "#3a8c0c",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  circleButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#567838",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    overflow: "hidden",
  },
  buttonText: {
    color: "#b54210",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    position: "absolute", // Esto coloca el texto sobre la imagen
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f1f1f1",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Asegura que la imagen cubra todo el botón
    height: "100%", // Asegura que la imagen cubra todo el botón
  },
});

import React from "react";
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
    <ImageBackground
      source={require("../assets/fondoapp3.png")} // Imagen de fondo
      style={styles.background}
      resizeMode="cover"
    >
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    padding: 10,
  },
  circleButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    overflow: "hidden",
  },
  buttonText: {
    color: "#000",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Fondo para mejorar contraste
    padding: 5,
    borderRadius: 5,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo semitransparente
  },
});

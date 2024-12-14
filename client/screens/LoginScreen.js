import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { BACKEND_URL } from "@env";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Aquí puedes agregar lógica para el proceso de inicio de sesión,
    // como llamar a una API o validar los datos de entrada.
    try {
      const response = await fetch("${BACKEND_URL}/personaLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docidentidad: username,
          contrasena: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data); // Cambiar el estado para indicar que el usuario está autenticado
        //Alert.alert("Éxito", "Inicio de sesión exitoso....");
        console.log("Éxito", "Inicio de sesión exitoso.");
        // Maneja la respuesta del servidor (e.g., guardar token o redirigir)
      } else {
        alert("Credenciales incorrectas!!!");
        //console.log("Error en el inicio de sesión.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fcfadf",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
});

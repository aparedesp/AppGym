import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

export default function RegistroScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [docidentidad, setDocIdentidad] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleRegistro = async () => {
    if (!nombre || !apellidos || !email || !docidentidad || !contrasena) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch(
        "https://appgym-production.up.railway.app/personas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            apellidos,
            email,
            docidentidad,
            peso: null,
            altura: null,
            fechaNacimiento: null,
            sexo: null,
            direccion: null,
            telefono: null,
            contrasena,
            estadoLogueo: null,
            fechaHoraUltimoLogueo: null,
            foto: null,
          }),
        }
      );

      if (response.ok) {
        // Enviar correo con las credenciales al usuario
        const emailResponse = await fetch(
          "https://appgym-production.up.railway.app/send-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: email,
              subject: "Registro Exitoso - Tus Credenciales",
              body: `Hola ${nombre},\n\nGracias por registrarte. Tus credenciales son:\n\nUsuario: ${docidentidad}\nContraseña: ${contrasena}\n\n¡Bienvenido!\n\nEquipo AppGym`,
            }),
          }
        );

        if (emailResponse.ok) {
          Alert.alert(
            "Registro exitoso",
            "Ha sido registrado correctamente. Se ha enviado un correo con tus credenciales.",
            [{ text: "OK", onPress: () => navigation.navigate("LoginScreen") }]
          );
        } else {
          Alert.alert(
            "Registro exitoso",
            "Se registró correctamente, pero no se pudo enviar el correo. Por favor, contacta al soporte.",
            [{ text: "OK", onPress: () => navigation.navigate("LoginScreen") }]
          );
        }
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Error al registrar.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };


  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Registro de Alumno</Text>

      <Text style={[styles.label, styles.highlightLabel]}>
        Documento de Identidad
      </Text>
      <TextInput
        style={[styles.input, styles.highlightInput]}
        value={docidentidad}
        onChangeText={setDocIdentidad}
        placeholder="Ingrese su documento de identidad"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, styles.highlightLabel]}>Contraseña</Text>
      <TextInput
        style={[styles.input, styles.highlightInput]}
        value={contrasena}
        onChangeText={setContrasena}
        placeholder="Ingrese su contraseña"
        placeholderTextColor="#888"
        secureTextEntry
      />

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese su nombre"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Apellidos</Text>
      <TextInput
        style={styles.input}
        value={apellidos}
        onChangeText={setApellidos}
        placeholder="Ingrese sus apellidos"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Ingrese su correo"
        placeholderTextColor="#888"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegistro}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1e21",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#2a2d31",
    color: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  highlightLabel: {
    color: "#FFD700", // Color dorado para resaltar el texto
    fontWeight: "bold",
  },
  highlightInput: {
    borderColor: "#FFD700", // Borde dorado
    borderWidth: 2, // Más ancho que el resto
    backgroundColor: "#333", // Fondo ligeramente distinto
  },
});

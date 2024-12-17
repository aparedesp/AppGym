import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PagosScreen() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = async () => {
    if (!cardNumber || !cardHolderName || !expiryDate || !cvv) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://tu-backend-url.com/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber, cardHolderName, expiryDate, cvv }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Éxito", "Pago realizado correctamente.");
      } else {
        Alert.alert("Error", result.message || "Hubo un problema con el pago.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar el pago.");
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Formulario de Pago</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="card-outline"
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          maxLength={16}
          value={cardNumber}
          onChangeText={setCardNumber}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre como aparece en la tarjeta"
          placeholderTextColor="#aaa"
          value={cardHolderName}
          onChangeText={setCardHolderName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="calendar-outline"
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="MM/AA"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          maxLength={5}
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="123"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          maxLength={3}
          value={cvv}
          onChangeText={setCvv}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pagar Ahora</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#1c1e21",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#2a2d31",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

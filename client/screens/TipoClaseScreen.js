import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function TipoClaseScreen() {
  const [tipoClases, setTipoClases] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Fetch tipos de clase desde el backend
  const fetchTipoClases = useCallback(async () => {
    try {
      const response = await fetch(
        "https://appgym-production.up.railway.app/tipoClase/"
      );
      const data = await response.json();
      if (response.ok) {
        setTipoClases(data);
      } else {
        Alert.alert("Error", "No se pudieron cargar los tipos de clase.");
      }
    } catch (error) {
      console.error("Error al obtener tipos de clase:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTipoClases();
    }, [fetchTipoClases])
  );

  // Crear un nuevo tipo de clase
  const handleCreate = async () => {
    if (!descripcion.trim()) {
      Alert.alert("Error", "La descripción no puede estar vacía.");
      return;
    }
    try {
      const response = await fetch(
        "https://appgym-production.up.railway.app/tipoClase/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ descripcion }),
        }
      );
      if (response.ok) {
        Alert.alert("Éxito", "Tipo de clase creado correctamente.");
        setDescripcion("");
        fetchTipoClases();
      } else {
        Alert.alert("Error", "No se pudo crear el tipo de clase.");
      }
    } catch (error) {
      console.error("Error al crear tipo de clase:", error);
    }
  };

  // Eliminar un tipo de clase
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/tipoClase/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        Alert.alert("Éxito", "Tipo de clase eliminado correctamente.");
        fetchTipoClases();
      } else {
        Alert.alert("Error", "No se pudo eliminar el tipo de clase.");
      }
    } catch (error) {
      console.error("Error al eliminar tipo de clase:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Tipos de Clase</Text>

      {/* Formulario para crear tipo de clase */}
      <TextInput
        placeholder="Descripción del tipo de clase"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Crear Tipo de Clase</Text>
      </TouchableOpacity>

      {/* Lista de tipos de clase */}
      <Text style={styles.subtitle}>Lista de Tipos de Clase</Text>
      {tipoClases.map((tipoClase) => (
        <View key={tipoClase.idTipoClase} style={styles.row}>
          <Text
            style={[
              styles.itemText,
              selectedId === tipoClase.idTipoClase && styles.selected,
            ]}
          >
            {tipoClase.descripcion}
          </Text>
          <TouchableOpacity
            onPress={() => handleDelete(tipoClase.idTipoClase)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1c1e21",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffeb3d",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "#2a2d31",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffeb3d",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    color: "#fff",
  },
  selected: {
    backgroundColor: "#007BFF",
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: "red",
    fontWeight: "bold",
  },
});

import React, { useState, useCallback, useEffect } from "react";
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

export default function TipoClaseScreen({ route }) {
  const { user } = route.params;
  const [tiposClases, setTiposClases] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedIdPersona, setSelectedIdPersona] = useState("");
  const [selectedIdTipoClase, setSelectedIdTipoClase] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [registros, setRegistros] = useState([]);

  // Obtener tipos de clase desde el backend
  const fetchTipoClases = useCallback(async () => {
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/tipoClase/`
      );
      const data = await response.json();
      if (response.ok) {
        setTiposClases(data);
      } else {
        Alert.alert("Error", "No se pudieron cargar los tipos de clase.");
      }
    } catch (error) {
      console.error("Error al obtener tipos de clase:", error);
    }
  }, []);

  // Obtener usuarios desde el backend
  const fetchUsuarios = useCallback(async () => {
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/personas/`
      );
      const data = await response.json();
      if (response.ok) {
        setUsuarios(data);
      } else {
        Alert.alert("Error", "No se pudieron cargar los usuarios.");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }, []);

  // Confirmar la selección del tipo de clase y usuario
  const handleSubmit = async () => {
    if (!selectedIdPersona || !selectedIdTipoClase) {
      Alert.alert("Error", "Debe seleccionar un usuario y un tipo de clase.");
      return;
    }
    try {
      const response = await fetch(
        "https://appgym-production.up.railway.app/personaTipoClase",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idPersona: selectedIdPersona,
            idTipoClase: selectedIdTipoClase,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Éxito", "Asignación creada correctamente.");
        fetchUsuarios(); // Actualizar usuarios después de la asignación
      }
    } catch (error) {
      console.error("Error al asignar clase:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTipoClases();
      fetchUsuarios();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Asignación de Clase</Text>

      {/* Selección de Usuario */}
      <Text style={styles.label}>Seleccionar Usuario</Text>
      {usuarios.map((usuario) => (
        <TouchableOpacity
          key={usuario.idPersona}
          onPress={() => setSelectedIdPersona(usuario.idPersona)}
          style={[
            styles.itemOption,
            selectedIdPersona === usuario.idPersona && styles.selectedOption,
          ]}
        >
          <Text style={styles.itemText}>
            {usuario.nombre + " " + usuario.apellidos}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Selección del Tipo de Clase */}
      <Text style={styles.label}>Seleccionar Tipo de Clase</Text>
      {tiposClases.map((tipoClase) => (
        <TouchableOpacity
          key={tipoClase.idTipoClase}
          onPress={() => setSelectedIdTipoClase(tipoClase.idTipoClase)}
          style={[
            styles.itemOption,
            selectedIdTipoClase === tipoClase.idTipoClase &&
              styles.selectedOption,
          ]}
        >
          <Text style={styles.itemText}>{tipoClase.descripcion}</Text>
        </TouchableOpacity>
      ))}

      {/* Botón para guardar la asignación */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Guardar</Text>
      </TouchableOpacity>

      {/* Filtros */}
      <TextInput
        placeholder="Buscar Usuario"
        value={filterUser}
        onChangeText={(text) => setFilterUser(text)}
        style={styles.input}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor: "#121212", // Fondo oscuro pero no completamente negro
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // Texto blanco para contraste
    textAlign: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#b0b0b0", // Texto gris claro para mejor contraste
    marginTop: 10,
  },
  selectedOption: {
    backgroundColor: "#4caf50", // Verde brillante para los seleccionados
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#1e1e1e", // Fondo gris oscuro
    padding: 10,
    color: "#e0e0e0", // Texto gris claro
    marginBottom: 10,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#007bff", // Azul brillante para el botón
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#ffffff", // Texto blanco para contraste
  },
  itemOption: {
    backgroundColor: "#292929", // Fondo más claro para los ítems no seleccionados
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  itemText: {
    color: "#e0e0e0", // Texto gris claro
  },
});


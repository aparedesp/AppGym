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

  const [Personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [tiposClases, setTiposClases] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [selectedIdTipoClase, setSelectedIdTipoClase] = useState("");
  const [searchText, setSearchText] = useState("");

  // Obtener Personas desde el backend
  const fetchPersonas = useCallback(async () => {
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/personas/`
      );
      const data = await response.json();
      if (response.ok) {
        setPersonas(data);
        setFilteredPersonas(data);
      } else {
        Alert.alert("Error", "No se pudieron cargar los Personas.");
      }
    } catch (error) {
      console.error("Error al obtener Personas:", error);
    }
  }, []);

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

  // Obtener clases asignadas de una persona
const fetchAsignados = async (idPersona) => {
  try {
    console.log("fetchAsignados/IdPersona:" + idPersona);
    const response = await fetch(
      `https://appgym-production.up.railway.app/personaTipoClase/${idPersona}`
    );
    const data = await response.json();
    if (response.ok) {
      setAsignados(Array.isArray(data) ? data : []);
    } else {
      Alert.alert("Error", "No se pudieron cargar las clases asignadas.");
      setAsignados([]);
    }
  } catch (error) {
    console.error("Error al obtener clases asignadas:", error);
    setAsignados([]);
  }
};


  // Filtrar Personas al escribir
const handleSearch = (text) => {
  setSearchText(text);
  if (text) {
    const filtered = Personas.filter(
      (Persona) =>
        (Persona.nombre &&
          Persona.nombre.toLowerCase().includes(text.toLowerCase())) ||
        (Persona.apellidos &&
          Persona.apellidos.toLowerCase().includes(text.toLowerCase())) ||
        (Persona.docidentidad &&
          Persona.docidentidad.toLowerCase().includes(text.toLowerCase()))
    );
    setFilteredPersonas(filtered);
  } else {
    setFilteredPersonas(Personas);
  }
};


  // Asignar un tipo de clase
  const handleAsignar = async () => {
    if (!selectedPersona || !selectedIdTipoClase) {
      Alert.alert("Error", "Seleccione un Persona y un tipo de clase.");
      return;
    }
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/personaTipoClase`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idPersona: selectedPersona.idPersona,
            idTipoClase: selectedIdTipoClase,
          }),
        }
      );
      if (response.ok) {
        Alert.alert("Éxito", "Clase asignada correctamente.");
        fetchAsignados(selectedPersona.idPersona);
      } else {
        Alert.alert("Error", "No se pudo asignar la clase.");
      }
    } catch (error) {
      console.error("Error al asignar clase:", error);
    }
  };

  // Eliminar un tipo de clase asignado
  const handleEliminar = async (idPersonaTipoClase) => {
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/personaTipoClase/${idPersonaTipoClase}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        Alert.alert("Éxito", "Clase eliminada correctamente.");
        fetchAsignados(selectedPersona.idPersona);
      } else {
        Alert.alert("Error", "No se pudo eliminar la clase.");
      }
    } catch (error) {
      console.error("Error al eliminar clase:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPersonas();
      fetchTipoClases();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Clases</Text>

      {/* Búsqueda y selección de Persona */}
      <TextInput
        placeholder="Buscar por nombre o documento"
        value={searchText}
        onChangeText={handleSearch}
        style={styles.input}
      />
      {filteredPersonas.map((Persona) => (
        <TouchableOpacity
          key={Persona.idPersona}
          onPress={() => {
            setSelectedPersona(Persona);
            fetchAsignados(Persona.idPersona);
          }}
          style={[
            styles.item,
            selectedPersona?.idPersona === Persona.idPersona && styles.selected,
          ]}
        >
          <Text style={styles.itemText}>
            {Persona.nombre} {Persona.apellidos} - {Persona.docidentidad}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Clases asignadas */}
      {selectedPersona && (
        <View>
          <Text style={styles.subtitle}>Clases asignadas:</Text>
          {Array.isArray(asignados) &&
            asignados.map((asignado) => (
              <View key={asignado.idPersonaTipoClase} style={styles.row}>
                <Text style={styles.itemText}>{asignado.descripcion}</Text>
                <TouchableOpacity
                  onPress={() => handleEliminar(asignado.idPersonaTipoClase)}
                >
                  <Text style={styles.deleteButton}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      )}

      {/* Asignar nueva clase */}
      {selectedPersona && (
        <View>
          <Text style={styles.subtitle}>Asignar nueva clase:</Text>
          <TextInput
            placeholder="Seleccione un tipo de clase"
            value={selectedIdTipoClase}
            onChangeText={setSelectedIdTipoClase}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleAsignar}>
            <Text style={styles.buttonText}>Asignar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selected: {
    backgroundColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deleteButton: {
    color: "red",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

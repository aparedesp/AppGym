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

export default function PersonaTipoClaseScreen({ route }) {
  const [Personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [tiposClasesNoAsignadas, setTiposClasesNoAsignadas] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [selectedIdTipoClase, setSelectedIdTipoClase] = useState("");
  const [searchText, setSearchText] = useState("");

  // Obtener Personas 
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

  // Obtener clases asignadas de una persona
  const fetchAsignados = async (idPersona) => {
    try {
      console.log("fetchAsignados/IdPersona:" + idPersona);
      const response = await fetch(
        `https://appgym-production.up.railway.app/TipoClaseByIdPersona/${idPersona}`
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

    // Obtener tipos de clase no asignadas a la persona
  const fetchTipoClasesNoAsignadas = useCallback(async (idPersona) => {
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/TipoClaseNoAsignadaByIdPersona/${idPersona}`
      );
      const data = await response.json();
      console.log("Tipos de clases no asignadas obtenidos:", data);
      if (response.ok) {
        setTiposClasesNoAsignadas(data);
      } else {
        Alert.alert(
          "Error",
          "No se pudieron cargar los tipos de clase no asignadas."
        );
      }
    } catch (error) {
      console.error("Error al obtener tipos de clase no asignadas:", error);
    }
  }, []);

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
        fetchTipoClasesNoAsignadas(selectedPersona.idPersona);
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
        fetchTipoClasesNoAsignadas(selectedPersona.idPersona);
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
      //fetchTipoClasesNoAsignadas(selectedPersona.idPersona);
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Tipo de Clase por persona</Text>

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
            fetchTipoClasesNoAsignadas(Persona.idPersona);
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
          {tiposClasesNoAsignadas.map((tipoClase) => (
            <TouchableOpacity
              key={tipoClase.idTipoClase}
              style={[
                styles.item,
                selectedIdTipoClase === tipoClase.idTipoClase &&
                  styles.selected,
              ]}
              onPress={() => setSelectedIdTipoClase(tipoClase.idTipoClase)}
            >
              <Text style={styles.itemText}>{tipoClase.descripcion}</Text>
            </TouchableOpacity>
          ))}
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
    backgroundColor: "#1c1e21", // Fondo igual al de PagosScreen
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffeb3d", // Título en blanco
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#fff", // Color del texto en blanco
    backgroundColor: "#2a2d31", // Fondo similar al de PagosScreen
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selected: {
    backgroundColor: "#007BFF", // Color seleccionado como en PagosScreen
  },
  itemText: {
    fontSize: 16,
    color: "#fff", // Texto en blanco
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffeb3d", // Subtítulos en blanco
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  deleteButton: {
    color: "red", // Botón de eliminar en rojo
  },

  button: {
    backgroundColor: "#007BFF", // Color de fondo del botón igual a PagosScreen
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff", // Texto del botón en blanco
    fontWeight: "bold",
  },
});

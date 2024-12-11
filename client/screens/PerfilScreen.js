import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function PerfilScreen({ route }) {
  
  const { user } = route.params;

  // Estados para los datos del perfil
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/150" // URL de imagen de perfil por defecto
  );
  const [name, setName] = useState();
  const [apellidos, setApellidos] = useState();
  const [email, setEmail] = useState();
  const [docidentidad, setDocidentidad] = useState();
  const [peso, setPeso] = useState();
  const [altura, setAltura] = useState();
  const [fechaNacimiento, setFechaNacimiento] = useState();
  const [sexo, setSexo] = useState();
  const [direccion, setDireccion] = useState();
  const [phone, setPhone] = useState();
  const [contrasena, setContrasena] = useState();

  const [isEditing, setIsEditing] = useState(false);

  const [base64Image, setBase64Image] = useState();

const handleChangePhoto = async () => {
  try {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceder a tu galería para cambiar la foto."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions
        ? ImagePicker.MediaTypeOptions.Images // Versión antigua
        : [ImagePicker.MediaType.IMAGE], // Versión moderna
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;
      const base64Image = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setProfilePic(base64Image);
      console.log("Se cargó imagen: ", base64Image.slice(0, 100), "...");
    }
  } catch (error) {
    console.error("Error al seleccionar la imagen:", error);
    Alert.alert("Error", "No se pudo seleccionar la imagen.");
  }
};



  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://192.168.1.132:8080/personas/${user.idPersona}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Datos recibidos del servidor:", data);

        setName(data.nombre || "");
        setApellidos(data.apellidos || "");
        setEmail(data.email || "");
        setDocidentidad(data.docidentidad || "");
        setPeso(data.peso);
        setAltura(data.altura);
        setFechaNacimiento(data.fechaNacimiento || "");
        setSexo(data.sexo || "");
        setDireccion(data.direccion || "");
        setPhone(data.telefono || "");
        setContrasena(data.contrasena || "");
       
         if (data.foto) {
           // Verifica si la foto es un Buffer o ya está en formato Base64
           if (data.foto.type === "Buffer") {
            console.log("Entró a lectura Buffer")
             // Convierte Buffer a Base64
             const base64Image = `data:image/jpeg;base64,${Buffer.from(
               data.foto.data
             ).toString("base64")}`;
             setProfilePic(base64Image);
           } else if (typeof data.foto === "string") {
             // Ya está en formato Base64
             console.log("Entró a lectura string");
             setProfilePic(`data:image/jpeg;base64,${data.foto}`);
           } else {
             console.warn("Formato de imagen no reconocido.");
             setProfilePic("https://via.placeholder.com/150");
           }
         } else {
           console.warn("No se recibió una foto del servidor.");
           setProfilePic("https://via.placeholder.com/150");
         }

     
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  }, [user.nombre]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Entra a Perfil de usuario");
      fetchUserData();
    }, [fetchUserData])
  );

  const handleEdit = () => {
    setIsEditing(true); // Activar edición
    fetchUserData(); // Actualizar datos
  };

const handleSave = async () => {
  try {
    // Enviar solo el contenido base64 al backend
    const photoPayload = base64Image;

    const response = await fetch(
      `http://192.168.1.132:8080/personas/${user.idPersona}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          apellidos: apellidos,
          email: email,
          docidentidad: docidentidad,
          peso: peso,
          altura: altura,
          fechaNacimiento: fechaNacimiento,
          sexo: sexo,
          direccion: direccion,
          telefono: phone,
          contrasena: contrasena,
          foto: photoPayload,
        }),
      }
    );
    // console.log(
    //   "profilePic.split(",
    //   ")[1]: " + profilePic.split(",")[1].split(",")[1]
    // );
    if (response.ok) {
      const result = await response.json();
      Alert.alert(
        "Perfil actualizado",
        "Los datos han sido guardados con éxito."
      );
      console.log("Respuesta del servidor:", result);
    } else {
      const error = await response.json();
      Alert.alert("Error", error.message || "Error al guardar los datos.");
    }
  } catch (error) {
    console.error("Error:", error);
    Alert.alert("Error", "No se pudo conectar al servidor.");
  } finally {
    setIsEditing(false); // Desactiva el modo de edición
  }
};

  return (
    <ScrollView
      style={styles.scrollContainer} // Nuevo estilo para el ScrollView
      contentContainerStyle={styles.scrollContent} // Contenido centrado
      keyboardShouldPersistTaps="handled" // Permitir interacción mientras el teclado está abierto
    >
      {/* Foto de perfil */}
      <View style={styles.profilePicContainer}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
        {isEditing && (
          <TouchableOpacity
            style={styles.changePicButton}
            onPress={handleChangePhoto}
          >
            <Text style={styles.changePicText}>Cambiar foto</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Información del usuario */}
      <Text style={styles.label}>Documento de Identidad (Usuario login)</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={docidentidad}
        onChangeText={setDocidentidad}
        editable={false}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={name}
          onChangeText={setName}
          editable={isEditing}
        />

        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={apellidos}
          onChangeText={setApellidos}
          editable={isEditing}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Peso</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={peso?.toString()} // Convertir número a string
          onChangeText={(value) => setPeso(Number(value) || "")} // Convertir string a número
          editable={isEditing}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Altura</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={altura?.toString()} // Convertir número a string
          onChangeText={(value) => setAltura(Number(value) || "")} // Convertir string a número
          editable={isEditing}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
          editable={isEditing}
        />
        <Text style={styles.label}>Sexo</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={sexo}
          onChangeText={setSexo}
          editable={isEditing}
        />
        <Text style={styles.label}>Direccion</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={direccion}
          onChangeText={setDireccion}
          editable={isEditing}
        />
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={phone}
          onChangeText={setPhone}
          editable={isEditing}
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={contrasena}
          onChangeText={setContrasena}
          editable={isEditing}
          keyboardType="visible-password"
        />
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonsContainer}>
        {isEditing ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#3a8c0c",
  },
  changePicButton: {
    marginTop: 10,
    backgroundColor: "#3a8c0c",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  changePicText: {
    color: "#fff",
    fontSize: 14,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

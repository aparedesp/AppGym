import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import ReservaScreen from "./screens/ReservaScreen2";
import AtletasScreen from "./screens/AtletasScreen";
import EquipateScreen from "./screens/EquipateScreen";
import ChatScreen from "./screens/ChatScreen";
import PagosScreen from "./screens/PagosScreen";
import PerfilScreen from "./screens/PerfilScreen";
import RegistroScreen from "./screens/RegistroScreen";
import TipoClaseScreen from "./screens/TipoClaseScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(""); // Nuevo estado para el obj usuario logueado

  const handleLogin = (usr_prop) => {
    setUser(usr_prop); // Almacena el objeto del usuario
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: () => {
          // Cambia el estado de autenticación en App.js
          setIsAuthenticated(false);
          setUser(null); // Limpia el nombre del usuario
        },
      },
    ]);
  };

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen name="LoginScreen">
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen name="RegistroScreen" component={RegistroScreen} />
        </Stack.Navigator>
      ) : (
        <Drawer.Navigator initialRouteName="Inicio">
          <Drawer.Screen
            name="Inicio"
            component={MainScreen} // Pasa el componente directamente
            initialParams={{ user }} // Envía los parámetros necesarios
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="home" color={color} size={size} />
              ),
              headerTitle: `Bienvenid@, ${user.nombre}`,
            }}
          />

          <Drawer.Screen
            name="Perfil"
            component={PerfilScreen}
            initialParams={{ user }} // Envía los parámetros necesarios
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="person" color={color} size={size} />
              ),
              headerTitle: `Perfil | ${user.nombre}`,
            }}
          />
          <Drawer.Screen
            name="Reserva"
            component={ReservaScreen}
            initialParams={{ user }} // Envía los parámetros necesarios
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="edit-calendar" color={color} size={size} />
              ),
              headerTitle: `Reservas | ${user.idPersona} ${user.nombre} ${user.apellidos}`,
            }}
          />
          <Drawer.Screen
            name="Pagos"
            component={PagosScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="payment" color={color} size={size} />
              ),
              headerTitle: `Pagos | ${user.nombre}`,
            }}
          />
          <Drawer.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="chat" color={color} size={size} />
              ),
              headerTitle: `Chat | ${user.nombre}`,
            }}
          />
          <Drawer.Screen
            name="Equipate"
            component={EquipateScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="store" color={color} size={size} />
              ),
              headerTitle: `Equípate | ${user.nombre}`,
            }}
          />
          <Drawer.Screen
            name="Atletas"
            component={AtletasScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="emoji-events" color={color} size={size} />
              ),
              headerTitle: `Atletas | ${user.nombre}`,
            }}
          />
          <Drawer.Screen
            name="TipoClase"
            component={TipoClaseScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="emoji-events" color={color} size={size} />
              ),
              headerTitle: `Tipo Clase | ${user.nombre}`,
            }}
          />
          <Drawer.Screen
            name="Cerrar Sesión"
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="logout" color={color} size={size} />
              ),
              drawerLabelStyle: { color: "red" }, // Opcional: estilo para diferenciar visualmente
              drawerItemStyle: { borderTopWidth: 1, borderColor: "#ccc" }, // Opcional: línea separadora
            }}
          >
            {() => {
              handleLogout();
              return null;
            }}
          </Drawer.Screen>
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}

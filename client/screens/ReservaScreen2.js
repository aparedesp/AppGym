import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";

export default function ReservaScreen2({ route }) {
  const { user } = route.params; // Obtiene los parámetros enviados
  console.log("usuario recibido : " + `${user.nombre}`);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [reservas, setReservas] = useState(null);


  // Array de días de la semana
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Función para formatear la fecha y hora para el filtro de las reservas
  // segundo parametro opcional: si es enviado considera ese pamametro, si es enviado considera fechaActual
  const formatearFechaHoraFiltro = (hora, fecha = fechaActual) => {
    const fechaHoraSeleccionada = new Date(fecha);
    const fechaHoraFormateada =
      fechaHoraSeleccionada.toISOString().slice(0, 10) + " " + hora + ":00"; // Formato: "YYYY-MM-DD HH:mm"
    return fechaHoraFormateada;
  };

  const fetchUserData = useCallback(
    async (fechaHora_) => {
      try {
        const response = await fetch(
          `https://appgym-production.up.railway.app/personaCalendario`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idPersona: `${user.idPersona}`,
              fechaHora: fechaHora_,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("trae datos " + fechaHora_ + data);
          setReservas(data);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "No se pudo conectar al servidor");
      }
    },
    [fechaActual]
  );

  //Ejecuta este código cada vez que una pantalla gana o pierde el enfoque dentro de tu aplicación.
  useFocusEffect(
    React.useCallback(() => {
      console.log(
        `Fecha y hora seleccionadas useFocusEffect:` +
          formatearFechaHoraFiltro(horaSeleccionada)
      );
      fetchUserData(formatearFechaHoraFiltro(horaSeleccionada));
      console.log("Entra al useFocusEffect.");
    }, [fechaActual])
  );

  // Este efecto se ejecuta una sola vez cuando se monta el componente
  useEffect(() => {
    console.log(
      `Fecha y hora seleccionadas useEffect:` +
        formatearFechaHoraFiltro(horasDisponibles[0])
    );
    fetchUserData(formatearFechaHoraFiltro(horasDisponibles[0]));
    console.log("Entra al useEffect.");
  }, [fechaActual]);

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();

    const hoy = new Date();
    const esHoy =
      hoy.getDate() === fecha.getDate() &&
      hoy.getMonth() === fecha.getMonth() &&
      hoy.getFullYear() === fecha.getFullYear();

    const prefijo = esHoy ? "Hoy, " : "";
    return `${prefijo}${diaSemana} ${dia}/${mes}`;
  };

  // Función para formatear la hora
  const formatearHora = (hora) => {
    return `${hora.toString().padStart(2, "0")}:00`;
  };

  // Función para retroceder un día
  const irDiaAnterior = () => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() - 1);
    setFechaActual(nuevaFecha);
    console.log(
      `Fecha y hora seleccionadas irDiaAnterior: ` +
        formatearFechaHoraFiltro(horaSeleccionada, nuevaFecha)
    );
    fetchUserData(formatearFechaHoraFiltro(horaSeleccionada, nuevaFecha));
  };

  // Función para ir al día de hoy
  const irHoy = () => {
    setFechaActual(new Date());
    console.log(
      `Fecha y hora seleccionadas irHoy: ` +
        formatearFechaHoraFiltro(horaSeleccionada)
    );
    fetchUserData(formatearFechaHoraFiltro(horaSeleccionada));
  };

  // Función para avanzar un día
  const irDiaPosterior = () => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + 1);
    setFechaActual(nuevaFecha);

    console.log(
      `Fecha y hora seleccionadas irDiaPosterior: ` +
        formatearFechaHoraFiltro(horaSeleccionada, nuevaFecha) +
        "fecha Actual : " +
        fechaActual +
        "nueva fecha : " +
        nuevaFecha
    );
    fetchUserData(formatearFechaHoraFiltro(horaSeleccionada, nuevaFecha));
  };

  // Función para seleccionar una hora
  const seleccionarHora = (hora) => {
    setHoraSeleccionada(hora);
    console.log(
      `Fecha y hora seleccionadas seleccionarHora: ` +
        formatearFechaHoraFiltro(hora)
    );
    fetchUserData(formatearFechaHoraFiltro(hora));
  };

  const horasDisponibles = [10, 17, 18, 19, 20, 21]; // Lista de horas en formato de 24 horas

  const agruparReservas = () => {
    if (!reservas || !Array.isArray(reservas)) {
      console.warn("Reservas no es un array válido:", reservas);
      return {};
    }
    const grupos = reservas.reduce((acc, reserva) => {
      const tipoClase = reserva["Tipo Clase Reserva"];
      if (!acc[tipoClase]) acc[tipoClase] = [];
      acc[tipoClase].push(reserva);
      return acc;
    }, {});
    return grupos;
  };

  const handleReservar = async (idPersona_, idReserva_) => {
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/reservar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idPersona: idPersona_,
            idReserva: idReserva_,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        //Alert.alert("Reserva realizada", "La reserva fue realizada con éxito.");
        console.log("Respuesta del servidor:", result);
        // Actualiza las reservas tras una operación exitosa
        await fetchUserData(formatearFechaHoraFiltro(horaSeleccionada));
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Error al realizar reserva.");
      }
    } catch (error) {
      console.error("Error: No se pudo conectar al servidor.:", error);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    } finally {
      setIsEditing(false); // Desactiva el modo de edición
    }
  };

  const handleBorrarReserva = async (idReserva_) => {
    try {
      const response = await fetch(
        `https://appgym-production.up.railway.app/borrarReserva`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idReserva: idReserva_,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Alert.alert(
        //   "Borrado de reserva realizada",
        //   "La reserva fue borrada con éxito."
        // );
        console.log("Respuesta del servidor:", result);
        // Actualiza las reservas tras una operación exitosa
        await fetchUserData(formatearFechaHoraFiltro(horaSeleccionada));
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Error al borrar reserva.");
      }
    } catch (error) {
      console.error("Error: No se pudo conectar al servidor.:", error);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    } finally {
      setIsEditing(false); // Desactiva el modo de edición
    }
  };

  const renderGrupoReservas = () => {
    const grupos = agruparReservas();
    return Object.entries(grupos).map(([tipoClase, grupo], index) => {
      const profesor = grupo.find((r) => r.Rol == "Profesor");
      const alumnos = grupo.filter((r) => r.Rol != "Profesor");

      // Ordenar alumnos
      const usuarioLogueado = alumnos.filter(
        (alumno) => alumno.idPersona == user.idPersona
      );
      const otrosAlumnos = alumnos.filter(
        (alumno) => alumno.idPersona && alumno.idPersona != user.idPersona
      );
      const disponibles = alumnos.filter((alumno) => !alumno.idPersona);

      // Combina los arreglos ordenados
      const alumnosOrdenados = [
        ...usuarioLogueado,
        ...otrosAlumnos,
        ...disponibles,
      ];

      // Verifica si hay "Disponibles" en el grupo

      const estadoDisponibilidad = (() => {
        const hayNull = alumnos.some((alumno) => !alumno.idPersona); // Verifica si hay algún idPersona === null
        const usuarioPresente = alumnos.some(
          (alumno) => alumno.idPersona == `${user.idPersona}`
        ); // Verifica si existe algún idPersona igual al del usuario logueado

        if (hayNull && !usuarioPresente) {
          return 1; // Hay al menos un idPersona == null y ningún idPersona es igual al del usuario logueado
        }

        if (usuarioPresente) {
          return 2; // Existe al menos un idPersona igual al del usuario logueado
        }

        return 3; // No hay idPersona == null y ningún idPersona es igual al del usuario logueado
      })();

      const obtenerEstiloBoton = (estado) => {
        switch (estado) {
          case 1:
            return styles.botonReservar;
          case 2:
            return styles.botonBorrar;
          case 3:
            return styles.botonClaseLlena;
          default:
            return styles.botonDefault; // Opcional, para un estado desconocido
        }
      };

      return (
        <View key={index} style={styles.grupoContainer}>
          {/* Encabezado del grupo */}
          <View style={styles.encabezadoGrupo}>
            <Text style={styles.textoProfesor}>
              {profesor
                ? `${profesor.nombre} ${profesor.apellidos}`
                : "Profesor no asignado"}{" "}
              - {tipoClase}
            </Text>
          </View>

          {/* Lista de alumnos ordenados */}
          <View style={styles.listaAlumnos}>
            {alumnosOrdenados.map((alumno, i) => {
              let estiloAlumno;
              if (alumno.idPersona === user.idPersona) {
                estiloAlumno = styles.alumnoUsuario; // Estilo para el usuario logueado
              } else if (!alumno.idPersona) {
                estiloAlumno = styles.alumnoDisponible; // Estilo para los alumnos disponibles
              } else {
                estiloAlumno = styles.alumnoNormal; // Estilo para los demás alumnos
              }

              return (
                <View key={i} style={[styles.cuadroAlumno, estiloAlumno]}>
                  <Text style={styles.textoAlumno}>
                    {alumno.nombre
                      ? `${alumno.idReserva} | ${alumno.idPersona} ${alumno.nombre} ${alumno.apellidos}`
                      : `${alumno.idReserva}` + " | Disponible: "}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Botón dinámico al final del grupo */}

          <TouchableOpacity
            style={[
              styles.botonAccion,
              obtenerEstiloBoton(estadoDisponibilidad),
            ]}
            disabled={estadoDisponibilidad == 3} // Deshabilita el botón cuando el estado es 3
            onPress={() => {
              switch (estadoDisponibilidad) {
                case 1:
                  // Aquí puedes implementar la lógica de "Reservar"
                  console.log(
                    `Reservando en el grupo: ${tipoClase}` +
                      ` idPersona: ${user.idPersona}` +
                      ` Reservas disponibles:` +
                      disponibles[0].idReserva
                  );
                  handleReservar(
                    `${user.idPersona}`,
                    disponibles[0].idReserva //Envia la primera reserva disponible
                  );

                  break;
                case 2:
                  console.log(
                    `Borrando reserva en el grupo ${tipoClase}` +
                      ` idPersona: ${user.idPersona}` +
                      ` Reservas de userLogin:` +
                      usuarioLogueado[0].idReserva
                  );
                  // Aquí puedes implementar la lógica de "Borrar reserva"
                  handleBorrarReserva(
                    usuarioLogueado[0].idReserva //Envia la primera reserva disponible
                  );

                  break;
                default:
                  console.log(`Funcionalidad futura`);
                  break;
              }
            }}
          >
            <Text style={styles.textoBoton}>
              {
                estadoDisponibilidad == 1
                  ? "Reservar"
                  : estadoDisponibilidad == 2
                  ? "Borrar reserva"
                  : estadoDisponibilidad == 3
                  ? "Clase llena"
                  : "Estado desconocido" // opcional, en caso de un valor desconocido
              }
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{formatearFecha(fechaActual)}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={irDiaAnterior}>
          <Text style={styles.buttonText}>
            {formatearFecha(new Date(fechaActual.getTime() - 86400000))}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={irHoy}>
          <Text style={styles.buttonText}>Hoy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={irDiaPosterior}>
          <Text style={styles.buttonText}>
            {formatearFecha(new Date(fechaActual.getTime() + 86400000))}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botones para seleccionar la hora */}
      <Text style={styles.horaHeader}>Selecciona una hora:</Text>
      <View style={styles.horaButtonContainer}>
        {horasDisponibles.map((hora) => (
          <TouchableOpacity
            key={hora}
            style={[
              styles.horaButton,
              hora == horaSeleccionada && styles.selectedHoraButton, // Resalta la hora seleccionada
            ]}
            onPress={() => seleccionarHora(hora)}
          >
            <Text style={styles.horaButtonText}>{formatearHora(hora)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Renderizar grupos de reservas */}
      {/* Scroll para los grupos de reservas */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" // Maneja taps mientras el teclado está activo
        //showsVerticalScrollIndicator={false} // Opcional, oculta el indicador de scroll
      >
        {renderGrupoReservas()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    padding: 16,
    backgroundColor: "#121212", // Fondo oscuro principal
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  horaHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  horaButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  horaButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 7,
    paddingHorizontal: 7,
    margin: 2,
    borderRadius: 5,
  },
  horaButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  selectedHoraButton: {
    backgroundColor: "#1E88E5", // Color diferente para la hora seleccionada
  },
  grupoContainer: {
    marginBottom: 20,
    backgroundColor: "#1E1E1E", // Fondo oscuro para cada grupo
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  encabezadoGrupo: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 5,
  },
  textoProfesor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E90FF",
  },

  alumnoUsuario: {
    backgroundColor: "#FFEB3D", // Color para el usuario logueado
    borderColor: "#FFC107",
    borderWidth: 2,
  },
  alumnoDisponible: {
    color: "#FFFFFF",
    backgroundColor: "#555", // Color para los alumnos disponibles
  },
  alumnoNormal: {
    backgroundColor: "#777", // Color para los demás alumnos
  },

  cuadroAlumno: {
    backgroundColor: "#2E2E2E",
    borderRadius: 5,
    margin: 5,
    aspectRatio: 1, // Hace que el cuadro sea un cuadrado perfecto
    justifyContent: "center",
    alignItems: "center", // Centra el contenido en el cuadro
    width: "22%", // Ajusta el ancho para que se vea bien con varios cuadros en una fila
  },
  textoAlumno: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center", // Centra el texto dentro del cuadro
  },
  listaAlumnos: {
    flexDirection: "row",
    flexWrap: "wrap", // Permite que los cuadros ocupen varias filas
    justifyContent: "flex-start", // Alinea los cuadros desde la izquierda
    padding: 10, // Añade un margen interno
  },
  botonAccion: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  botonReservar: {
    backgroundColor: "#28a745", // Verde para "Reservar"
  },
  botonBorrar: {
    backgroundColor: "#dc3545", // Rojo para "Borrar reserva"
  },
  botonClaseLlena: {
    backgroundColor: "#807c9c", // Violeta  para "Clase llena"
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingBottom: 100, // Añade espacio adicional en la parte inferior
  },
  buttonPress: {
    backgroundColor: "#3700B3",
  },
});

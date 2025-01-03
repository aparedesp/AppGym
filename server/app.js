import express from "express";
import {
  testConnection,
  getPersonaLogin,
  getPersonaByID,
  getPersonas,
  insertPersona,
  updatePersona,
  deletePersona,
  getTipoClase,
  insertTipoClase,
  deleteTipoClase,
  getTipoClaseByIdPersona,
  getTipoClaseNoAsignadaByIdPersona,
  insertPersonaTipoClase,
  deletePersonaTipoClase,
  getCalendarioPersona,
  reservar,
  borrarReserva,
} from "./database.js"; //Importamos métodos de database.js
import cors from "cors"; //MidleWare, para que el backend pueda ser llamado desde el frontEnd.
import nodemailer from "nodemailer";

// Lista blanca de IPs o dominios permitidos
const whitelist = [
  "http://192.168.1.132:8081",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
];

//Access-Control-Allow-Origin --> determina el dominio que tiene acceso a la API(backend)
//origin: "http://localhost:8081" , "http://127.0.0.1:8081" --> para web
//origin: "http://192.168.1.132:8081" --> mi ip local --> para emulador y expo Go(desde movil fisico)
//origin: "*" --> para cualquier dispositivo externo
const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  Headers: ["Content-Type", "Authorization"],
  credentials: true, //si es true no puedes usar origin: "*"
};

const app = express();
app.use(express.json({ limit: "10mb" })); //El backend solo hará caso a los request que body de respuesta es json, y como limite un cuerpo de 10 mb
app.use(express.urlencoded({ limit: "10mb", extended: true }));//Aumentar el límite de tamaño de solicitud
app.use(cors(corsOption)); //Que puede y que no puede consumir el FrontEnd

app.get("/testconnection", async (req, res) => {
 const testcnx = await testConnection();
  res.status(200).send(testcnx);
});

app.post("/personaLogin", async (req, res) => {
  const { docidentidad, contrasena } = req.body;
  const persona = await getPersonaLogin(docidentidad, contrasena);
  if (persona != null) {
    res.status(200).send(persona);
  } else {
    res.status(404).send({ error: "Credenciales no válidas" });
  }
});

app.get("/personas/:id", async (req, res) => {
  const personas = await getPersonaByID(req.params.id);
  res.status(200).send(personas);
});

app.get("/personas", async (req, res) => {
  const personas = await getPersonas();
  res.status(200).send(personas);
});

app.post("/personaCalendario", async (req, res) => {
  //console.log("Cuerpo recibido:", req.body);
  const { idPersona, fechaHora } = req.body;
  const result = await getCalendarioPersona(idPersona, fechaHora);
   if (result != null) {
    res.status(200).send(result);
  } else {
    res.status(404).send({ error: "Calendario no trae datos" });
  }
});

app.post("/personas", async (req, res) => {
  const {
    nombre,
    apellidos,
    email,
    docidentidad,
    peso,
    altura,
    fechaNacimiento,
    sexo,
    direccion,
    telefono,
    contrasena,
    estadoLogueo,
    fechaHoraUltimoLogueo,
    foto,
  } = req.body;
  const persona = await insertPersona(
    nombre,
    apellidos,
    email,
    docidentidad,
    peso,
    altura,
    fechaNacimiento,
    sexo,
    direccion,
    telefono,
    contrasena,
    estadoLogueo,
    fechaHoraUltimoLogueo,
    foto
  );
  res.status(201).send(persona);
});

app.put("/personas/:id", async (req, res) => {
  const {
    nombre,
    apellidos,
    email,
    docidentidad,
    peso,
    altura,
    fechaNacimiento,
    sexo,
    direccion,
    telefono,
    contrasena,
    foto,
  } = req.body;



  const persona = await updatePersona(
    req.params.id,
    nombre,
    apellidos,
    email,
    docidentidad,
    peso,
    altura,
    fechaNacimiento,
    sexo,
    direccion,
    telefono,
    contrasena,
    foto
  );
  res.status(200).send(persona);
});

app.delete("/personas/:id", async (req, res) => {
  await deletePersona(req.params.id);
  res.send({ message: "Persona eliminada correctamente" });
});

app.get("/tipoClase", async (req, res) => {
  const tipoclases = await getTipoClase();
  res.status(200).send(tipoclases);
});

app.post("/tipoClase", async (req, res) => {
  const { descripcion } = req.body;
  const idTipoClase = await insertTipoClase(descripcion);
  res
    .status(201)
    .send({ message: "tipoClase registrada correctamente" });
});

app.delete("/tipoClase/:id", async (req, res) => {
  await deleteTipoClase(req.params.id);
  res.send({ message: "Tipo Clase eliminada correctamente" });
});


app.get("/TipoClaseByIdPersona/:id", async (req, res) => {
  const tipoClases = await getTipoClaseByIdPersona(req.params.id);
  res.status(200).send(tipoClases);
});

app.get("/TipoClaseNoAsignadaByIdPersona/:id", async (req, res) => {
  const tipoClases = await getTipoClaseNoAsignadaByIdPersona(req.params.id);
  res.status(200).send(tipoClases);
});

app.post("/personaTipoClase", async (req, res) => {
  const { idPersona, idTipoClase } = req.body;
  const idPersonaTipoClase = await insertPersonaTipoClase(idPersona, idTipoClase);
  res.status(201).send({ message: "PersonaTipoClase registrada correctamente" });
});

app.delete("/personaTipoClase/:id", async (req, res) => {
  await deletePersonaTipoClase(req.params.id);
  res.send({ message: "PersonaTipoClase eliminada correctamente" });
});


app.put("/reservar", async (req, res) => {
  const { idPersona, idReserva } = req.body;
  const reserva = await reservar(idPersona, idReserva);
  res.status(200).send(reserva);
});

app.put("/borrarReserva", async (req, res) => {
  const { idReserva } = req.body;
  const reserva = await borrarReserva(idReserva);
  res.status(200).send(reserva);
});

//vamos a empezar a escuchar en el puerto 8080
app.listen(8080, () => {
  console.log("server running on port 8080");
});
//server.timeout = 5000; // 5 segundos

app.post("/send-email", async (req, res) => {
  const { to, subject, body } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "appsoportesistemas@gmail.com",
        pass: "hvmhczxihsxyhonb", // Usa variables de entorno para mayor seguridad
      },
    });

    const mailOptions = {
      from: "appsoportesistemas@gmail.com",
      to,
      subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Correo enviado correctamente." });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send({ message: "Error al enviar el correo." });
  }
});


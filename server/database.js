import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql

  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getPersonaLogin(docidentidad, contrasena) {
  try {
    const [row] = await pool.query(
      `SELECT p.*,r.descripcion rol FROM persona p 
        join rol r on r.idRol = p.idRol
        WHERE p.docidentidad = ? and p.contrasena = ?`,
      [docidentidad, contrasena]
    );
    return row[0];
  } catch (error) {
    console.error("Error fetching persona login:", error);
    throw error;
  }
}

export async function getPersonaByID(id) {
  try {
    const [row] = await pool.query(
      `SELECT * FROM persona WHERE IdPersona = ?`,
      [id]
    );
    return row[0];
  } catch (error) {
    console.error("Error fetching get Persona By ID:", error);
    throw error;
  }
}

export async function getPersonas() {
  try {
    const [result] = await pool.query(`SELECT * FROM persona`);
    return result;
  } catch (error) {
    console.error("Error fetching personas:", error);
    throw error;
  }
}

export async function insertPersona(
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
) {
  try {
    const [result] = await pool.query(
      `INSERT INTO persona (nombre,apellidos,email,docidentidad,peso,
      altura,fechaNacimiento,sexo,direccion,telefono,contrasena,estadoLogueo,fechaHoraUltimoLogueo,foto) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );
    const IdPersona = result.insertId;
    return getPersonaByID(IdPersona);
  } catch (error) {
    console.error("Error insert persona:", error);
    throw error;
  }
}

export async function updatePersona(
  idPersona,
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
) {
  try {
    // Convertir base64 a binario
    const fotoBinaria = foto ? Buffer.from(foto, "base64") : null;

    const [result] = await pool.query(
      `UPDATE persona SET nombre = ?, apellidos = ?, email = ?, docidentidad = ?, peso = ?, altura = ?,
    fechaNacimiento = ?, sexo = ?, direccion = ?, telefono = ?, contrasena = ?, foto = ? WHERE IdPersona = ?`,
      [
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
        fotoBinaria, // Foto en formato binario
        idPersona,
      ]
    );
    return result;
  } catch (error) {
    console.error("Error update persona:", error);
    throw error;

  }
}

export async function deletePersona(id) {
  try {
    const [result] = await pool.query(
      `DELETE FROM persona WHERE IdPersona = ?`,
      [id]
    );
    return result;
  } catch (error) {
    console.error("Error delete persona:", error);
    throw error;
  }
}

export async function getCalendarioPersona(idPersona, fechaHora) {
  try {
    const [result] = await pool.query(
      `select 
p.idPersona,
r.idReserva,
r.fechaHora,
tipoClaseReserva.descripcion 'Tipo Clase Reserva',
p.nombre,
p.apellidos,
rp.descripcion 'Rol',
tipoClasePersona.descripcion 'Tipo Clase Persona'
from reserva r
join tipoClase tipoClaseReserva on tipoClaseReserva.idTipoClase = r.idTipoClase
left join persona p on p.idPersona = r.idPersona
left join rol rp on rp.idRol = p.idRol
left join personaTipoClase ptc on ptc.idPersona = p.idPersona and ptc.idTipoClase =  tipoClaseReserva.idTipoClase
left join tipoClase tipoClasePersona on tipoClasePersona.idTipoClase = ptc.idTipoClase
where tipoClaseReserva.idTipoClase in 
(select tpc.idTipoClase from personaTipoClase tpc where tpc.idPersona = ?) 
and r.fechaHora = ?;`,
      [idPersona, fechaHora]
    );
    //console.log("Resultado de la consulta:", result);
    //console.log("Resultado de la consulta:", result);
    return result;
  } catch (error) {
    console.error("Error fetching calendar persona:", error);
    throw error;
  }
}

export async function reservar(idPersona, idReserva) {
  try {
    const [result] = await pool.query(
      `UPDATE reserva SET idPersona = ? where idReserva = ?`,
      [idPersona, idReserva]
    );
    return result;
  } catch (error) {
    console.error("Error reservar :", error);
    throw error;
  }
}

export async function borrarReserva(idReserva) {
  try {
    const [result] = await pool.query(
      `UPDATE reserva SET idPersona = null where idReserva = ?`,
      [idReserva]
    );
    return result;
  } catch (error) {
    console.error("Error borrar reserva:", error);
    throw error;
  }
}

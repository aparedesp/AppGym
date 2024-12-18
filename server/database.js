import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql

  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306, // Puerto
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 10000, // Tiempo en milisegundos (10 segundos)
    queueLimit: 0,
  })
  .promise();

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to database");
    connection.release();
    return "Ok";
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

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
    const [result] = await pool.query(`SELECT * FROM persona order by nombre, apellidos`);
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
    const fechaNacimientoMySQL = new Date(fechaNacimiento)
      .toISOString()
      .slice(0, 10); // Obtiene solo 'YYYY-MM-DD'
    const [result] = await pool.query(
      `INSERT INTO persona (idRol,nombre,apellidos,email,docidentidad,peso,
      altura,fechaNacimiento,sexo,direccion,telefono,contrasena,estadoLogueo,fechaHoraUltimoLogueo,foto) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        1, //IdRol:1 -->Alumno
        nombre,
        apellidos,
        email,
        docidentidad,
        peso,
        altura,
        fechaNacimientoMySQL,
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
    const fechaNacimientoMySQL = new Date(fechaNacimiento)
      .toISOString()
      .slice(0, 10); // Obtiene solo 'YYYY-MM-DD'

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
        fechaNacimientoMySQL,
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

export async function getTipoClase() {
  try {
    const [result] = await pool.query(`SELECT * FROM tipoClase `);
    return result;
  } catch (error) {
    console.error("Error fetching get tipoClase :", error);
    throw error;
  }
}

export async function getTipoClaseByIdPersona(id) {
  try {
    const [result] = await pool.query(
      `select ptc.idPersonaTipoClase, 
        tc.descripcion ,
        ptc.idTipoClase,
        ptc.idPersona
        from personaTipoClase ptc
        join persona p on p.idPersona=ptc.idPersona
        join tipoClase tc on tc.idTipoClase=ptc.idTipoClase
        where p.idPersona = ?`,
      [id]
    );
    return result;
  } catch (error) {
    console.error("Error fetching get TipoClase By Id Persona:", error);
    throw error;
  }
}

export async function insertPersonaTipoClase(idPersona, idTipoClase) {
  try {
    const [result] = await pool.query(
      `INSERT INTO personaTipoClase (idPersona,idTipoClase) 
    VALUES (?, ?)`,
      [idPersona, idTipoClase]
    );
    const idPersonaTipoClase = result.insertId;
    return getPersonaByID(idPersonaTipoClase);
  } catch (error) {
    console.error("Error insert personaTipoClase:", error);
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




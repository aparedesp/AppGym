create database proyecto_dam;

use proyecto_dam;

CREATE TABLE `rol` (
`idRol` int(11) NOT NULL AUTO_INCREMENT,
`descripcion` varchar(100) DEFAULT NULL,
PRIMARY KEY (`idRol`)
) ;
INSERT INTO `rol`( `descripcion`) VALUES ('Alumno');
INSERT INTO `rol`( `descripcion`) VALUES ('Profesor');


CREATE TABLE `persona` (
`idPersona` int(11) NOT NULL AUTO_INCREMENT,
`idRol` int(11) DEFAULT NULL,
`nombre` varchar(200) NOT NULL,
`apellidos` varchar(200) NOT NULL,
`email` varchar(150) NOT NULL,
`docidentidad` varchar(10) NOT NULL,
`peso` double DEFAULT NULL,
`altura` double DEFAULT NULL,
`fechaNacimiento` date DEFAULT NULL,
`sexo` varchar(150) DEFAULT NULL,
`direccion` varchar(200) DEFAULT NULL,
`telefono` varchar(30) DEFAULT NULL,
`contrasena` varchar(10) NOT NULL,
`estadoLogueo` int(11) DEFAULT NULL,
`fechaHoraUltimoLogueo` datetime DEFAULT NULL,
`foto` LONGBLOB DEFAULT NULL,
UNIQUE KEY `email` (`email`),
UNIQUE KEY `docidentidad` (`docidentidad`),
PRIMARY KEY (`IdPersona`),
FOREIGN KEY (`idRol`) REFERENCES `rol`(`idRol`)
) ;

/*idRol 1: Alumno -- 
   idRol2: Profesor
*/


INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (2,'Carlos','El Sueco','elsueco@gmail.com','111P',75,175,
'1995-10-01','hombre','calle ttt Madrid','658745125','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (2,'Abraham','Perales Peña','aperales@gmail.com','222P',75,175,
'1993-03-15','hombre','calle ttt Madrid','658745125','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Juan','Perez Morales','jparez@gmail.com','111A',80,180,
'1980-10-21','hombre','calle Aa Madrid','612476582','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Martha','Rodriguez Muñoz','mrodriguez@gmail.com','222A',77,165,
'2001-05-14','mujer','calle bbb Madrid','611458749','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Antonio','Lopez Lozano','alopez@gmail.com','333A',90,175,
'1999-09-12','hombre','calle nnnn Madrid','915478452','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Enrique','Pastor Recio','epastor@gmail.com','444A',90,175,
'1996-11-07','hombre','calle yyy Madrid','123456789','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Rddrigo','Paredes','rparedes@gmail.com','555A',80,180,
'1987-10-08','hombre','calle Aa Madrid','612478887','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Alicia','Mera','amera@gmail.com','666A',77,165,
'2001-06-03','mujer','calle bbb Madrid','611458749','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Jorge','Benites','jbenites@gmail.com','777A',90,175,
'1997-02-01','hombre','calle nnnn Madrid','915474562','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Julio','Ventura','jventura@gmail.com','888A',90,175,
'1998-08-12','hombre','calle yyy Madrid','123462541','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Santiago','Veliz','sveliz@gmail.com','999A',90,175,
'1999-11-10','hombre','calle yyy Madrid','1958745214','123');

INSERT INTO persona (idRol,nombre,apellidos ,email ,docidentidad ,peso ,altura ,
fechaNacimiento ,sexo ,direccion ,telefono, contrasena ) 
VALUES (1,'Alexis','Linares','alinares@gmail.com','000A',90,175,
'1995-06-03','hombre','calle yyy Madrid','764654666','123');


CREATE TABLE `tipoClase` (
`idTipoClase` int(11) NOT NULL AUTO_INCREMENT,
`descripcion` varchar(100) DEFAULT NULL,
PRIMARY KEY (`idTipoClase`)
) ;
INSERT INTO `tipoClase`( descripcion) VALUES ('Cardio');
INSERT INTO `tipoClase`( descripcion) VALUES ('Fuerza y tonificación');



CREATE TABLE `personaTipoClase` (
`idPersonaTipoClase` int(11) NOT NULL AUTO_INCREMENT,
`IdPersona` int(11) NOT NULL,
`idTipoClase` int(11) NOT NULL,
PRIMARY KEY (`idPersonaTipoClase`),
FOREIGN KEY (`IdPersona`) REFERENCES `persona`(`idPersona`),
FOREIGN KEY (`idTipoClase`) REFERENCES `tipoClase`(`idTipoClase`)
) ;

/*idTipoClase 1:Boxeo   idTipoClase 2:BJJ*/
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (1,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (2,2);

INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (3,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (3,2);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (4,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (4,2);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (5,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (5,2);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (6,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (6,2);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (7,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (7,2);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (8,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (8,2);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (9,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (9,2);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (10,1);
INSERT INTO `personaTipoClase`( IdPersona,idTipoClase) VALUES (10,2);


CREATE TABLE `horas` (
`idHoras` int(11) NOT NULL AUTO_INCREMENT,
`hora` varchar(5) NOT NULL,
PRIMARY KEY (`idHoras`)
) ;

INSERT INTO `horas`(hora) VALUES ('10:00');
INSERT INTO `horas`(hora) VALUES ('17:00');
INSERT INTO `horas`(hora) VALUES ('18:00');
INSERT INTO `horas`(hora) VALUES ('19:00');
INSERT INTO `horas`(hora) VALUES ('20:00');
INSERT INTO `horas`(hora) VALUES ('21:00');


CREATE TABLE `reserva` (
`idReserva` int(11) NOT NULL AUTO_INCREMENT,
`idTipoClase` int(11) NOT NULL,
`IdPersona` int(11) NULL,
`fechaHora` datetime NOT NULL,
PRIMARY KEY (`idReserva`),
FOREIGN KEY (`idTipoClase`) REFERENCES `tipoClase`(`idTipoClase`),
FOREIGN KEY (`IdPersona`) REFERENCES `persona`(`idPersona`)
);


/*INSERT RESERVAS --> insert reservas.sql*/

/*consulta reservas
- Por tipo de clase de usuario logueado
- Por fechaHora seleccionada por usuario
*/
select 
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
(select tpc.idTipoClase from personaTipoClase tpc where tpc.idPersona =3) 
and r.fechaHora = '2024-11-18 10:00'

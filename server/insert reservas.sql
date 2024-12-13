delete from reserva;
-- Parámetros de rango de fechas
SET @fecha_inicio = '2024-11-01'; -- Fecha de inicio
SET @fecha_fin = '2024-11-30';   -- Fecha de fin

-- Query para insertar datos en la tabla reserva
INSERT INTO `reserva`(idTipoClase, idPersona, fechaHora)      
WITH RECURSIVE fechas AS (
    -- Generar fechas dentro del rango especificado
    SELECT @fecha_inicio AS fecha
    UNION ALL
    SELECT DATE_ADD(fecha, INTERVAL 1 DAY)
    FROM fechas
    WHERE fecha < @fecha_fin
)
-- Combinar idTipoClase, idPersona, fechas y horas
SELECT 
    ptc.idTipoClase, 
    p.idPersona, 
    CONCAT(f.fecha, ' ', h.hora) AS fechaHora
FROM persona p
JOIN rol rp 
    ON p.idRol = rp.idRol
JOIN personaTipoClase ptc 
    ON ptc.idPersona = p.idPersona
CROSS JOIN fechas f
CROSS JOIN horas h
ORDER BY ptc.idTipoClase, p.idPersona, fechaHora;
import jwt from 'jsonwebtoken';

//Generar el JWT
const generarJWT = datos => jwt.sign({id: datos.id, nombre: datos.nombre, apellido: datos.apellido}, process.env.JWT_SECRET, {expiresIn : '1d'});

//Truco para generar Ids sin Dependencias.
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarJWT,
    generarId
}
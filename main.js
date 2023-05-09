//Importar Express - Forma Antigua - Common JS
// const express = require('express');
//Importar Express - Forma Actual - ES Module
import express from 'express';
//Al ser un Archivo creado por Nosotros se debe especificar ls Extension
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from "./config/db.js";

//Crear App (Contiene Info de Express)
const app = express();

//Conexion DB
try {
    await db.authenticate();
    console.log('Conexion Correcta...');
} catch (error) {
    console.log(error);
}

//Habilitar Pug
app.set( 'view engine', 'pug' ); //Param1: Que tipo de view engine se utilizara, Param2: Pug.
app.set( 'views', './views' ); //Param1: Donde estaran las views, Param2: ./views

//Carpeta Publica
app.use( express.static('public') ); //Indicar a express donde estaran los archivos estaticos.

//Routing
// app.get( '/', usuarioRoutes ); // get busca la ruta especifica dada
app.use( '/auth', usuarioRoutes ); //use escanea todas las rutas que empiecen con el valor dado y busca la ruta exacta en el router

//Definir Puerto y Arrancar Proyecto
const port = 3000;
app.listen( port, () => {
    console.log(`El servidor fue Arrancado en el Puerto ${port}`);
} );
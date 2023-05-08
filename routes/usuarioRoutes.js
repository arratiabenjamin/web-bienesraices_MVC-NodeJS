import express from 'express';
//Se debe importar con el mismo nombre puesto en el Export
import {formularioLogin, formularioRegistro} from '../controllers/usuarioController.js'
const router = express.Router();

// '/..' es la Ubicacion/Url
router.get( '/login',  formularioLogin);
router.get( '/registro',  formularioRegistro);

export default router
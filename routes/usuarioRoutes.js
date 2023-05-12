import express from 'express';
//Se debe importar con el mismo nombre puesto en el Export
import {formularioLogin, formularioRegistro, formularioResetPassword, registrar, confirmar} from '../controllers/usuarioController.js'
const router = express.Router();

// '/..' es la Ubicacion/Url
router.get( '/login',  formularioLogin);
router.get( '/registro',  formularioRegistro);
router.post( '/registro',  registrar);

//:token creara una URL "Dinamica", al ir cambiando dependiendo del valord el token.
//Esto para poder hacxer la confirmacion.
router.get( '/confirmar/:token',  confirmar);

router.get( '/reset-password',  formularioResetPassword);

export default router
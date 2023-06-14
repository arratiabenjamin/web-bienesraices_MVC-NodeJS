import express from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadController.js";
const router = express.Router();

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', crear);
router.post('/propiedades/crear', 
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio.'),
    body('descripcion')
        .notEmpty().withMessage('La Descripcion es Necesaria.')
        .isLength({max:150}).withMessage('La Descripcion debe ser Mas Corta.'),
    body('categoria').isNumeric().withMessage('Debes Seleccionar una Categoria.'),
    body('precio').isNumeric().withMessage('Debes Seleccionar un Rango de Precios.'),
    body('habitaciones').isNumeric().withMessage('Debes Seleccionar la Cantidad de Habitaciones.'),
    body('estacionamiento').isNumeric().withMessage('Debes Seleccionar la Cantidad de Estacionamientos.'),
    body('wc').isNumeric().withMessage('Debes Seleccionar la Cantidad de WC.'),
    body('lat').notEmpty().withMessage('Debes Seleccionar una Latitud en el Mapa.'),
    guardar
);

export default router
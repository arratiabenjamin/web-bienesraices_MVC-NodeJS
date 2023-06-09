import express from "express";
import { body } from "express-validator";
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRutas.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();

//Pagina Principal
router.get('/mis-propiedades', protegerRuta, admin);

//Crear Propiedad
router.get('/propiedades/crear', protegerRuta, crear);
router.post('/propiedades/crear',
    protegerRuta,
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

//Agregar Imagen
router.get('/propiedades/agregar-imagen/:id',
    protegerRuta,
    agregarImagen
);
router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen   
);

//Editar Propiedad
router.get('/propiedades/editar/:id',
    protegerRuta,
    editar
);
router.post('/propiedades/editar/:id',
    protegerRuta,
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
    guardarCambios
);

//Eliminar Propiedad
router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
);

//Cambiar Estado
router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado
)

//Ver Mensajes Recibidos
router.get('/mensajes/:id',
    protegerRuta,
    verMensajes
)


//Zona Publica
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
)


//Almacenar Mensajes
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min: 15}).withMessage("EL Mensaje no puede estar Vacio o es muy Corto"),
    enviarMensaje
);

export default router
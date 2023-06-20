import { validationResult } from "express-validator";
import { Categoria, Precio, Propiedad } from "../models/index.js";


const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        barra: true
    });
}
const crear = async (req, res) => {
    //Consultar Modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([ //Realiza todas las acciones en 1 solo await
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        barra: true,
        categorias, //ObjectLiteral
        precios,
        datos: {}
    });
}

const guardar = async (req, res) => {
   //Validacion
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([ //Realiza todas las acciones en 1 solo await
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            barra: true,
            categorias, //ObjectLiteral
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    //Crear Registro
    //precio:precioId - Renombramiento de Variable en Destructuring
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio:precioId, categoria:categoriaId} = req.body;
    const { id: usuarioId} = req.usuario;

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            imagen: "Hola.png",
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        });

        const { id } = propiedadGuardada;
        res.redirect(`/propiedad/agregar-imagen/${id}`);

    } catch (error) {
        console.log(error);
    }
}   

export {
    admin,
    crear,
    guardar
}

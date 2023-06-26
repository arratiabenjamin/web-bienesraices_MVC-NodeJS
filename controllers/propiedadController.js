import { validationResult } from "express-validator";
import { Categoria, Precio, Propiedad } from "../models/index.js";


const admin = async (req, res) => {

    const { id } = req.usuario
    const propiedades = await Propiedad.findAll({
        where: {
            usuarioId: id
        },
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });
    

    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        propiedades,
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
            categorias, //ObjectLiteral
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    //Crear Registro
    //precio:precioId - Renombramiento de Variable en Destructuring
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;
    const { id: usuarioId } = req.usuario;

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
        res.redirect(`/propiedades/agregar-imagen/${id}`);

    } catch (error) {
        console.log(error);
    }
}
const agregarImagen = async (req, res) => {

    const { id } = req.params;
    const { id: usuarioId } = req.usuario;

    //Validar Existencia de Propiedad
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    //Validar Publicacion de Propiedad
    if (propiedad.publicado) {
        return res.redirect('mis-propiedades');
    }

    //Validar Pertenencia de Propiedad a Usuario
    if (propiedad.usuarioId.toString() !== usuarioId.toString()) {
        return res.redirect('mis-propiedades');
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    });
}
const almacenarImagen = async (req, res, next) => {
    const { id } = req.params;

    //Validar Existencia de Propiedad
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //Validar Publicacion de Propiedad
    if (propiedad.publicado) {
        return res.redirect('mis-propiedades');
    }
    //Validar Pertenencia de Propiedad a Usuario
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('mis-propiedades');
    }

    try {
        // Almacenar Imagen y Publicar Propiedad
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;

        await propiedad.save();

        next();

    } catch (error) {
        console.log(error);
    }
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
}

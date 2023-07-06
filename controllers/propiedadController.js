import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator";
import { Categoria, Precio, Propiedad } from "../models/index.js";

//Pagina Principal
const admin = async (req, res) => {

    //Leer QueryString
    const { pagina : paginaActual } = req.query;
    console.log(paginaActual);

    // ^ debera iniciar con numero, [1-9] aceptar solo del 1 al 9, $ debera terminar con numero.
    const expresion = /^[1-9]$/;
    // test comprueba si el valor/dato cumple con las reglas o no.
    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1');
    }

    try {

        const { id } = req.usuario;

        //Limite y Offset para el paginador
        const limit = 3;
        const offset = ((paginaActual * limit) - limit);

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' }
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ]);
    
        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: +paginaActual,
            total,
            offset,
            limit
        });
    } catch (error) {
        console.log(error);
    }
}

//Crear
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
//Agregar/Guardar Imagen
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

//Editar
const editar = async (req, res) => {

    const { id } = req.params;
    const { id: usuarioId } = req.usuario;

    //Validar Existencia de Propiedad
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    //Validar Pertenencia de Propiedad a Usuario
    if (propiedad.usuarioId.toString() !== usuarioId.toString()) {
        return res.redirect('mis-propiedades');
    }

    //Consultar Modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([ //Realiza todas las acciones en 1 solo await
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias, //ObjectLiteral
        precios,
        propiedad
    });
}
const guardarCambios = async (req, res) => {
    //Verificar la Validacion
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([ //Realiza todas las acciones en 1 solo await
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias, //ObjectLiteral
            precios,
            errores: resultado.array(),
            propiedad: req.body
        });
    }


    //Validar
    const { id } = req.params;
    const { id: usuarioId } = req.usuario;

    //Validar Existencia de Propiedad
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //Validar Pertenencia de Propiedad a Usuario
    if (propiedad.usuarioId.toString() !== usuarioId.toString()) {
        return res.redirect('mis-propiedades');
    }

    //Reescribir el Objeto
    try {

        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        });

        await propiedad.save();

        res.redirect('/mis-propiedades');

    } catch (error) {
        console.log(error);
    }

}

//Eliminar
const eliminar = async (req, res) => {
    //Validar
    const { id } = req.params;
    const { id: usuarioId } = req.usuario;

    //Validar Existencia de Propiedad
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }
    //Validar Pertenencia de Propiedad a Usuario
    if (propiedad.usuarioId.toString() !== usuarioId.toString()) {
        return res.redirect('mis-propiedades');
    }

    //Eliminar Imagen
    if (propiedad.imagen) {
        await unlink(`public/uploads/${propiedad.imagen}`);
    }

    //Eliminar Propiedad
    await propiedad.destroy();
    res.redirect('/mis-propiedades');

}


//Zona Publica
//MostrarPropiedad
const mostrarPropiedad = async (req, res) => {

    const { id } = req.params

    //Comprobar Existencia de Propiedad
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });
    if (!propiedad) {
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        propiedad
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}
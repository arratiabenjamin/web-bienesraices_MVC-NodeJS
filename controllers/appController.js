import { Sequelize } from "sequelize";
import { Propiedad, Precio, Categoria } from "../models/index.js";

const inicio = async (req, res) => {

    const [categorias, precios, casas, departamentos, cabanias] = await Promise.all([
        //raw para traer atributos Principales.
        Categoria.findAll({ raw: true }),
        Precio.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                { model: Precio, ad: 'precio' }
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                { model: Precio, ad: 'precio' }
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 5
            },
            include: [
                { model: Precio, ad: 'precio' }
            ],
            order: [['createdAt', 'DESC']]
        })
    ]);

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        cabanias,
        csrfToken: req.csrfToken()
    });
}

const categoria = async (req, res) => {
    const {id} = req.params;

    //Comprobar Existencia de Categoria
    const categoria = await Categoria.findByPk(id);
    if(!categoria){
        return res.redirect('/404');
    }

    //Obtener Propiedades con la Categoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        propiedades,
        csrfToken: req.csrfToken()
    })

}

const notFound = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}

const buscador = async (req, res) => {

    const { termino } = req.body;

    //Validar que Termino no este Vacio
    if(!termino.trim()){ //trim() - Elimina los espacios para asi poder validar por completo (Ej: '    ').
        return res.redirect('back'); // 'back' - Regresa a la pagina anterior (Donde se realizo el POST en este caso).
    }

    //Consultar Propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                //Busca lo que Escribio el usuario en toda la cadena
                // el '%' del inicio es para buscar en el inicio de la cadena
                // el '%' del final es para buscar en el final de la cadena
                // Los dos juntos significa buscar en toda la cadena
                // Se debe concatenar asi porque con Templates String no Funciona
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('busqueda', {
        pagina: `Resultados de la Busqueda:`,
        termino: `"${termino}"`,
        propiedades,
        csrfToken: req.csrfToken()
    })

}

export {
    inicio,
    categoria,
    notFound,
    buscador
}
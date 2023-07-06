import { Propiedad, Precio, Categoria } from "../models/index.js";

const inicio = async (req, res) => {

    const [ categorias, precios, casas, departamentos, cabanias ] = await Promise.all([
        //raw para traer atributos Principales.
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {model: Precio, ad: 'precio'}
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                {model: Precio, ad: 'precio'}
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 5
            },
            include: [
                {model: Precio, ad: 'precio'}
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
        cabanias
    });
}

const categoria = (req, res) => {
    res.send('Estas en la Pagina Categorias.');
}

const notFound = (req, res) => {
    res.send('Error 404, Pagina No Encontrada.')
}

const buscador = (req, res) => {
    res.send('Estas Buscando.');
}

export {
    inicio,
    categoria,
    notFound,
    buscador
}
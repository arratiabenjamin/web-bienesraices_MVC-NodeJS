
import Precio from "../models/Precio.js";
import Categoria from "../models/Categoria.js";

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
        barra: true,
        categorias, //ObjectLiteral
        precios
    });
}

export {
    admin,
    crear
}
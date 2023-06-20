import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import {Precio, Categoria, Usuario} from "../models/index.js"

const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate();

        //Generar Columnas
        await db.sync();

        //Inserta los Datos
        //Promise.all - Es util usarlo si cada await no depende del otro,
        //              Si depende de Otro se Realiza por Separado.
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log('Datos Importados Correctamente.');
        process.exit(); //No se pasa codigo cuando fue correcto.
        
    } catch (error) {
        console.log(error);
        process.exit(1); //Se pasa codigo (1) si fue un error.
    }
}
const eliminarDatos = async () => {
    try {
        //Forma menos "Invasiva" (SOlo ELimina los Datos y reinicia los IDs)
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate: true}),
        //     Precio.destroy({where: {}, truncate: true})
        // ])

        //Forma mas Invasiva (Elimina y vuelve a crear las Tablas)
        await db.sync({force: true});
        console.log('Datos Eliminados Correctamente');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
//argv son como se pasan Argumentos a una Variable desde la Terminal
if(process.argv[2] === "-i"){
    importarDatos();
}
if(process.argv[2] === "-d"){
    eliminarDatos();
}
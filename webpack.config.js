
import path from 'path'; //conseguir ruta absoluta

export default {
    mode: 'development',
    //aqui van todas las entradas de datos
    entry: {
        //Aqui debes poner el nombre de referencia
        //Y la Ubicacion
        mapa: './src/js/mapa.js'
    },
    //Aqui todas las salidas
    output: {
        //filename es como se llamara el archivo
        filename: '[name].js', //[name].js: Es util por si llegas a tener varias entradas y asi no poner una por una.
        //Donde se guardara
        path: path.resolve('public/js') //resolve: busca la ruta absoluta y continua con el parametro dado
    }
}
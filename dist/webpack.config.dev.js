"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//conseguir ruta absoluta
var _default = {
  mode: 'development',
  //aqui van todas las entradas de datos
  entry: {
    //Aqui debes poner el nombre de referencia
    //Y la Ubicacion
    mapa: './src/js/mapa.js',
    agregarImagen: './src/js/agregarImagen.js',
    mostrarMapa: './src/js/mostrarMapa.js'
  },
  //Aqui todas las salidas
  output: {
    //filename es como se llamara el archivo
    filename: '[name].js',
    //[name].js: Es util por si llegas a tener varias entradas y asi no poner una por una.
    //Donde se guardara
    path: _path["default"].resolve('public/js') //resolve: busca la ruta absoluta y continua con el parametro dado

  }
};
exports["default"] = _default;
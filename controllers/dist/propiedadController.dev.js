"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mostrarPropiedad = exports.eliminar = exports.guardarCambios = exports.editar = exports.almacenarImagen = exports.agregarImagen = exports.guardar = exports.crear = exports.admin = void 0;

var _promises = require("node:fs/promises");

var _expressValidator = require("express-validator");

var _index = require("../models/index.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//Pagina Principal
var admin = function admin(req, res) {
  var paginaActual, expresion, id, limit, offset, _ref, _ref2, propiedades, total;

  return regeneratorRuntime.async(function admin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //Leer QueryString
          paginaActual = req.query.pagina;
          console.log(paginaActual); // ^ debera iniciar con numero, [1-9] aceptar solo del 1 al 9, $ debera terminar con numero.

          expresion = /^[1-9]$/; // test comprueba si el valor/dato cumple con las reglas o no.

          if (expresion.test(paginaActual)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.redirect('/mis-propiedades?pagina=1'));

        case 5:
          _context.prev = 5;
          id = req.usuario.id; //Limite y Offset para el paginador

          limit = 3;
          offset = paginaActual * limit - limit;
          _context.next = 11;
          return regeneratorRuntime.awrap(Promise.all([_index.Propiedad.findAll({
            limit: limit,
            offset: offset,
            where: {
              usuarioId: id
            },
            include: [{
              model: _index.Categoria,
              as: 'categoria'
            }, {
              model: _index.Precio,
              as: 'precio'
            }]
          }), _index.Propiedad.count({
            where: {
              usuarioId: id
            }
          })]));

        case 11:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          propiedades = _ref2[0];
          total = _ref2[1];
          res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades: propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: +paginaActual,
            total: total,
            offset: offset,
            limit: limit
          });
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](5);
          console.log(_context.t0);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 18]]);
}; //Crear


exports.admin = admin;

var crear = function crear(req, res) {
  var _ref3, _ref4, categorias, precios;

  return regeneratorRuntime.async(function crear$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Promise.all([//Realiza todas las acciones en 1 solo await
          _index.Categoria.findAll(), _index.Precio.findAll()]));

        case 2:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          categorias = _ref4[0];
          precios = _ref4[1];
          res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias: categorias,
            //ObjectLiteral
            precios: precios,
            datos: {}
          });

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.crear = crear;

var guardar = function guardar(req, res) {
  var resultado, _ref5, _ref6, categorias, precios, _req$body, titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId, categoriaId, usuarioId, propiedadGuardada, id;

  return regeneratorRuntime.async(function guardar$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          //Validacion
          resultado = (0, _expressValidator.validationResult)(req);

          if (resultado.isEmpty()) {
            _context3.next = 9;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(Promise.all([//Realiza todas las acciones en 1 solo await
          _index.Categoria.findAll(), _index.Precio.findAll()]));

        case 4:
          _ref5 = _context3.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          categorias = _ref6[0];
          precios = _ref6[1];
          return _context3.abrupt("return", res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias: categorias,
            //ObjectLiteral
            precios: precios,
            errores: resultado.array(),
            datos: req.body
          }));

        case 9:
          //Crear Registro
          //precio:precioId - Renombramiento de Variable en Destructuring
          _req$body = req.body, titulo = _req$body.titulo, descripcion = _req$body.descripcion, habitaciones = _req$body.habitaciones, estacionamiento = _req$body.estacionamiento, wc = _req$body.wc, calle = _req$body.calle, lat = _req$body.lat, lng = _req$body.lng, precioId = _req$body.precio, categoriaId = _req$body.categoria;
          usuarioId = req.usuario.id;
          _context3.prev = 11;
          _context3.next = 14;
          return regeneratorRuntime.awrap(_index.Propiedad.create(_defineProperty({
            titulo: titulo,
            descripcion: descripcion,
            habitaciones: habitaciones,
            estacionamiento: estacionamiento,
            wc: wc,
            calle: calle,
            lat: lat,
            lng: lng,
            imagen: "Hola.png",
            precioId: precioId,
            categoriaId: categoriaId,
            usuarioId: usuarioId
          }, "imagen", '')));

        case 14:
          propiedadGuardada = _context3.sent;
          id = propiedadGuardada.id;
          res.redirect("/propiedades/agregar-imagen/".concat(id));
          _context3.next = 22;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](11);
          console.log(_context3.t0);

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[11, 19]]);
}; //Agregar/Guardar Imagen


exports.guardar = guardar;

var agregarImagen = function agregarImagen(req, res) {
  var id, usuarioId, propiedad;
  return regeneratorRuntime.async(function agregarImagen$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          usuarioId = req.usuario.id; //Validar Existencia de Propiedad

          _context4.next = 4;
          return regeneratorRuntime.awrap(_index.Propiedad.findByPk(id));

        case 4:
          propiedad = _context4.sent;

          if (propiedad) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.redirect('/mis-propiedades'));

        case 7:
          if (!propiedad.publicado) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.redirect('mis-propiedades'));

        case 9:
          if (!(propiedad.usuarioId.toString() !== usuarioId.toString())) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.redirect('mis-propiedades'));

        case 11:
          res.render('propiedades/agregar-imagen', {
            pagina: "Agregar Imagen: ".concat(propiedad.titulo),
            csrfToken: req.csrfToken(),
            propiedad: propiedad
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.agregarImagen = agregarImagen;

var almacenarImagen = function almacenarImagen(req, res, next) {
  var id, propiedad;
  return regeneratorRuntime.async(function almacenarImagen$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id; //Validar Existencia de Propiedad

          _context5.next = 3;
          return regeneratorRuntime.awrap(_index.Propiedad.findByPk(id));

        case 3:
          propiedad = _context5.sent;

          if (propiedad) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.redirect('/mis-propiedades'));

        case 6:
          if (!propiedad.publicado) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.redirect('mis-propiedades'));

        case 8:
          if (!(req.usuario.id.toString() !== propiedad.usuarioId.toString())) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.redirect('mis-propiedades'));

        case 10:
          _context5.prev = 10;
          // Almacenar Imagen y Publicar Propiedad
          propiedad.imagen = req.file.filename;
          propiedad.publicado = 1;
          _context5.next = 15;
          return regeneratorRuntime.awrap(propiedad.save());

        case 15:
          next();
          _context5.next = 21;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](10);
          console.log(_context5.t0);

        case 21:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[10, 18]]);
}; //Editar


exports.almacenarImagen = almacenarImagen;

var editar = function editar(req, res) {
  var id, usuarioId, propiedad, _ref7, _ref8, categorias, precios;

  return regeneratorRuntime.async(function editar$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          usuarioId = req.usuario.id; //Validar Existencia de Propiedad

          _context6.next = 4;
          return regeneratorRuntime.awrap(_index.Propiedad.findByPk(id));

        case 4:
          propiedad = _context6.sent;

          if (propiedad) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.redirect('/mis-propiedades'));

        case 7:
          if (!(propiedad.usuarioId.toString() !== usuarioId.toString())) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.redirect('mis-propiedades'));

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(Promise.all([//Realiza todas las acciones en 1 solo await
          _index.Categoria.findAll(), _index.Precio.findAll()]));

        case 11:
          _ref7 = _context6.sent;
          _ref8 = _slicedToArray(_ref7, 2);
          categorias = _ref8[0];
          precios = _ref8[1];
          res.render('propiedades/editar', {
            pagina: "Editar Propiedad: ".concat(propiedad.titulo),
            csrfToken: req.csrfToken(),
            categorias: categorias,
            //ObjectLiteral
            precios: precios,
            propiedad: propiedad
          });

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.editar = editar;

var guardarCambios = function guardarCambios(req, res) {
  var resultado, _ref9, _ref10, categorias, precios, id, usuarioId, propiedad, _req$body2, titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId, categoriaId;

  return regeneratorRuntime.async(function guardarCambios$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          //Verificar la Validacion
          resultado = (0, _expressValidator.validationResult)(req);

          if (resultado.isEmpty()) {
            _context7.next = 9;
            break;
          }

          _context7.next = 4;
          return regeneratorRuntime.awrap(Promise.all([//Realiza todas las acciones en 1 solo await
          _index.Categoria.findAll(), _index.Precio.findAll()]));

        case 4:
          _ref9 = _context7.sent;
          _ref10 = _slicedToArray(_ref9, 2);
          categorias = _ref10[0];
          precios = _ref10[1];
          return _context7.abrupt("return", res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias: categorias,
            //ObjectLiteral
            precios: precios,
            errores: resultado.array(),
            propiedad: req.body
          }));

        case 9:
          //Validar
          id = req.params.id;
          usuarioId = req.usuario.id; //Validar Existencia de Propiedad

          _context7.next = 13;
          return regeneratorRuntime.awrap(_index.Propiedad.findByPk(id));

        case 13:
          propiedad = _context7.sent;

          if (propiedad) {
            _context7.next = 16;
            break;
          }

          return _context7.abrupt("return", res.redirect('/mis-propiedades'));

        case 16:
          if (!(propiedad.usuarioId.toString() !== usuarioId.toString())) {
            _context7.next = 18;
            break;
          }

          return _context7.abrupt("return", res.redirect('mis-propiedades'));

        case 18:
          _context7.prev = 18;
          _req$body2 = req.body, titulo = _req$body2.titulo, descripcion = _req$body2.descripcion, habitaciones = _req$body2.habitaciones, estacionamiento = _req$body2.estacionamiento, wc = _req$body2.wc, calle = _req$body2.calle, lat = _req$body2.lat, lng = _req$body2.lng, precioId = _req$body2.precio, categoriaId = _req$body2.categoria;
          propiedad.set({
            titulo: titulo,
            descripcion: descripcion,
            habitaciones: habitaciones,
            estacionamiento: estacionamiento,
            wc: wc,
            calle: calle,
            lat: lat,
            lng: lng,
            precioId: precioId,
            categoriaId: categoriaId
          });
          _context7.next = 23;
          return regeneratorRuntime.awrap(propiedad.save());

        case 23:
          res.redirect('/mis-propiedades');
          _context7.next = 29;
          break;

        case 26:
          _context7.prev = 26;
          _context7.t0 = _context7["catch"](18);
          console.log(_context7.t0);

        case 29:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[18, 26]]);
}; //Eliminar


exports.guardarCambios = guardarCambios;

var eliminar = function eliminar(req, res) {
  var id, usuarioId, propiedad;
  return regeneratorRuntime.async(function eliminar$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          //Validar
          id = req.params.id;
          usuarioId = req.usuario.id; //Validar Existencia de Propiedad

          _context8.next = 4;
          return regeneratorRuntime.awrap(_index.Propiedad.findByPk(id));

        case 4:
          propiedad = _context8.sent;

          if (propiedad) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", res.redirect('/mis-propiedades'));

        case 7:
          if (!(propiedad.usuarioId.toString() !== usuarioId.toString())) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.redirect('mis-propiedades'));

        case 9:
          if (!propiedad.imagen) {
            _context8.next = 12;
            break;
          }

          _context8.next = 12;
          return regeneratorRuntime.awrap((0, _promises.unlink)("public/uploads/".concat(propiedad.imagen)));

        case 12:
          _context8.next = 14;
          return regeneratorRuntime.awrap(propiedad.destroy());

        case 14:
          res.redirect('/mis-propiedades');

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  });
}; //Zona Publica
//MostrarPropiedad


exports.eliminar = eliminar;

var mostrarPropiedad = function mostrarPropiedad(req, res) {
  var id, propiedad;
  return regeneratorRuntime.async(function mostrarPropiedad$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          id = req.params.id; //Comprobar Existencia de Propiedad

          _context9.next = 3;
          return regeneratorRuntime.awrap(_index.Propiedad.findByPk(id, {
            include: [{
              model: _index.Categoria,
              as: 'categoria'
            }, {
              model: _index.Precio,
              as: 'precio'
            }]
          }));

        case 3:
          propiedad = _context9.sent;

          if (propiedad) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", res.redirect('/404'));

        case 6:
          res.render('propiedades/mostrar', {
            pagina: propiedad.titulo,
            propiedad: propiedad
          });

        case 7:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.mostrarPropiedad = mostrarPropiedad;
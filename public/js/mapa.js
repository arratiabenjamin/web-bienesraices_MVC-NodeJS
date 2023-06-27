/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\n\n    //Se utiliza Logical Or( \"||\" ) - Para poder evaluar el \"False\" que podria devolver el value de los string.\n    //Estos no devuelven un False Booleano como tal sino un Truti que es algo parecido al False, pero no es Booleano.\n\n    //Latitud\n    const lat = document.querySelector(\"#lat\").value || -33.45694;\n    //Longitud\n    const lng = document.querySelector(\"#lng\").value || -70.64827;\n    //Asignacion de valores\n    const mapa = L.map('mapa').setView([lat, lng ], 12);\n    //var de Pincho\n    let marker;\n    //Provider y GeoCoder\n    const geocodeService = L.esri.Geocoding.geocodeService();\n    \n    //Creacion de Mapa\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n    //Pincho\n    marker = new L.marker([lat, lng], {\n        //Mover Pincho\n        draggable: true,\n        //Reposicionar Mapa\n        autoPan: true\n    })\n    .addTo(mapa)//Añadir Pin al Mapa\n\n    //Detectar movimiento\n    marker.on('moveend', function(e){\n        marker = e.target;\n        const posicion = marker.getLatLng();\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))\n\n        //Obtener Info de la Calle al Soltar el Pin\n        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){\n            marker.bindPopup(resultado.address.LongLabel);\n\n            //Llenar Campos Hidden\n            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';\n            document.querySelector('#calle').value = resultado?.address?.Address ?? '';\n            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';\n            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';\n        });\n\n    });\n\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
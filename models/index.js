//Creado para las Relaciones entre Entidades
//Para evitar errores con Existencia.

import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js";
import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Mensaje from "./Mensaje.js";

// Precio.hasOne(Propiedad) //Se lee de Derecha a Izquierda - Realiza lo mismo que belongsTo()

Propiedad.belongsTo(Precio, { foreignKey: "precioId" });
Propiedad.belongsTo(Categoria, { foreignKey: "categoriaId" });
Propiedad.belongsTo(Usuario, { foreignKey: "usuarioId" });
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId' }) //hasMany 1 a Muchos, 1 Propiedad - Muchos Mensajes

//Relacion de Mensaje

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId' })
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId' })

export {
    Precio,
    Propiedad,
    Usuario,
    Categoria,
    Mensaje
}
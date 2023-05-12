import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

//Definir nuevo Modelo
const Usuario = db.define( 'usuario', {
    nombre: {
        //Tipo de dato
        type: Sequelize.STRING,
        //Posibilidad de ser Nulo o no
        allowNull: false
    },
    apellido: {
        //Tipo de dato
        type: Sequelize.STRING,
        //Posibilidad de ser Nulo o no
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    token: Sequelize.STRING,
    confirmado: Sequelize.BOOLEAN
}, {
    hooks: {
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

export default Usuario;
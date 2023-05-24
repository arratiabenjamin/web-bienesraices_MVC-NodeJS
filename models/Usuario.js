import Sequelize from 'sequelize';
import bcryptjs from 'bcryptjs';
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
            const salt = await bcryptjs.genSalt(10);
            usuario.password = await bcryptjs.hash(usuario.password, salt);
        }
    }
});

//Prototypes
Usuario.prototype.verificarPassword = function(password){
    return bcryptjs.compareSync(password, this.password);
}

export default Usuario;
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config( {path: '.env'} )

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD ?? '', {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        // Hacer un registro de cuando se Creo el Usuario y cuando se Actualizo
        timestamps: true
    },
    //Mantener Conexiones a DB por Usuario
    pool: {
        //5 Conexiones Maximas
        max: 5,
        // 0 Conexiones Minimas
        min: 0,
        // 30s Tratando de Realizar una Conexion, si no pudo Manda Error
        acquire: 30000,
        // Espera 10s para Finalizar una Conexion
        idle: 10000
    },
    //Los Aliases ya no se utilizan por lo que se coloca false
    operatorAliases: false
});

export default db;

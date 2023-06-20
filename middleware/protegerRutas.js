import Jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

const protegerRuta = async (req, res, next) => {
   
    // Verificacion Existencia de Token
    const { _token } = req.cookies;
    if (!_token) {
        return res.redirect('/auth/login');
    }

    // Vefiricacion de Token
    try {
        const decoded = Jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarInfoImportante').findByPk(decoded.id);
        
        if (usuario) {
            req.usuario = usuario;
        }else{
            res.redirect('/auth/login');
        }

    } catch (error) {
        return res.clearCookie('_tokend').redirect('/auth/login');
    }

    next();

}

export default protegerRuta;
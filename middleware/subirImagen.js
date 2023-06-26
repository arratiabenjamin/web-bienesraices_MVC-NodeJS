import multer from "multer";
import path from 'path';
import { generarId } from "../helpers/tokens.js"

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb){
        // extname = obtiene el formato del archivo subido
        //Osea generamos un id con generarId() y le sumamos la extension o formato con path.extname
        cb(null, generarId() + path.extname(file.originalname));
    }
});

const upload = multer({ storage })

export default upload
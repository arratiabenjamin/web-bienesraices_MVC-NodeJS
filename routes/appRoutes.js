//router de Paginas Generales(pagina principal, 404, etc).
import Express from "express";
import { inicio, categoria, notFound, buscador } from "../controllers/appController.js";

const router = Express.Router();

//Pagina Principal
router.get('/', inicio);

//Categorias 
router.get('/categorias/:id', categoria);

//Pagina 404
router.get('/404', notFound);

//Buscador
router.post('/busqueda', buscador);

export default router;
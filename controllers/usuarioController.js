
//req = request (Pedido Ej: id de una Tabla de DB) / res = response (Respuesta)
const formularioLogin = (req, res) => {
    //Solo se pasa nombre de carpeta y archivo sin extension sin incluis views
    res.render( 'auth/login', {
        
    } );
}
const formularioRegistro = (req, res) => {
    //Solo se pasa nombre de carpeta y archivo sin extension sin incluis views
    res.render( 'auth/registro', {
        
    } );
}

// router.post( '/', (req, res) => {
//     res.json( { msg: 'Url Tipo POST' } );
// } )

//Forma "Acortada" de Englobar Request de una misma Url.
// router.route('/')
//     .get( (req, res) => {
//         res.json({msg: 'Servidor Node Arrancado desde Puerto 3000. CORRECTAMENTE. Tipo GET'});
//     } )
//     .post( (req, res) => {
//         res.json( { msg: 'Url Tipo POST' } );
//     } )

//Export para mas de una Funcion o Metodo.
export {
    formularioLogin,
    formularioRegistro
}
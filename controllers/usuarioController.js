import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';
import csrf from 'csurf';

//req = request (Pedido Ej: id de una Tabla de DB) / res = response (Respuesta)
const formularioLogin = (req, res) => {
    //Solo se pasa nombre de carpeta y archivo sin extension sin incluis views
    res.render( 'auth/login', {
        pagina: 'Sign In'
    } );
}

const formularioRegistro = (req, res) => {
    res.render( 'auth/registro', {
        pagina: 'Sign Up',
        //Pasar token de csrf a registro
        csrfToken: req.csrfToken()
    } );
}
const registrar = async (req, res) => {
    //req.body Obtiene los datos enviados de un formulario

    //equals da error al poner entre comillas la variable y lo toma como valor, en el curso aparece con comillas
    //Una solucion es crear variables de req.body y asignarlas al cual
    const { nombre, apellido, email, password } = req.body;

    //Validacion
    await check('nombre').notEmpty().withMessage('El Nombre es Obligatorio').run(req);
    await check('apellido').notEmpty().withMessage('El Apellido es Obligatorio').run(req);
    await check('email').isEmail().withMessage('El Email es Obligatorio').run(req);
    await check('password').isLength({min: 5}).withMessage('El Password debe tener al menos 5 Caracteres').run(req);
    await check('repetir_password').equals(password).withMessage('Los Passwords no son Iguales').run(req);

    let resultado = validationResult(req);
    // res.json(resultado);

    if(!resultado.isEmpty()){
        return res.render( 'auth/registro', {
            pagina: 'Sign In',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: nombre,
                apellido: apellido,
                //Si la key tiene el mismo nombre que el value solo se escribe 1 ves
                //Esto se llama Object Literal
                email
            }
        } );
    }

    //Usualmente se usa "await" cuando se interactua con la DB
    const existeUsuario = await Usuario.findOne( { where: { email } } );
    
    if(existeUsuario){
        return res.render( 'auth/registro', {
            pagina: 'Sign In',
            errores: [ {msg: 'El email ya esta Registrado.'} ],
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: nombre,
                apellido: apellido,
                email
            }
        } );
    }

    const usuario = await Usuario.create( {
        nombre,
        apellido,
        email,
        password,
        token : generarId()
    } )

    //Asignar Datos al Envio de Email y Llamar la Funcion
    emailRegistro({
        nombre : usuario.nombre,
        apellido : usuario.apellido,
        email : usuario.email,
        token : usuario.token
    })

    //Mostrar Mensaje de Creacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de Confirmación, presiona en el enlace'
    })

}

//Comprobacion de Cuenta
const confirmar = async (req, res) => {

    const { token } = req.params

    //Verificar token
    const usuario = await Usuario.findOne({ where: {token} })
    console.log(token);
    console.log(usuario);

    if(!usuario){
        return res.render( 'auth/confirmar-cuenta', {
            pagina: 'Error al Confirmar Cuenta',
            mensaje: 'Se Produjo un Error al Intentar Confirmar tu Cuenta, Intentalo de Nuevo.',
            error: true
        } )
    }

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    return res.render( 'auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada con Exito',
        mensaje: 'Tu Cuenta se a Confirmado con Exito, ya Puedes Acceder a la Web'
    } )


    //next() sirve para seguir al siguiente middleware sin un res.render o res.json (se debe pasar como parametro antes)
    //next()
}

const formularioResetPassword = (req, res) => {
    res.render( 'auth/reset-password', {
        pagina: 'Resetar Password',
        csrfToken: req.csrfToken()
    } );
}

const resetPassword = async (req, res) => {

    //Validacion
    await check('email').isEmail().withMessage('El Email es Obligatorio y Debe ser Valido').run(req);

    let resultado = validationResult(req);
    // res.json(resultado);

    //Realizar response si el campo esta vacio.
    if(!resultado.isEmpty()){
        return res.render( 'auth/reset-password', {
            pagina: 'Resetear Password',
            errores: resultado.array(),
            csrfToken: req.csrfToken()
        } );
    }

    //Buscar Usuario
    const { email } = req.body;
    const usuario = await Usuario.findOne( { where : {email} } );
    if(!usuario){
        return res.render( 'auth/reset-password', {
            pagina: 'Resetear Password',
            errores: [{msg : 'El email no esta Registrado'}],
            csrfToken: req.csrfToken()
        } );
    }

}

//EJ:
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
    formularioRegistro,
    formularioResetPassword,
    registrar,
    confirmar,
    resetPassword
}
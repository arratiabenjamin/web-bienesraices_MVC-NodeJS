import { check, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import Usuario from '../models/Usuario.js'
import { generarJWT, generarId } from '../helpers/tokens.js';
import { emailRegistro, emailResetPassword } from '../helpers/emails.js';
import router from '../routes/usuarioRoutes.js';

//req = request (Pedido Ej: id de una Tabla de DB) / res = response (Respuesta)
//Login
const formularioLogin = (req, res) => {
    //Solo se pasa nombre de carpeta y archivo sin extension sin incluis views
    res.render( 'auth/login', {
        pagina: 'Sign In',
        csrfToken: req.csrfToken()
    } );
}
const autenticar = async (req, res) => {
    //Validar Campos
    await check('email').notEmpty().withMessage('El Email es Obligatorio').run(req);
    await check('password').notEmpty().withMessage('El Password es Obligatorio').run(req);

    let resultado = validationResult(req);
    // res.json(resultado);

    //Si el Resultado no esta vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render( 'auth/login', {
            pagina: 'Iniciar Sesion',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        } );
    }
    const {email, password} = req.body;

    //COMPROBACIONES
    //Comprobar Existencia de Usuario
    const usuario = await Usuario.findOne({where: {email}});
    if(!usuario){
        return res.render( 'auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{msg: 'El usuario no existe'}],
            csrfToken: req.csrfToken(),
        } );
    }
    //Comprobar Confirmacion de Usuario
    if(!usuario.confirmado){
        return res.render( 'auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{msg: 'Usuario no Confirmado, Porfavor Confirmar'}],
            csrfToken: req.csrfToken(),
        } );
    }
    //Comprobacion Password
    if(!usuario.verificarPassword(password)){
        return res.render( 'auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{msg: 'Contraseña Incorrecta, Intente nuevamente'}],
            csrfToken: req.csrfToken(),
        } );
    }

    //AUTENTICACION
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido});

    console.log(token);

    //Almacenar Cookie
    return res.cookie('_token', token, {
        //Evitar CSRF
        httpOnly: true
        //secure: true, //acceder a cookies en sitios seguros
        //sameSite: true //Tambien es para Seguridad
    }).redirect('/mis-propiedades');

}

//Registro
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

//Reseteo Password
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
    //Si Usuario no existe realizar Response con Error
    if(!usuario){
        return res.render( 'auth/reset-password', {
            pagina: 'Resetear Password',
            errores: [{msg : 'El email no esta Registrado'}],
            csrfToken: req.csrfToken()
        } );
    }

    //Generar Token
    usuario.token = generarId();
    await usuario.save();
    //Enviar Email
    emailResetPassword( {
        email : usuario.email,
        nombre : usuario.nombre,
        apellido : usuario.apellido,
        token : usuario.token
    } );
    //Mostrar Mensaje de Confirmacion
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos Enviado un Email con Instrucciones'
    })

}
//Comprobacion de Token Obtenido
const comprobarToken = async (req, res) => {

    const { token } = req.params;

    //COmprobacion Existencia
    const usuario = await Usuario.findOne( { where : {token} } );
    if(!usuario){
        return res.render( 'auth/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Error al Validar la Informacion, Intenta Nuevamente',
            error: true
        } )
    }

    //Formulario para Modificar Password
    res.render('auth/nuevo-password', {
        pagina: 'Nuevo Password',
        csrfToken : req.csrfToken()
    });
    
}
//Cambiar Password
const nuevoPassword = async (req, res) => {

    // Validar Password
    await check('password').isLength({min: 5}).withMessage('El Password debe tener al menos 5 Caracteres').run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render( 'auth/nuevo-password', {
            pagina: 'Reestablece tu Password',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        } );
    }

    //Identificar Usuario a Cambiar
    const { token } = req.params
    const { password } = req.body;
    const usuario = await Usuario.findOne({where: {token}});

    //Hashear nuevo Password y Eliminar Token
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);
    usuario.token = null;

    //Guardar Password
    await usuario.save();

    //Renderizar Vista de Exito
    res.render( 'auth/confirmar-cuenta', {
        pagina : 'Nuevo Password',
        mensaje : 'Password Reestablecido Correctamente'
    } )

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
    autenticar,
    formularioRegistro,
    formularioResetPassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
}
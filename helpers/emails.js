import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    
    const { nombre, apellido, email, token } = datos;

    //Enviar Email
    await transport.sendMail({
        from: 'bienesraicesNode.com',
        to: email,
        subject: 'Confirma tu Cuenta de bienesraicesNode.com',
        text: 'Confirma tu Cuenta de bienesraicesNode.com',
        html: `
            <p> Hola ${nombre} ${apellido}, verifica tu cuenta de bienesraicesNode.com </p>

            <p> Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar Cuenta </a> </p>

            <p> Si no creaste esta cuenta, solo ignora este mensaje. </p>
        `
    })
    
}
const emailResetPassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    
    const { nombre, apellido, email, token } = datos;

    //Enviar Email
    await transport.sendMail({
        from: 'bienesraicesNode.com',
        to: email,
        subject: 'Restea el Password de tu Cuenta de bienesraicesNode.com',
        text: 'Restea el Password de tu Cuenta de bienesraicesNode.com',
        html: `
            <p>Hola ${nombre} ${apellido}, Cambia el Password de tu Cuenta de bienesraicesNode.com</p>
            <p> Ve al Siguiente Enlace para Resetear tu Password: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/reset-password/${token}"> Resetear Password </a> </p>
            <p> Si no Solicitaste este Reseteo de Password, solo Ignora este Mensaje. </p>
        `
    })
    
}

export {
    emailRegistro,
    emailResetPassword
}
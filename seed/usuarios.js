import bcryptjs from 'bcryptjs';

const usuarios = [
    {
        nombre: 'Alejandro',
        apellido: 'Santibanez',
        email: 'ale@ale.com',
        confirmado: 1,
        password: bcryptjs.hashSync('Benja15', 10)
    }
]

export default usuarios;
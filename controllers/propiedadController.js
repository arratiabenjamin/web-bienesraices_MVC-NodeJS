
const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades'
    });
}

export {
    admin
}
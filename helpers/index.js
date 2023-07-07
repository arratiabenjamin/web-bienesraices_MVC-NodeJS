const esVendedor = (usuarioId, propiedadUsuarioId) => {
    return usuarioId === propiedadUsuarioId;
}
const formatearFecha = fecha => {
    //toISOString() - Convierte una Fecha a String sin convertir el formato.
    //slice() - Toma desde un caracter hasta otro caracter de un String
    // En este caso del caracter numero 0 al caracter numero 10
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones);

}

export {
    esVendedor,
    formatearFecha
}
var socket = io();


var params = new URLSearchParams(window.location.search);

if (!params.has('nombre')) {
    window.location = 'index.html';
    throw new Error("nbr necesario");
}


var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(res) {
        console.log("usuario conectados ", res);
        renderizarUsuarios(res.usuarios, false);
    });


});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Escuchar información del servidor
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);
    //renderizo ese mensaje
    renderizarMensajes(mensaje)

});

// Escuchar cuando un user entra o sale del chat
socket.on('listaPersona', function(personas) {

    console.log('Servidor la nueva lista de personas es:', personas);
    renderizarUsuarios(personas);

});


//mensaje privado escuchar
socket.on('mensajePrivado', (mensaje) => {
    console.log("mensaje privado ", mensaje);
});
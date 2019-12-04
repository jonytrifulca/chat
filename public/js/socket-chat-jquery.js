//funciones para renderizar usuarios
var params = new URLSearchParams(window.location.search);

var usuarioNombre = params.get('nombre');
var sala = params.get('sala');

//referencias jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');

var chatBox = $('#divChatbox');

//recibe un vector de personas json
function renderizarUsuarios(personas) {

    console.log("renderizar personas", personas);

    var html = '';

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';

    //lista de personas
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);


}


//listeners
//click en un usuario del div de usuarios
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id'); //obtengo el id de dicho usuario pulsado
    console.log("pusado el cliente on id:" + id);
});

formEnviar.on('submit', function(e) {
    //evitar el click y refresh de la pagina!!
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0)
        return;

    console.log("Enviar mensaje:" + txtMensaje.val());
    //enviamos el mensaje

    // Enviar información
    socket.emit('crearMensaje', {
        nombre: usuarioNombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        //cuando el servidor me confirma k se envio => borro el cuadro y seteo el foco
        txtMensaje.val('').focus();
        console.log('respuesta server: ', mensaje);
        //lo pinto
        renderizarMensajes(mensaje, true);
    });
});


//añado un mensaje rendreizo cuando me llega lo pinto
function renderizarMensajes(mensaje, yo) {

    var html = "";
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ":" + fecha.getMinutes();


    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (!yo) {

        html += '<li class="animated fadeIn">';
        if (mensaje.nombre != 'Administrador')
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';

        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '    <h5>' + mensaje.nombre + '</h5>';
        html += ' <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    chatBox.append(html);

    scrollBottom();

}


//mover auto el scroll hacia abajo o dejarlo como esta
function scrollBottom() {

    // selectors
    var newMessage = chatBox.children('li:last-child');

    // heights
    var clientHeight = chatBox.prop('clientHeight');
    var scrollTop = chatBox.prop('scrollTop');
    var scrollHeight = chatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        chatBox.scrollTop(scrollHeight);
    }
}
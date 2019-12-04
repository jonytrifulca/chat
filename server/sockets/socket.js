const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {
        //siempre vendra nombre si no estaria en index
        let id = client.id;
        usuarios.agregarPersona(id, data.nombre, data.sala);
        console.log("conectado " + data.nombre + "a la sala " + data.sala);

        //uno el cliente a la sala
        client.join(data.sala);

        //respondo al tio que se conecto con el listado de personas
        callback({
            usuarios: usuarios.getPersonasPorSala(data.sala)
        });

        console.log("personas en la sala:", usuarios.getPersonasPorSala(data.sala));

        //notifico a todos los demas de un nuevo miembro en el chat
        let mensaje = `Nueva persona en la sala ${data.sala} => ${data.nombre}`;
        client.broadcast.emit('listaPersona', { usuario: 'Administrador', mensaje: mensaje });

        //notifico a todo el mundo de todas las salas
        //client.broadcast.emit('listaPersona', usuarios.getPersonas());

        //notifico solo a los de esa sala
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        //envio mensaje de conexion
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', mensaje));



    });


    //cuando se desconecte => lo borramos del vector y notificamos a todo el mundo
    client.on('disconnect', () => {
        console.log('Usuario desconectado => ', client.id);
        let personaBorrada = usuarios.getPersona(client.id);
        usuarios.borrarPersona(client.id);

        //notificamos a todo el mundo que este se fune
        let mensaje = `La persona ${personaBorrada.nombre} abandono el chat`;
        //client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: mensaje });
        //client.broadcast.emit('crearMensaje', crearMensaje('Administrador', mensaje));
        //client.broadcast.emit('listaPersona', usuarios.getPersonas());

        //solo a los de su sala
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', mensaje));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));


    });


    //cuando los usuarios envian un mensaje al server
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        console.log("mensaje de " + persona.nombre + "en la sala " + persona.sala + " => ", data);

        //se lo reenvio a todo el mundo
        //client.broadcast.emit('crearMensaje', mensaje);

        //se lo reenvio a la gente de la sala
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        //confirmo al tio k su mensaje se envio
        callback(mensaje);


    });

    //cuando un usuario enviar un mensaje privado a otro
    client.on('mensajePrivado', (data) => {

        //viene el id del que envia y el id del destinatario

        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        let usuarioDestinoID = data.para;

        console.log("mensaje de " + persona.nombre + " => ", data);

        //se lo envio al tio en cuestion
        client.broadcast.to(usuarioDestinoID).emit('mensajePrivado', mensaje);

    });



});
/**
 * Clase que gestiona todos los usuarios conectados
 */
class Usuarios {

    constructor() {
        this.personas = [];
    }

    /**
     * Agregar una persona al chat
     * @param {*} id 
     * @param {*} nombre 
     */
    agregarPersona(id, nombre, sala) {

        let persona = {
            id: id,
            nombre: nombre,
            sala: sala
        };

        this.personas.push(persona);

        return this.personas;
    }

    /**
     * Devuelve la info de una persona por su id
     * @param {*} id 
     */
    getPersona(id) {
        let persona = this.personas.filter(per => { return per.id === id })[0];

        //si no encuentro ninguna persona por id => sera undefined => da igual la devuelvo
        return persona;

    }

    /**
     * Devuelvo todos los integrantes
     */
    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(person => {
            return person.sala === sala
        });
        return personasEnSala;
    }

    /**
     * Lo saco del vector
     * @param {*} id 
     */
    borrarPersona(id) {

        //obtengo el tio que borraré antes de eliminarlo
        let personaBorrada = this.getPersona(id);

        //personas = personas kitando el que tiene el id pasado
        this.personas = this.personas.filter(persona => {
            return persona.id != id;
        });

        return personaBorrada; //suponiendo k siempre la encuentro
    }



} //fin clase


module.exports = {
    Usuarios
}
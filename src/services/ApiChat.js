import FactoryMensajesDAO from '../model/DAOs/mensajes/FactoryMensajesDAO.js';
import { TIPO_PERSISTENCIA } from '../config/config.js' //Importo variables de entorno
import { logger } from "../utils/logger.js"

class ApiChat {

    constructor() { // seteo contenedor de productos según Factory
        this.contenedorMensajes = FactoryMensajesDAO.get(TIPO_PERSISTENCIA)
    }

    chatHandler = (io) => {

        const CHATMSG = 'chat_msg' //Constante que seteo tanto del lado del server como del cliente ya que deben coincidir.

        io.on('connection', async (socket) => { //Gestiono conexión de un cliente

            // console.log('Client connected:', socket.id);

            socket.emit(CHATMSG, await this.contenedorMensajes.getAll()) //Envío al nuevo socket los mensajes de chat registrados al momento

            socket.on(CHATMSG, async (data) => { //Recibo, guardo y retransmito Mensajes de Chat
                try {
                    let newId = await this.contenedorMensajes.save(data)
                    if (newId) {
                        io.sockets.emit(CHATMSG, await this.contenedorMensajes.getAll());

                    } else {
                        throw 'Error al guardar nuevo Mensaje de Chat'
                    }
                } catch (error) {
                    logger.error(error)
                }
            });
            // socket.on('disconnect', () => console.log('Disconnected!', socket.id));
        });
    }
}

export default ApiChat
// Importo los diferentes DAOs
import MensajesDaoMongo from './MensajesDaoMongo.js';
import MensajesDaoFile from './MensajesDaoFile.js';

class FactoryMensajesDAO {

    static get(tipo) {
        // Devuelvo DAO según Tipo de Persistencia seleccionado
        switch (tipo) {
            case 'MONGO': return new MensajesDaoMongo();
            case 'FILE': return new MensajesDaoFile();
            default: return new MensajesDaoMongo();
        }
    }
}

export default FactoryMensajesDAO
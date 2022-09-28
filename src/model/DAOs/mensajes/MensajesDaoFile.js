//Importo Clase Contenedor para luego extender de ella
import ContenedorFile from '../../contenedores/ContenedorFile.js';

class MensajesDaoFile extends ContenedorFile {

    constructor() {
        super(process.cwd() + '/fileDB/mensajes.json');
    }
}

export default MensajesDaoFile
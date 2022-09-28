// Importo los diferentes DAOs
import CarritosDaoMongo from './CarritosDaoMongo.js';
import CarritosDaoFile from './CarritosDaoFile.js';

class FactoryCarritosDAO {

    static get(tipo) {
        // Devuelvo DAO según Tipo de Persistencia seleccionado
        switch (tipo) {
            case 'MONGO': return new CarritosDaoMongo();
            case 'FILE': return new CarritosDaoFile();
            default: return new CarritosDaoMongo();
        }
    }
}

export default FactoryCarritosDAO
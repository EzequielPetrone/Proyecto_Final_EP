// Importo los diferentes DAOs
import ProductosDaoMongo from './ProductosDaoMongo.js';
import ProductosDaoFile from './ProductosDaoFile.js';

class FactoryProductosDAO {

    static get(tipo) {
        // Devuelvo DAO según Tipo de Persistencia seleccionado
        switch (tipo) {
            case 'MONGO': return new ProductosDaoMongo();
            case 'FILE': return new ProductosDaoFile();
            default: return new ProductosDaoMongo();
        }
    }
}

export default FactoryProductosDAO
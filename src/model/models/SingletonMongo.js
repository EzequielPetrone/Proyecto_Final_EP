import mongoose from 'mongoose' //Importo mongoose
import { MONGO_URL } from '../../config/config.js' //Traigo cadena de conexión a Mongo atlas del .env

let instance = null

class SingletonMongo {

    constructor() {
        
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.client = mongoose
    }

    static getInstance() {
        
        if (!instance) {
            instance = new SingletonMongo()
        }
        return instance
    }
}

export default SingletonMongo
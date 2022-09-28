// Importo e instancio Singleton para la conexión con Mongo
import SingletonMongo from './SingletonMongo.js'
const mongoose = SingletonMongo.getInstance().client

const carritoSchema = new mongoose.Schema({

    userEmail: { type: String, max: 100 },
    activo: { type: Boolean },
    productos: []
},
    { strict: false },
    { timestamps: true }
)

export default mongoose.model('carritosProyecto', carritoSchema)
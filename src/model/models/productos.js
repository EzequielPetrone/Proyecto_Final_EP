// Importo e instancio Singleton para la conexión con Mongo
import SingletonMongo from './SingletonMongo.js'
const mongoose = SingletonMongo.getInstance().client

const productoSchema = new mongoose.Schema({

    nombre: { type: String, required: true, max: 50 },
    descripcion: { type: String, required: true, max: 100 },
    codigo: { type: String, required: true, max: 10, unique: true },
    thumbnail: { type: String, required: true, max: 500 },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }
},
    { strict: false },
    { timestamps: true }
)

export default mongoose.model('productosProyecto', productoSchema)
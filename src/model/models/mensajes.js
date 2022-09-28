// Importo e instancio Singleton para la conexión con Mongo
import SingletonMongo from './SingletonMongo.js'
const mongoose = SingletonMongo.getInstance().client

const MensajeSchema = new mongoose.Schema({
  email: { type: String, required: true, max: 100 },
  name: { type: String, required: true, max: 100 },
  textoMensaje: { type: String, required: true, max: 1000 },
},
  { strict: false },
  { timestamps: true }
)

export default mongoose.model('mensajesProyecto', MensajeSchema)
// Importo e instancio Singleton para la conexión con Mongo
import SingletonMongo from './SingletonMongo.js'
const mongoose = SingletonMongo.getInstance().client

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  name: { type: String, required: true, max: 100 },
  direccion: { type: String, required: true, max: 100 },
  nacimiento: { type: Date, required: true },
  phone: { type: String, required: true, max: 50 },
  avatar: { type: String, required: true, max: 200 }
},
  { strict: false },
  { timestamps: true }
)

export default mongoose.model('usuariosProyecto', UsuarioSchema)
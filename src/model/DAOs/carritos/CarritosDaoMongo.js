//Importo Clase Contenedor para luego extender de ella
import ContenedorMongo from '../../contenedores/ContenedorMongo.js';

// Importo Model del schema 'carritos' 
import carritosModel from '../../models/carritos.js'

//DAO que extiende de clase Contenedor
class CarritosDaoMongo extends ContenedorMongo {

    constructor() {
        super(carritosModel);
    }

    async getCartIdByUserEmail(email) {

        const result = await this.model.findOne({ userEmail: email, activo: true })

        return result ? result._id : null
    }

    async checkout(cartId) {
        const result = await this.model.findById(cartId)
        if (result.productos.length) {
            return await this.model.findByIdAndUpdate(cartId, { activo: false })
        } else {
            return null
        }
    }

    // Para el alta de un nuevo Carrito
    postCarrito = async (email) => {
        try {
            const cartId = await this.getCartIdByUserEmail(email)
            if (cartId) {
                return await this.getById(cartId)
            } else {
                const newId = await this.save({ userEmail: email, activo: true, productos: [] })
                if (newId) {
                    return await this.getById(newId)
                }
            }
        } catch (error) {
            return null
        }
    }
}

export default CarritosDaoMongo
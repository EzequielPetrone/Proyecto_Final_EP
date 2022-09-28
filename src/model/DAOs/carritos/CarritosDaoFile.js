//Importo Clase Contenedor para luego extender de ella
import ContenedorFile from '../../contenedores/ContenedorFile.js';

class CarritosDaoFile extends ContenedorFile {

    constructor() {
        super(process.cwd() + '/fileDB/carritos.json');
    }

    async getCartIdByUserEmail(email) {
        try {
            const contenidoFile = await this.getAll()
            const result = contenidoFile.find(obj => obj.userEmail == email && obj.activo == true)
            return result ? result.id : null

        } catch (error) {
            return null
        }
    }

    async checkout(cartId) {
        try {
            const result = await this.getById(cartId)
            if (result.productos.length) {
                result.activo = false
                return await this.editById(cartId, result)
            } else {
                return null
            }
        } catch (error) {
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

export default CarritosDaoFile
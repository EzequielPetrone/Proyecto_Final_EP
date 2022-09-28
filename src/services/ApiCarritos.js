import FactoryProductosDAO from '../model/DAOs/productos/FactoryProductosDAO.js'; //Importo Factory
import FactoryCarritosDAO from '../model/DAOs/carritos/FactoryCarritosDAO.js';
import { TIPO_PERSISTENCIA, MAIL_ADMIN } from '../config/config.js' //Importo variables de entorno
import { sendEmail } from "../utils/sendEmail.js"
import { logger } from "../utils/logger.js"

class ApiCarritos {

    constructor() { // seteo contenedor de productos según Factory
        this.contenedorProductos = FactoryProductosDAO.get(TIPO_PERSISTENCIA)
        this.contenedorCarritos = FactoryCarritosDAO.get(TIPO_PERSISTENCIA)
    }

    getCartIdByUserEmail = async (email) => await this.contenedorCarritos.getCartIdByUserEmail(email)

    getAllCarts = async () => {

        const result = await this.contenedorCarritos.getAll()
        if (Array.isArray(result)) {
            return result
        } else {
            throw { errCode: 0, errDescription: 'No se pudo obtener listado de Carritos' }
        }
    }

    getProductsByCartId = async (cartId) => {

        const carrito = await this.contenedorCarritos.getById(cartId)
        if (carrito && carrito.productos) {
            return carrito.productos
        } else {
            throw { errCode: -8, errDescription: `Carrito con id ${cartId} NO encontrado` }
        }
    }

    createCart = async (email) => {

        const result = await this.contenedorCarritos.postCarrito(email)
        if (result) {
            return result
        } else {
            throw { errCode: -7, errDescription: 'No se pudo crear el carrito' }
        }
    }

    addProductToCart = async (cartId, idProd, qty) => {

        const carrito = await this.contenedorCarritos.getById(cartId)

        if (carrito && carrito.productos) { //Valido que exista carrito con el id recibido

            if (await this.contenedorProductos.actualizarStock(idProd, - qty)) { //Valido que se pueda actualizar el stock del maestro de productos según la qty recibida

                const index = carrito.productos.findIndex(p => p.id == idProd)
                if (index >= 0) {
                    //Si ya existe el producto en el carrito le sumo la qty deseada
                    carrito.productos[index].stock += qty

                } else { //Sino lo agrego como nuevo elemento
                    const prod = await this.contenedorProductos.getById(idProd)
                    //Me traigo el producto completo del maestro pero obviamente lo que guardo en el carrito como stock es la qty solicitada por el cliente (y no el stock disponible total)
                    prod.stock = qty
                    carrito.productos.push(prod)
                }
                await this.contenedorCarritos.editById(cartId, carrito) //Sobreescribo el carrito editado
                return { ok: `${qty} unidades del producto con id ${idProd} agregadas al carrito con id ${cartId}` }

            } else {
                throw { errCode: -9, errDescription: `No puede actualizarse el stock del producto con id ${idProd}. Carrito sigue igual` }
            }
        } else {
            throw { errCode: -8, errDescription: `Carrito con id ${cartId} NO encontrado` }
        }
    }

    cartCheckoutById = async (cartId, user) => {

        const result = await this.contenedorCarritos.checkout(cartId)

        if (result && user) {

            // Envío mails relacionados con el checkout:

            const notifText = 'Pedido finalizado! Gracias!\n' + JSON.stringify(result, null, 2)

            // En realidad habría que armar bien los cuerpos de los mails y de los mensajes de WhatsApp, por cuestiones de tiempo lo dejo así...

            const mailOptions = {
                from: '"ESDP Store!" <store@esdp.com>', // sender address
                to: user.email,
                bcc: MAIL_ADMIN, //con copia oculta
                subject: `Nuevo pedido de ${user.name} <${user.email}>`, // Subject line
                text: notifText, // plain text body
                // html: '<h1 style="color:green">Contenido desde <span style="color:blue">Node</span></h1>', // html body
            }

            sendEmail(mailOptions).then(resp => logger.info(resp))

            const response = await this.contenedorCarritos.postCarrito(user.email)
            if (response) {
                return user
            } else {
                throw { errCode: -32, errDescription: `No se pudo crear nuevo carrito al checkout` }
            }
        } else {
            throw { errCode: -31, errDescription: `No se pudo hacer el checkout del Carrito con id ${cartId}` }
        }
    }

    deleteCartById = async (id) => {

        const carrito = await this.contenedorCarritos.getById(id)
        if (carrito && carrito.productos) { //Valido que exista carrito con el id recibido

            for (const p of carrito.productos) {
                //Por cada producto dentro del array del carrito lo que hago es devolver el stock
                await this.contenedorProductos.actualizarStock(p.id, p.stock)
            }
            await this.contenedorCarritos.deleteById(id)
            return { ok: `Eliminado carrito con id ${id}` }

        } else {
            throw { errCode: -8, errDescription: `Carrito con id ${id} NO encontrado` }
        }
    }

    deleteProductFromCartById = async (id, id_prod) => {

        const carrito = await this.contenedorCarritos.getById(id)
        if (carrito && carrito.productos) { //Valido que exista carrito con el id recibido

            const index = carrito.productos.findIndex(p => p.id == id_prod)
            if (index >= 0) {
                //Si existe el producto dentro del carrito lo primero que hago es devolver su stock y después lo elimino
                await this.contenedorProductos.actualizarStock(id_prod, carrito.productos[index].stock)

                carrito.productos.splice(index, 1)

                await this.contenedorCarritos.editById(id, carrito) //Sobreescribo el carrito editado

                return { ok: `Eliminado del carrito con id ${id} el producto con id ${id_prod}` }

            } else {
                throw { errCode: -11, errDescription: `Producto con id ${id_prod} NO encontrado dentro del carrito con id ${id}` }
            }
        } else {
            throw { errCode: -8, errDescription: `Carrito con id ${id} NO encontrado` }
        }
    }
}

export default ApiCarritos
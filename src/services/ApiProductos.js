import FactoryProductosDAO from '../model/DAOs/productos/FactoryProductosDAO.js'; //Importo Factory
import FactoryCarritosDAO from '../model/DAOs/carritos/FactoryCarritosDAO.js';
import { TIPO_PERSISTENCIA } from '../config/config.js' //Importo variables de entorno
import { logger } from '../utils/logger.js'

class ApiProductos {

    constructor() { // seteo contenedor de productos según Factory
        this.contenedorProductos = FactoryProductosDAO.get(TIPO_PERSISTENCIA)
        this.contenedorCarritos = FactoryCarritosDAO.get(TIPO_PERSISTENCIA)
    }

    getAllProducts = async () => {

        const result = await this.contenedorProductos.getAll()
        if (Array.isArray(result)) {
            return result
        } else {
            throw { errCode: 0, errDescription: 'No se pudo obtener listado de Productos' }
        }
    }

    getProductById = async (id) => {

        const prod = await this.contenedorProductos.getById(id)
        if (prod) {
            return prod
        } else {
            throw { errCode: -3, errDescription: `Producto con id ${id} NO encontrado` }
        }
    }

    createProduct = async (prod) => {

        const newId = await this.contenedorProductos.save(prod)
        if (newId) {
            return await this.contenedorProductos.getById(newId)
        } else {
            throw { errCode: -4, errDescription: 'Ocurrió un problema al intentar crear el producto' }
        }
    }

    editProductById = async (id, prod) => {

        if (await this.contenedorProductos.editById(id, prod)) {
            return await this.contenedorProductos.getById(id)
        } else {
            throw { errCode: -6, errDescription: `No se pudo editar producto con id ${id}` }
        }
    }

    deleteProductById = async (id) => {

        const count = await ApiProductos.existeProductoEnCarrito(id)
        //Valido antes de eliminar que ese producto no esté involucrado en algún carrito
        if (count == 0) {
            if (await this.contenedorProductos.deleteById(id)) {
                return { id: id }
            } else {
                throw { errCode: -6, errDescription: `No se pudo eliminar producto con id ${id}` }
            }
        } else {
            throw { errCode: -20, errDescription: `No se ha eliminado el producto con id ${id} porque aparece ${count} veces en el listado de Carritos. Primero eliminarlo de cada carrito` }
        }
    }

    static async existeProductoEnCarrito(idProd) {
        //Esta función sirve para detectar si cierto producto existe o no en algún carrito.
        let count = 0
        try {
            let arrayCarr = await this.contenedorCarritos.getAll()
            for (const carr of arrayCarr) {
                count += carr.productos.reduce((n, p) => n + (p.id == idProd), 0); //este método es muy interesante
            }
        } catch (error) {
            logger.error(error);
        } finally {
            return count //devuelve la qty de ocurrencias
        }
    }

    //Function para validar si un objeto es un Producto válido
    isProducto(obj) {
        if (obj &&
            obj.nombre && typeof (obj.nombre) == 'string' &&
            obj.descripcion && typeof (obj.descripcion) == 'string' &&
            obj.codigo && typeof (obj.codigo) == 'string' &&
            obj.thumbnail && typeof (obj.thumbnail) == 'string' &&
            obj.precio && typeof (obj.precio) == 'number' &&
            obj.stock && typeof (obj.stock) == 'number' &&
            Object.keys(obj).length == 6) {
            return true
        } else {
            return false
        }
    }
}

export default ApiProductos
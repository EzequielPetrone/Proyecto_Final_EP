import { Router, json, urlencoded } from "express"; //Importo express para luego configurar el Router

import ControladorCarritos from '../controllers/ControladorCarritos.js' //importo controller

import { isAuth } from '../middlewares/auth.js'

class RouterCarritos {

    constructor() {
        this.controladorCarritos = new ControladorCarritos()
    }

    start() {
        const router = Router()

        //Configuro para poder leer sin problemas los req.body
        router.use(json())
        router.use(urlencoded({ extended: true }))

        // El middleware isAuth controla que el request venga de una fuente Autenticada, sino devuelve 401.

        router.get("/", isAuth, this.controladorCarritos.getAllCarts) //GET '/api/carrito' -> devuelve array con todos los carritos registrados.

        router.get("/:id/productos", isAuth, this.controladorCarritos.getProductsByCartId) //GET '/api/carrito/:id/productos' -> devuelve productos de un carrito según su id.

        router.post("/", isAuth, this.controladorCarritos.createCart) //POST '/api/carrito' -> crea un carrito, y lo devuelve con su id asignado.

        router.post("/:id/productos", isAuth, this.controladorCarritos.addProductToCart) //POST '/api/carrito/:id/productos' -> Incorpora producto a carrito según su id.

        router.post("/:id/checkout", isAuth, this.controladorCarritos.cartCheckoutById) //POST '/api/carrito/:id/checkout' -> CHECKOUT!

        router.delete("/:id", isAuth, this.controladorCarritos.deleteCartById) //DELETE '/api/carrito/:id' -> elimina un carrito según su id (pero antes devuelve stock de productos)

        router.delete("/:id/productos/:id_prod", isAuth, this.controladorCarritos.deleteProductFromCartById) //DELETE '/api/carrito/:id/productos/:id_prod' -> elimina un producto de un carrito según sus ids (pero antes devuelve stock de productos)

        return router
    }
}

export default RouterCarritos
import { Router, json, urlencoded } from "express"; //Importo express para luego configurar el Router

import ControladorProductos from '../controllers/ControladorProductos.js' //importo controller

import { isAuth } from '../middlewares/auth.js'

class RouterProductos {

    constructor() {
        this.controladorProductos = new ControladorProductos()
    }

    start() {
        const routerProductos = Router()

        //Configuro para poder leer sin problemas los req.body
        routerProductos.use(json())
        routerProductos.use(urlencoded({ extended: true }))

        // El middleware isAuth controla que el request venga de una fuente Autenticada, sino devuelve 401.
        
        routerProductos.get("/", isAuth, this.controladorProductos.getAllProducts) //GET '/api/productos' -> devuelve todos los productos.

        routerProductos.get("/:id", isAuth, this.controladorProductos.getProductById) //GET '/api/productos/:id' -> devuelve un producto según su id.

        routerProductos.post("/", isAuth, this.controladorProductos.createProduct) //POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.

        routerProductos.put("/:id", isAuth, this.controladorProductos.editProductById) //PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.

        routerProductos.delete("/:id", isAuth, this.controladorProductos.deleteProductById) //DELETE '/api/productos/:id' -> elimina un producto según su id.

        return routerProductos
    }
}

export default RouterProductos
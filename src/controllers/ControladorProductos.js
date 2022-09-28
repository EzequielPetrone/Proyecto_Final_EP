import ApiProductos from '../services/ApiProductos.js'

class ControladorProductos {

    constructor() {
        this.apiProductos = new ApiProductos()
    }

    getAllProducts = async (req, res) => {
        try {
            res.json(await this.apiProductos.getAllProducts())

        } catch (error) {
            res.status(500).json(error);
        }
    }

    getProductById = async (req, res) => {

        const id = req.params.id
        try {
            res.json(await this.apiProductos.getProductById(id))

        } catch (error) {
            res.status(500).json(error);
        }
    }

    createProduct = async (req, res) => {

        const newProd = req.body
        //Primero valido que lo recibido en el body del request sea un producto bien formado
        if (this.apiProductos.isProducto(newProd)) {
            try {
                res.json(await this.apiProductos.createProduct(newProd))

            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(400).json({ errCode: -5, errDescription: 'Bad Product Body. Estructura esperada: {nombre, descripcion, codigo, thumbnail, precio, stock}' })
        }
    }

    editProductById = async (req, res) => {

        const id = req.params.id
        const newProd = req.body
        //Primero valido que lo recibido en el body del request sea un producto bien formado
        if (this.apiProductos.isProducto(newProd)) {
            try {
                res.json(await this.apiProductos.editProductById(id, newProd))

            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(400).json({ errCode: -5, errDescription: 'Bad Product Body. Estructura esperada: {nombre, descripcion, codigo, thumbnail, precio, stock}' })
        }
    }

    deleteProductById = async (req, res) => {

        const id = req.params.id
        try {
            res.json(await this.apiProductos.deleteProductById(id))

        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default ControladorProductos
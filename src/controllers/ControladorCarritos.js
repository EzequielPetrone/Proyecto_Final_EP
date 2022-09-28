import ApiCarritos from '../services/ApiCarritos.js'

class ControladorCarritos {

    constructor() {
        this.apiCarritos = new ApiCarritos()
    }


    getAllCarts = async (req, res) => {
        try {
            res.json(await this.apiCarritos.getAllCarts())

        } catch (error) {
            res.status(500).json(error);
        }
    }

    getProductsByCartId = async (req, res) => {
        const cartId = req.params.id == 'auth' ? await this.apiCarritos.getCartIdByUserEmail(req.user.email) : req.params.id
        try {
            res.json(await this.apiCarritos.getProductsByCartId(cartId))

        } catch (error) {
            res.status(500).json(error)
        }
    }

    createCart = async (req, res) => {
        const email = req.user.email
        try {
            res.json(await this.apiCarritos.createCart(email))

        } catch (error) {
            res.status(500).json(error);
        }
    }

    addProductToCart = async (req, res) => {

        const cartId = req.params.id == 'auth' ? await this.apiCarritos.getCartIdByUserEmail(req.user.email) : req.params.id
        //En mi diseño el body que se recibe del Front es un objeto con la siguiente estructura: {idProd, qty}
        //es decir, el id del producto en el contenedor de productos y la cantidad a agregar en el carrito
        const { idProd, qty } = req.body
        if (idProd && qty > 0) { //Primero valido el body del request recibido
            try {
                res.json(await this.apiCarritos.addProductToCart(cartId, idProd, qty))

            } catch (error) {
                res.status(500).json(error)
            }
        } else {
            res.status(400).json({ errCode: -10, errDescription: `Bad Request Body. Estructura esperada: {idProd, qty}` })
        }
    }

    cartCheckoutById = async (req, res) => {

        const cartId = req.params.id == 'auth' ? await this.apiCarritos.getCartIdByUserEmail(req.user.email) : req.params.id
        const user = req.user
        try {
            res.json(await this.apiCarritos.cartCheckoutById(cartId, user))

        } catch (error) {
            res.status(500).json(error);
        }
    }

    deleteCartById = async (req, res) => {

        const cartId = req.params.id == 'auth' ? await this.apiCarritos.getCartIdByUserEmail(req.user.email) : req.params.id
        try {
            res.json(await this.apiCarritos.deleteCartById(cartId))

        } catch (error) {
            res.status(500).json(error);
        }
    }

    deleteProductFromCartById = async (req, res) => {

        const cartId = req.params.id == 'auth' ? await this.apiCarritos.getCartIdByUserEmail(req.user.email) : req.params.id
        const id_prod = req.params.id_prod
        try {
            res.json(await this.apiCarritos.deleteProductFromCartById(cartId, id_prod))

        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default ControladorCarritos
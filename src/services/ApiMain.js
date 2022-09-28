import FactoryCarritosDAO from '../model/DAOs/carritos/FactoryCarritosDAO.js'; //Importo Factory
import { TIPO_PERSISTENCIA, MAIL_ADMIN } from '../config/config.js' //Importo variables de entorno
import { sendEmail } from "../utils/sendEmail.js"
import { logger } from "../utils/logger.js"

class ApiMain {

    constructor() { // seteo contenedor de productos según Factory
        this.contenedorCarritos = FactoryCarritosDAO.get(TIPO_PERSISTENCIA)
    }

    postLogin = async (user) => {

        const result = await this.contenedorCarritos.postCarrito(user.email)
        if (result) {
            return result
        } else {
            throw { errCode: -50, errDescription: 'Problema al crear carrito al momento del signup / login' }
        }
    }

    postSignup = async (user) => {

        // Envío mail al ADMIN con los datos del nuevo user:

        const mailOptions = {
            from: '"ESDP Store!" <store@esdp.com>', // sender address
            to: MAIL_ADMIN,
            subject: "Nuevo Registro!", // Subject line
            text: JSON.stringify(user, null, 2), // plain text body
            // html: '<h1 style="color:green">Contenido desde <span style="color:blue">Node</span> Eze lalita</h1>', // html body
        }

        sendEmail(mailOptions).then(resp => logger.info(resp))

        // Creo un carrito asociado al nuevo user:
        const result = await this.contenedorCarritos.postCarrito(user.email)
        if (result) {
            return result
        } else {
            throw { errCode: -50, errDescription: 'Problema al crear carrito al momento del signup / login' }
        }
    }
}

export default ApiMain
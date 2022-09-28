import { logger } from '../utils/logger.js'

/*
const infoLogger = (req, res, next) => { //Creo middleware a utilizar en las rutas exitosas para loguear info
    logger.info(`Successful Request ${req.method} a la ruta: ${req.originalUrl}`)
    next()
}
*/

const warnLogger = (req, res, next) => { //Creo middleware a utilizar en rutas no implementadas para loguear warn
    logger.warn(`Fail Request ${req.method} a la ruta: ${req.originalUrl} (No implementada)`)
    next()
}

export { warnLogger }
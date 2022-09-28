// Importo de Node 'fs' para gestión del FileSystem y 'path' para tratamiento de rutas
import { existsSync, mkdirSync, writeFileSync, readFileSync, promises } from "fs";
import { dirname } from 'path';

import { logger } from '../../utils/logger.js'

class ContenedorFile {

    constructor(archivo) {

        this.archivo = archivo
        this.lastId = 0 // En este atributo guardo el id del último objeto del Contenedor

        // Dado que el constructor de una clase no puede ser async, 
        // utilizo los métodos sincrónicos de fs para que las validaciones y lectura del mayor id sean bloqueantes
        // En todos los métodos de la clase Contenedor uso fs.promises

        if (!existsSync(archivo)) { // Valido si existe el archivo para evaluar si lo creo o no.

            const dir = dirname(archivo)
            if (!existsSync(dir)) {
                // Valido si existe la ruta del archivo, y sino la creo!
                // sino luego me falla la creación del archivo...
                try {
                    mkdirSync(dir)

                } catch (error) {
                    logger.error(`Error al crear carpeta: ${dir}`)
                }
            }
            try {
                writeFileSync(archivo, JSON.stringify([]))
                logger.info(`Archivo ${archivo} creado de cero`)

            } catch (error) {
                logger.error('Error al querer crear archivo de cero')
            }
        }

        // En esta instancia del código el archivo en cuestión ya existe
        // ya sea desde antes de ejecutar este Constructor o porque yo lo cree líneas arriba inicializandolo con un array vacío
        try {
            const contenidoFile = JSON.parse(readFileSync(archivo, 'utf-8'))
            for (const obj of contenidoFile) {
                if (parseInt(obj.id) > this.lastId) {
                    this.lastId = parseInt(obj.id)
                }
            }
            //console.log('Objeto Contenedor creado en base al archivo:', archivo)

        } catch (error) {
            logger.error(`El formato del contenido del archivo ${archivo} es incompatible con esta aplicación. No puede obtenerse un Array de su parseo.`)
        }
    }

    async getAll() { //return Object[] - Devuelve un array con los objetos presentes en el archivo.
        try {
            return JSON.parse(await promises.readFile(this.archivo, 'utf-8'))

        } catch (error) {
            logger.error(`Error al querer leer el contenido del archivo: ${this.archivo}`)
            return null
        }
    }

    async save(obj) { //return Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.

        let objeto = Array.isArray(obj) ? obj[0] : obj
        // Valido que el parámetro sea un objeto
        if (objeto && Object.prototype.toString.call(objeto) === '[object Object]' && Object.keys(objeto).length > 0) {
            try {
                // Me traigo el array contenido del file y le hago un push del nuevo objeto
                // No uso el método appendFile (lo que me evitaría tener que leer todo)
                // porque sino me agregaría el objeto fuera del array...
                const contenidoFile = await this.getAll()

                const newObj = {
                    id: (this.lastId + 1).toString(),
                    timeStamp: Date.now(),
                    ...objeto
                } // Agrego al nuevo objeto id y timeStamp
                contenidoFile.push(newObj)

                await promises.writeFile(this.archivo, JSON.stringify(contenidoFile, null, 2))

                this.lastId++ // Incremento post escritura por las dudas de que falle
                return this.lastId.toString()

            } catch (error) {
                logger.error(`Error al querer procesar el contenido del archivo: ${this.archivo}`)
                return null
            }
        } else {
            logger.error('El parámetro recibido por el método save no es un objeto');
            return null // Retorno null cuando no hay objeto para agregar al array del archivo
        }
    }

    async getById(id) { //return Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            const contenidoFile = await this.getAll()
            return contenidoFile.find(obj => obj.id == id) || null

        } catch (error) {
            logger.error(`Error al obtener objeto con id ${id}`)
            return null
        }
    }

    async deleteById(id) { //: void - Elimina del archivo el objeto con el id buscado.
        try {
            const contenidoFile = await this.getAll()
            const newContenido = contenidoFile.filter(obj => obj.id != id)

            if (contenidoFile.length > newContenido.length) { // Valido para no sobre-escribir file si no vale la pena

                await promises.writeFile(this.archivo, JSON.stringify(newContenido, null, 2))
                //console.log(`Eliminado del file objeto con id: ${number}`);
                return true

            } else {
                //console.log(`No hay objeto con id: ${number} para eliminar. Contenido del file sigue igual`);
                return false
            }
        } catch (error) {
            logger.error(`Error al eliminar objeto con id ${id}`)
            return null
        }
    }

    /*
    async deleteAll() { //: void - Elimina todos los objetos presentes en el archivo.
        try {
            const list = JSON.parse(await promises.readFile(this.archivo, 'utf-8'))
            await promises.writeFile(this.archivo, JSON.stringify([]))
            return list.length

        } catch (error) {
            console.log('error al eliminar todo')
            return null
        }
    }
    */

    async editById(id, obj) {

        if (await this.getById(id)) {

            let objeto = Array.isArray(obj) ? obj[0] : obj
            // Valido que el parámetro sea un objeto
            if (objeto && Object.prototype.toString.call(objeto) === '[object Object]') {
                try {
                    const contenidoFile = await this.getAll()

                    const newCF = contenidoFile.map(x => {
                        if (x.id == id) {
                            Object.assign(x, objeto) //este método es mágico 
                            x.id = id
                        }
                        return x
                    })
                    await promises.writeFile(this.archivo, JSON.stringify(newCF, null, 2))
                    return true

                } catch (error) {
                    logger.error(`Error al querer procesar el contenido del archivo: ${this.archivo}`)
                    return null
                }
            } else {
                logger.error('El parámetro no es un objeto');
                return false
            }
        } else {
            logger.error(`No existe objeto con id: ${id}`);
            return false
        }
    }
}

export default ContenedorFile
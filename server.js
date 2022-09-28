// ESTE CÓDIGO ES PARA CORRERLO CON NODE/NODEMON YA QUE EN CASO QUE EL MODE LO AMERITE EL CLUSTERING ES MANUAL (con FOREVER también puede aplicar)
//Importo dependencias varias. 
import express from 'express';
import handlebars from 'express-handlebars';
import cluster from 'cluster';
import { createServer } from "http"
import { Server } from "socket.io"

import { appErrorHandler } from './src/middlewares/appErrorHandler.js' // importo error Handler para la Express App
import { warnLogger } from './src/middlewares/logging.js' // importo middleware para logueo de warns
import { routingError } from './src/controllers/routingError.js' //importo function específica para manejar rutas no parametrizadas
import { logger } from './src/utils/logger.js' //Importo logger que configuré
import { PORT, MODE, NUMCPUS } from './src/config/config.js' //Importo variables de config
import { passport } from './src/auth/passportConfig.js' //Importo mi passport ya configurado
import { sessionConfig } from './src/auth/sessionConfig.js' //Importo mi express-session ya seteado

//Importo clases Routers
import RouterProductos from './src/routes/RouterProductos.js';
import RouterCarritos from './src/routes/RouterCarritos.js';
import RouterMain from './src/routes/RouterMain.js';
import RouterChat from './src/routes/RouterChat.js';

if (MODE == 'CLUSTER' && cluster.isPrimary) {
    logger.info(`PID MASTER: ${process.pid}`)

    // Cuando el modo pasado por args es CLUSTER, el process MASTER lanza los workers, 1 por cada cpu
    for (let i = 0; i < NUMCPUS; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        logger.info(`Worker ${worker.process.pid} died! ${new Date().toLocaleString()}`)
        cluster.fork() //Si un worker muere levanto otro
    })

} else { // Cuando el modo pasado por args es FORK o es un cluster worker uso el código de siempre
    try {
        const app = express(); //Seteo Express app

        app.disable('x-powered-by'); // un pequeño seteo de seguridad

        //Seteo HBS views
        app.engine(
            "hbs",
            handlebars.engine({
                extname: ".hbs",
                defaultLayout: 'index.hbs',
                layoutsDir: "./src/views/layouts",
                partialsDir: "./src/views/partials/",
                runtimeOptions: {
                    allowProtoPropertiesByDefault: true,
                    allowProtoMethodsByDefault: true,
                }
            })
        );
        app.set('view engine', 'hbs');
        app.set('views', './src/views');

        app.use(express.static("public")); //Seteo 'public' como static

        app.use(appErrorHandler) //Seteo Middleware de manejo de errores

        //Seteo session e inicializo passport
        app.use(sessionConfig)
        app.use(passport.initialize())
        app.use(passport.session())

        //Configuro server socket.io
        const httpServer = createServer(app);
        const io = new Server(httpServer);

        //Instancio y Seteo Routers
        const routerMain = new RouterMain()
        const routerProductos = new RouterProductos()
        const routerCarritos = new RouterCarritos()
        const routerChat = new RouterChat()

        app.use('/', routerMain.start())
        app.use('/api/productos', routerProductos.start())
        app.use('/api/carrito', routerCarritos.start())

        app.use('/chat', routerChat.start(io)) // Particularmente a este Router le paso el server socket.io levantado para que las capas correspondientes hagan lo suyo

        app.use('*', warnLogger, routingError); //Gestiono rutas no parametrizadas

        //Pongo a escuchar al server
        const server = httpServer.listen(PORT, err => {
            if (!err) {
                logger.info(`Server running at PORT: ${server.address().port} (PID:${process.pid})`)
            }
        })

        //Server Error handling
        server.on("error", error => logger.error('Error en el servidor: ' + error))

    } catch (error) {
        logger.error('Error en el hilo principal: ' + error)
    }
}
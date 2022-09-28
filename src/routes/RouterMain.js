import { Router, json, urlencoded } from "express";

import ControladorMain from '../controllers/ControladorMain.js' //importo controller

import { passport } from '../auth/passportConfig.js'; //Importo mi passport ya configurado

class RouterMain {

    constructor() {
        this.controladorMain = new ControladorMain()
    }

    start() {
        const router = Router()

        //Configuro para poder leer sin problemas los req.body
        router.use(json())
        router.use(urlencoded({ extended: true }))

        router.get("/", this.controladorMain.getIndex)

        router.get("/login", this.controladorMain.getLogin)

        router.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin' }), this.controladorMain.postLogin)

        router.get('/faillogin', this.controladorMain.getFailLogin)

        router.get('/signup', this.controladorMain.getSignup)

        router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), this.controladorMain.postSignup)

        router.get('/failsignup', this.controladorMain.getFailSignup)

        router.get('/logout', this.controladorMain.getLogout)

        router.get('/maestroproductos', this.controladorMain.getMaestroProductos)

        router.get('/cart', this.controladorMain.getCart)

        router.get('/useraccount', this.controladorMain.getUserView)

        router.get('/checkAuth', this.controladorMain.getAuth)

        return router
    }
}

export default RouterMain
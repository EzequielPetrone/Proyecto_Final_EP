import { Router } from "express";

import ControladorChat from '../controllers/ControladorChat.js' //importo controller

class RouterChat {

    constructor() {
        this.controladorChat = new ControladorChat()
    }

    start(io) {
        const router = Router()

        this.controladorChat.chatHandler(io)

        router.get("/", this.controladorChat.getChat)

        return router
    }
}

export default RouterChat
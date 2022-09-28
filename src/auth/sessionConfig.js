import session from 'express-session'

import { EXP_TIME, PASSPORT_SESSION_SECRET } from '../config/config.js' //Importo variables de config

const sessionConfig = session({
    secret: PASSPORT_SESSION_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: EXP_TIME
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
})

export { sessionConfig }
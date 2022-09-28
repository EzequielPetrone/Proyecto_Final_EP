//Importo passport-local Strategy
import passportLocal from 'passport-local'
const LocalStrategy = passportLocal.Strategy; 

import UserModel from '../model/models/usuarios.js' //Importo el modelo de ususarios mongo

import { validatePass, createHash } from '../utils/password.js'; //Importo funciones útiles basadas en bcrypt

const loginStrategy = new LocalStrategy({ usernameField: 'email' },
    (email, password, callback) => {

        UserModel.findOne({ email: email }, (err, user) => {
            if (err) {
                console.log('Hay un error al loguearse');
                return callback(err)
            }

            if (!user) {
                // console.log('No se encontro usuario');
                return callback(null, false, { msg: 'No se encontro usuario' })
            }

            if (!validatePass(user, password)) {
                // console.log('Invalid Password');
                return callback(null, false, { msg: 'Invalid Password' })
            }

            return callback(null, user)
        })
    }
)

const signupStrategy = new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
    (req, email, password, callback) => {

        UserModel.findOne({ email: email }, (err, user) => {
            if (err) {
                console.log('Hay un error al registrarse');
                return callback(err)
            }

            if (user) {
                // console.log('El usuario ya existe');
                return callback(null, false, { msg: 'El usuario ya existe' })
            }

            const newUser = {
                email: email,
                password: createHash(password),
                name: req.body.name,
                direccion:  req.body.direccion,
                nacimiento: req.body.nacimiento,
                phone: req.body.phone,
                avatar: req.body.avatar
            }

            UserModel.create(newUser, (err, userWithId) => {
                if (err) {
                    // console.log('Hay un error al registrarse');
                    return callback(err)
                }

                // console.log('Registro de usuario satisfactoria');
                return callback(null, userWithId)
            })
        })
    }
)

const serializeUser = (user, callback) => callback(null, user._id)

const deserializeUser = (id, callback) => UserModel.findById(id, callback)

export { loginStrategy, signupStrategy, serializeUser, deserializeUser }
import passport from 'passport'

import { loginStrategy, signupStrategy, serializeUser, deserializeUser } from '../services/passportServices.js'

passport.use('login', loginStrategy)

passport.use('signup', signupStrategy)

passport.serializeUser(serializeUser)

passport.deserializeUser(deserializeUser)

export { passport }
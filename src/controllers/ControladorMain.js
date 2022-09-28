import ApiMain from '../services/ApiMain.js'

class ControladorMain {

    constructor() {
        this.apiMain = new ApiMain()
    }

    getIndex = (req, res) => {

        if (req.isAuthenticated()) {
            res.render('main', { username: req.user.name })
        } else {
            res.redirect('/login');
        }
    }

    // LOGIN
    getLogin = (req, res) => {

        if (req.isAuthenticated()) {
            res.redirect('/')
        } else {
            res.render('login');
        }
    }

    postLogin = async (req, res) => {
        try {
            await this.apiMain.postLogin(req.user)
            res.redirect('/')
            
        } catch (error) {
            res.status(500).json(error);
        }
    }

    getFailLogin = (req, res) => res.render('login-error', {})

    //  SIGNUP
    getSignup = (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect('/')
        } else {
            res.render('signup');
        }
    };

    postSignup = async (req, res) => {
        try {
            await this.apiMain.postSignup(req.user)
            res.redirect('/')

        } catch (error) {
            res.status(500).json(error);
        }
    }

    getFailSignup = (req, res) => res.render('signup-error', {})

    //  LOGOUT
    getLogout = (req, res) => {

        let usuario = ''
        if (req.isAuthenticated()) {
            usuario = req.user.name
        }
        req.logout((err) => {
            if (!err) {
                res.render('logout', { username: usuario });
            } else {
                res.redirect('/');
            }
        })
    };

    getMaestroProductos = (req, res) => res.render('maestroProductosTemp')

    //  Vista Carrito
    getCart = (req, res) => {
        
        if (req.isAuthenticated()) {
            res.render('cart', { username: req.user.name });
        } else {
            res.redirect('/login');
        }
    }

    //  User Account View
    getUserView = (req, res) => {

        if (req.isAuthenticated()) {

            const usuario = {
                nombre: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar,
                fechaNacimiento: req.user.nacimiento.toISOString().split("T")[0],
                direccion: req.user.direccion,
                telefono: req.user.phone
            }
            res.render('useraccount', usuario);

        } else {
            res.redirect('/login');
        }
    }

    // check if logged
    getAuth = (req, res) => res.json({ auth: req.isAuthenticated() })

}

export default ControladorMain
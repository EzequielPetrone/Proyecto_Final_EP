import ApiChat from '../services/ApiChat.js'

class ControladorChat {

    constructor() {
        this.apiChat = new ApiChat()
    }
    
    chatHandler = (io) => this.apiChat.chatHandler(io)

    getChat = (req, res) => {

        if (req.isAuthenticated()) {

            const usuario = {
                nombre: req.user.name,
                email: req.user.email,
            }
            res.render('chat', usuario);

        } else {
            res.redirect('/login');
        }
    }
}

export default ControladorChat
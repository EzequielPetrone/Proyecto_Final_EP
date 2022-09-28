document.addEventListener("DOMContentLoaded", async () => {

    //Constante que seteo tanto del lado del server como del cliente ya que deben coincidir.
    const CHATMSG = 'chat_msg'

    const template = Handlebars.compile(await (await fetch('../views/chatMsg.hbs')).text());

    //Referencio elementos html de la sección de chat
    const chatForm = document.querySelector('#chatForm')
    const inputEmail = document.querySelector('#chatEmail')
    const inputNombre = document.querySelector('#chatNombre')
    const inputMsj = document.querySelector('#chatMsj')
    const chatList = document.querySelector('#chatList')
    const serverAlert = document.querySelector('#serverAlert')

    //Me conecto
    const socket = io();

    socket.on('connect', async () => {

        serverAlert.style.display = 'none'

        //Tratamiento del submit de un nuevo mensaje del chat al server:
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const check = await (await fetch('/checkAuth')).json()
            if (check.auth) {

                const mensaje = {
                    email: inputEmail.value,
                    name: inputNombre.value,
                    textoMensaje: inputMsj.value
                }

                socket.emit(CHATMSG, mensaje);
                inputMsj.value = null

            } else {
                alert('Su sesión ha expirado!')
                location.reload();
            }
        });

        //Recibo comunicación del socket informando nuevo msj de chat. Lo agrego al cuadro de chat.
        socket.on(CHATMSG, (data) => { //esta data viene normalizada desde el server

            const msgs = data.map(m => { //formateo el timeStamp
                m.timeStamp = (new Date(m.timeStamp)).toLocaleString()
                return m
            })

            chatList.innerHTML = template({ msgs: msgs })

            chatList.parentElement.scroll(0, chatList.parentElement.scrollHeight) //El div que contiene el chat se va auto-scrolleando
        });
    })

    //En caso que el server se caiga...
    socket.on('disconnect', () => {
        //Lanzo alerta (que cuando se reconecta desaparece obviamente)
        serverAlert.style.display = null
    })
})
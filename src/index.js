import express from 'express';
import {engine} from 'express-handlebars'
import {__dirname} from './path.js'
import * as path from 'path'
import viewsRouter from './routes/views.routes.js'
import { Server } from 'socket.io';

// Config server express
const app = express();
const PORT = 8080

// httpServer
const httpServer = app.listen(PORT, () => console.log(`Listening on ${PORT}`))


// Configuracion del HBS
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes
app.use('/', viewsRouter)
app.use(express.static(path.resolve(__dirname, './public'))) // static files



// Socket server
const io = new Server(httpServer)
let messages = []
let clients = []
io.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    
    socket.on('authOk', data => { // cuando el usuario se autentico correctamente 
        io.emit('messageLogs', messages) // le manda los mensajes del chat

        let text = `${data.user} se ha conectado`
        socket.broadcast.emit('newConnection', text) // avisa al resto que se conecto

        clients.push(data)
        io.emit('onlineConnections', clients)
    })
    
    socket.on('message', data => { // cuando escucha un nuevo mensaje
        messages.push(data) // guarda lo que se envio en el mensaje en el array messages
        io.emit('messageLogs', messages) // emite un messageLogs con el array messages
    })
})
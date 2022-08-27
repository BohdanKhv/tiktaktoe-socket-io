const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io')
const port = process.env.PORT || 5000;


const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})


// When user connecter to the server
io.on('connection', (socket) => {
    console.log('User Connected', socket.id);

    socket.on('join', (data) => {
        socket.join(data)
        
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on('click', (data) => {
        console.log(data)
        socket.to(data.room).emit('receive_click', data)
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id)
    })
}) 

// Serve frontend
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => res.send('Please set to production'))
}

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
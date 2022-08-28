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

    socket.on('join_room', (data) => {
        socket.join(data);

        const arr = Array.from(io.sockets.adapter.rooms);
        const filtered = arr.filter((room) => !room[1].has(room[0]))[0];

        if(filtered) {
            let player = '';

            if(filtered[1].size === 1)
                player = 'X';
            else if (filtered[1].size === 2)
                player = 'O';

            socket.emit('joined_room', { playersCount: filtered[1].size, player: player });
            socket.to(data).emit('user_joined_room', { playersCount: filtered[1].size });

            console.log(`User with ID: ${socket.id}, joined room: ${data}, as player: ${player}, players count: ${filtered[1].size}`);
        }
    })

    socket.on('exit_room', (data) => {
        socket.leave(data)
        const arr = Array.from(io.sockets.adapter.rooms);
        const filtered = arr.filter((room) => !room[1].has(room[0]))[0];

        
        if(filtered) {
            // Get players count from set in filtered array
            socket.in(data).emit('exited_room', { playersCount: filtered[1].size });
        }
        console.log(`User with ID: ${socket.id} left room: ${data}`)
    });

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
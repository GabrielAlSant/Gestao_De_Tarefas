const { Server } = require('socket.io');
let io;

function init(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Usuário conectado ao quarto: ${roomId}`);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io não foi inicializado.');
    }
    return io;
}

module.exports = { init, getIO };

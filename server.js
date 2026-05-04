const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Variável de estado do alerta no servidor [cite: 33]
let alertaStatus = "Inativo"; 

// Serve os arquivos da pasta 'public' [cite: 66]
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Novo nó conectado à rede de sensores.');

    // Envia o estado atual para o novo cliente [cite: 32]
    socket.emit('propagar_alerta', alertaStatus);

    // Escuta a mudança de estado vinda de um sensor (botão) [cite: 32]
    socket.on('mudar_status', (novoEstado) => {
        alertaStatus = novoEstado;
        console.log(`Propagando alerta: ${alertaStatus}`);
        
        // PROPAGAÇÃO: Envia para TODOS os usuários conectados [cite: 31, 32]
        io.emit('propagar_alerta', alertaStatus);
    });
});

// Porta 80 para comunicação externa via Azure [cite: 13, 73]
const PORT = process.env.PORT || 80;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor do Igor rodando na porta ${PORT}`);
});
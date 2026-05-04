const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Variável de estado do alerta no servidor
let alertaStatus = "Inativo"; 

// Serve os arquivos da pasta 'public' 
app.use(express.static(path.join(__dirname, 'public')));

// Gerenciador de Eventos: Monitora quando um novo nó entra na rede
io.on('connection', (socket) => {
    console.log('Novo nó conectado à rede de sensores.');

    // Sincronização Inicial: Assim que alguém conecta, recebe o estado atual
    socket.emit('propagar_alerta', alertaStatus);

    // Escuta a mudança de estado vinda de um sensor (botão)
    socket.on('mudar_status', (novoEstado) => {
        alertaStatus = novoEstado;
        console.log(`Propagando alerta: ${alertaStatus}`);
        
        // PROPAGAÇÃO (Broadcast): Envia a atualização para TODOS os nós conectados
        // Isso garante que todos os monitores vejam a mesma informação ao mesmo tempo.
        io.emit('propagar_alerta', alertaStatus);
    });
});

// Porta 80: Porta padrão HTTP para que o nó seja acessível via IP Público no Azure
const PORT = process.env.PORT || 80;
server.listen(PORT, '0.0.0.0', () => { // O endereço '0.0.0.0' permite que o servidor aceite conexões de qualquer IP externo
    console.log(`Servidor do Igor rodando na porta ${PORT}`);
});
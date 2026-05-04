// Inicializa a conexão com o servidor Socket.io
const socket = io({
    transports: ['websocket', 'polling'] // Melhora a estabilidade no Azure
});

// Seleção de elementos do DOM
const display = document.getElementById('display');
const btnAlerta = document.getElementById('btn-alerta');
const btnReset = document.getElementById('btn-reset');
const roleMsg = document.getElementById('role-msg');

// O código identifica se o usuário deve ter poderes de sensor via parâmetros na URL
const urlParams = new URLSearchParams(window.location.search);
const tipoParam = urlParams.get('tipo');
const ehSensor = tipoParam && tipoParam.toLowerCase().trim() === 'sensor';

// Configuração da interface baseada no papel do nó (Transparência de Acesso)
if (ehSensor) {
    // Se for sensor, exibe os botões de controle
    console.log("Nó operando como: SENSOR");
    if (roleMsg) roleMsg.innerText = "Modo: SENSOR (Controles Habilitados)";
    // Os botões permanecem visíveis para o sensor
} else { // Se for monitor, esconde os botões (apenas visualização)
    console.log("Nó operando como: MONITOR");
    const controles = document.querySelector('.controles');
    if (controles) controles.style.display = 'none';
    if (roleMsg) roleMsg.innerText = "Modo: MONITORIZAÇÃO (Apenas Visualização)";
}

// --- EVENTOS DE ENVIO (SENSOR -> SERVIDOR) ---

// Dispara o alerta de chuva
btnAlerta?.addEventListener('click', () => {
    console.log("Enviando sinal de alerta...");
    socket.emit('mudar_status', 'Ativo'); // Envia para o servidor
});

// Reseta o sistema para o estado inicial
btnReset?.addEventListener('click', () => {
    console.log("Enviando sinal de reset...");
    socket.emit('mudar_status', 'Inativo');
});

// --- EVENTOS DE RECEBIMENTO (SERVIDOR -> TODOS OS NÓS) ---

// Recebe a propagação do estado atualizada pelo servidor
socket.on('propagar_alerta', (estado) => {
    console.log("Estado atualizado recebido:", estado);
    
    if (display) {
        display.innerText = `Estado: ${estado}`;
        
        // Altera o estilo visual conforme o estado propagado
        if (estado === 'Ativo') {
            display.className = "status-box ativo";
            document.body.style.backgroundColor = "#ffd6d6"; // Fundo avermelhado para alerta
        } else {
            display.className = "status-box inativo";
            document.body.style.backgroundColor = "#f0f2f5"; // Fundo neutro
        }
    }
});

// Tratamento de erro de conexão
socket.on('connect_error', (err) => {
    console.error("Erro na conexão com o nó servidor:", err.message);
});
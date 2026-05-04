Monitoramento Meteorológico Distribuído - Equipe 5
Este projeto consiste na implementação de um nó de monitoramento em tempo real para a disciplina de Sistemas Distribuídos. O objetivo é demonstrar a comunicação entre nós e a propagação de eventos em um ambiente de nuvem.

Objetivos
Configurar um nó servidor em uma VM Azure.

Implementar comunicação bidirecional em tempo real.

Demonstrar conceitos de transparência de acesso e sincronização.

Tecnologias
Node.js

Socket.io

Express.js

Microsoft Azure (IaaS)

Funcionamento
O sistema identifica o papel do usuário através da URL:

Monitoramento (Padrão): Acesso via IP Público.

Sensor (Controle): Acesso via IP_PUBLICO/index.html?tipo=sensor.

Instalação e Execução
Instale as dependências:
npm install

Inicie o servidor:
node server.js

Status: Projeto operacional na infraestrutura Azure.

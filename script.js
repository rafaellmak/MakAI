const chatbox = document.getElementById('chatbox');
        const mensagemInput = document.getElementById('mensagem');
        const enviarButton = document.getElementById('enviar');

        async function sendMessage() {
            const userMessage = mensagemInput.value.trim();
            if (!userMessage) return;

            mensagemInput.value = '';
            appendMessage('user', userMessage);

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage })
                });
                
                const reader = response.body.getReader();
                let botMessage = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = new TextDecoder("utf-8").decode(value);
                    botMessage += chunk; // Acumula os chunks
                }

                appendMessage('bot', botMessage); // Exibe a mensagem completa

            } catch (error) {
                console.error('Erro:', error);
                appendMessage('bot', 'Desculpe, houve um erro.');
            }
        }
        
        function appendMessage(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add(sender);

            if (sender === 'bot') {
                const preElement = document.createElement('pre');
                const codeElement = document.createElement('code');
                codeElement.textContent = message;
                preElement.appendChild(codeElement);
                messageElement.appendChild(preElement);

                // Adiciona o botão de copiar
                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copiar';
                copyButton.classList.add('copy-button');
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(message);
                    copyButton.textContent = 'Copiado!';
                    setTimeout(() => copyButton.textContent = 'Copiar', 2000);
                });
                messageElement.appendChild(copyButton);

            } else {
                const pElement = document.createElement('p');
                pElement.textContent = message;
                messageElement.appendChild(pElement);
            }

            chatbox.appendChild(messageElement);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        enviarButton.addEventListener('click', sendMessage);
        mensagemInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        /*
        // Chamar a função para criar a tabela de histórico e revisar o conteúdo da chatbox

        createHistroyTable();
reviseChatboxContent(); */
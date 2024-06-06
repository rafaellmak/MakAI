const express = require('express');
const bodyParser = require('body-parser');
const Groq = require('groq-sdk');
const { createHistroyTable, insertMessage } = require('./sqliteOperations');

const app = express();
const port = 3000;

const groq = new Groq({
  apiKey: 'Sua-API-aqui!' //https://console.groq.com/keys
});
createHistroyTable(); //aqui?
app.use(bodyParser.json());
app.use(express.static('.'));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{
        role: 'system',
        content: 'You are an advanced Artificial Intelligence model that responds only in Brazilian Portuguese. \n'
      },
      { role: 'user', content: userMessage }],
      model: 'llama3-8b-8192',
      temperature: 0.1,
      max_tokens: 8192, // Aumentado para 32768
      stream: true // Ativando o streaming
    });
    insertMessage(userMessage);//aqui?
    for await (const chunk of chatCompletion) {
      const messageChunk = chunk.choices[0]?.delta?.content || '';
      res.write(messageChunk);
    }

    res.end();

    
    

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Erro ao processar a mensagem' });
  }
});
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

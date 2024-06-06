const sqlite3 = require('sqlite3').verbose();

// Função para criar a tabela de histórico se não existir
function createHistroyTable() {
    let db = new sqlite3.Database('chatHistory.db', (err) => {
        if (err) {
            console.error('Erro ao abrir o banco de dados:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
            // Criando a tabela se ela não existir
            db.run('CREATE TABLE IF NOT EXISTS chatHistory (id INTEGER PRIMARY KEY, message TEXT)');
        }
    });
}

// Função para inserir uma mensagem no banco de dados
function insertMessage(message) {
    let db = new sqlite3.Database('chatHistory.db', (err) => {
        if (err) {
            console.error('Erro ao abrir o banco de dados:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
            // Inserindo a mensagem na tabela
            db.run('INSERT INTO chatHistory (id, message) VALUES (?, ?)', [new Date().getTime(), message]);
        }
    });
}

module.exports = { createHistroyTable, insertMessage };

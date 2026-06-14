// @ts-nocheck
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao conectar no banco de dados:');
    console.error('Mensagem:', err.message);
    console.error('Detalhes:', err);
    process.exit(1);
  }
}

start();

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar database e rotas
const dbModule = require('../../backend/database.js');
const authRouter = require('../../backend/routes/auth.js');
const servicosRouter = require('../../backend/routes/servicos.js');
const acoesRouter = require('../../backend/routes/acoes.js');
const reunioesRouter = require('../../backend/routes/reunioes.js');
const metasRouter = require('../../backend/routes/metas.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/servicos', servicosRouter);
app.use('/api/acoes', acoesRouter);
app.use('/api/reunioes', reunioesRouter);
app.use('/api/metas', metasRouter);

// Rota de dashboard
app.get('/api/dashboard', (req, res) => {
  try {
    const dashboardData = dbModule.default.getStats();
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota raiz da API
app.get('/api', (req, res) => {
  res.json({
    message: 'API do Sistema de Gerenciamento de Serviços - Igreja em Mossoró',
    version: '1.0.0',
    endpoints: {
      dashboard: '/api/dashboard',
      servicos: '/api/servicos',
      acoes: '/api/acoes',
      reunioes: '/api/reunioes',
      metas: '/api/metas',
      metasStats: '/api/metas/stats/:ano'
    }
  });
});

// Exportar como função serverless
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Importante: preservar o contexto do Lambda
  context.callbackWaitsForEmptyEventLoop = false;

  const result = await handler(event, context);
  return result;
};

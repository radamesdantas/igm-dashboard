import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET todas as ações (com filtro opcional por serviço e/ou mês)
router.get('/', (req, res) => {
  try {
    const acoes = db.acoes.getAll(req.query);
    res.json(acoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ações de um serviço específico
router.get('/servico/:servico_id', (req, res) => {
  try {
    const acoes = db.acoes.getByServico(req.params.servico_id);
    res.json(acoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar nova ação
router.post('/', (req, res) => {
  try {
    const acao = db.acoes.create(req.body);
    res.status(201).json(acao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar ação
router.put('/:id', (req, res) => {
  try {
    const acao = db.acoes.update(req.params.id, req.body);
    if (!acao) {
      return res.status(404).json({ error: 'Ação não encontrada' });
    }
    res.json(acao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover ação
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.acoes.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Ação não encontrada' });
    }
    res.json({ message: 'Ação removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

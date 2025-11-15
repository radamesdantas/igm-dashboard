import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET todas as reuniões (com filtro opcional por serviço e/ou mês)
router.get('/', (req, res) => {
  try {
    const reunioes = db.reunioes.getAll(req.query);
    res.json(reunioes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET reuniões de um serviço específico
router.get('/servico/:servico_id', (req, res) => {
  try {
    const reunioes = db.reunioes.getByServico(req.params.servico_id);
    res.json(reunioes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar nova reunião
router.post('/', (req, res) => {
  try {
    const reuniao = db.reunioes.create(req.body);
    res.status(201).json(reuniao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar reunião
router.put('/:id', (req, res) => {
  try {
    const reuniao = db.reunioes.update(req.params.id, req.body);
    if (!reuniao) {
      return res.status(404).json({ error: 'Reunião não encontrada' });
    }
    res.json(reuniao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover reunião
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.reunioes.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Reunião não encontrada' });
    }
    res.json({ message: 'Reunião removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

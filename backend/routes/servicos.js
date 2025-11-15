import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET todos os serviços
router.get('/', (req, res) => {
  try {
    const servicos = db.servicos.getAll();
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET um serviço específico
router.get('/:id', (req, res) => {
  try {
    const servico = db.servicos.getById(req.params.id);
    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    res.json(servico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar novo serviço
router.post('/', (req, res) => {
  try {
    const servico = db.servicos.create(req.body);
    res.status(201).json(servico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar serviço
router.put('/:id', (req, res) => {
  try {
    const servico = db.servicos.update(req.params.id, req.body);
    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    res.json(servico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover serviço
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.servicos.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

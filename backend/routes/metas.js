import express from 'express';
import db from '../database.js';

const router = express.Router();

// GET todas as metas (com filtros opcionais)
router.get('/', (req, res) => {
  try {
    const filters = {
      categoria: req.query.categoria,
      status: req.query.status,
      ano: req.query.ano
    };
    const metas = db.metas.getAll(filters);
    res.json(metas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET estatísticas de metas
router.get('/stats/:ano?', (req, res) => {
  try {
    const ano = req.params.ano ? parseInt(req.params.ano) : 2026;
    const stats = db.getMetasStats(ano);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET uma meta específica (com submetas e atualizações)
router.get('/:id', (req, res) => {
  try {
    const meta = db.metas.getById(req.params.id);
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar nova meta
router.post('/', (req, res) => {
  try {
    const meta = db.metas.create(req.body);
    res.status(201).json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar meta
router.put('/:id', (req, res) => {
  try {
    const meta = db.metas.update(req.params.id, req.body);
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH atualizar progresso da meta
router.patch('/:id/progresso', (req, res) => {
  try {
    const { valorAtual, percentual, observacao } = req.body;
    const meta = db.metas.updateProgresso(req.params.id, valorAtual, percentual, observacao);
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover meta
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.metas.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    res.json({ message: 'Meta removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ROTAS DE SUBMETAS =====

// GET submetas de uma meta
router.get('/:metaId/submetas', (req, res) => {
  try {
    const submetas = db.submetas.getByMeta(req.params.metaId);
    res.json(submetas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar submeta
router.post('/:metaId/submetas', (req, res) => {
  try {
    const data = {
      ...req.body,
      meta_id: req.params.metaId
    };
    const submeta = db.submetas.create(data);
    res.status(201).json(submeta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar submeta
router.put('/:metaId/submetas/:id', (req, res) => {
  try {
    const submeta = db.submetas.update(req.params.id, req.body);
    if (!submeta) {
      return res.status(404).json({ error: 'Submeta não encontrada' });
    }
    res.json(submeta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH toggle status de submeta (concluída/não concluída)
router.patch('/:metaId/submetas/:id/toggle', (req, res) => {
  try {
    const submeta = db.submetas.toggleConcluida(req.params.id);
    if (!submeta) {
      return res.status(404).json({ error: 'Submeta não encontrada' });
    }
    res.json(submeta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover submeta
router.delete('/:metaId/submetas/:id', (req, res) => {
  try {
    const deleted = db.submetas.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Submeta não encontrada' });
    }
    res.json({ message: 'Submeta removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ROTAS DE ATUALIZAÇÕES =====

// GET histórico de atualizações de uma meta
router.get('/:metaId/atualizacoes', (req, res) => {
  try {
    const atualizacoes = db.atualizacoesMetas.getByMeta(req.params.metaId);
    res.json(atualizacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

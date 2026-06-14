// @ts-nocheck
const { Router } = require('express');
const situationService = require('../services/SituationService');

const router = Router();

router.get('/situacoes', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const response = await situationService.findAll(page, limit);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar situacoes' });
  }
});

router.get('/situacoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const situation = await situationService.findById(id);

    if (!situation) {
      return res.status(404).json({ message: 'Situacao nao encontrada' });
    }

    return res.status(200).json(situation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar situacao' });
  }
});

router.post('/situacoes', async (req, res) => {
  try {
    const situation = await situationService.create(req.body);

    return res.status(201).json({
      message: 'Situacao criada com sucesso',
      data: situation,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 400).json({
      message: error.message || 'Erro ao criar situacao',
      ...(error.errors ? { errors: error.errors } : {}),
    });
  }
});

router.put('/situacoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const situation = await situationService.update(id, req.body);

    if (!situation) {
      return res.status(404).json({ message: 'Situacao nao encontrada' });
    }

    return res.status(200).json({
      message: 'Situacao atualizada com sucesso',
      data: situation,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 400).json({
      message: error.message || 'Erro ao atualizar situacao',
      ...(error.errors ? { errors: error.errors } : {}),
    });
  }
});

router.delete('/situacoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await situationService.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Situacao nao encontrada' });
    }

    return res.status(200).json({
      message: 'Situacao deletada com sucesso',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar situacao' });
  }
});

module.exports = router;

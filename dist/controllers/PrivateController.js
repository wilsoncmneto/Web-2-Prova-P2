// @ts-nocheck
'use strict';
const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = Router();
router.get('/rota-restrita', authMiddleware, (req, res) => {
    return res.status(200).json({
        message: 'Acesso autorizado a rota restrita',
        user: req.user,
    });
});
module.exports = router;

// @ts-nocheck
'use strict';
const { User, Situation } = require('../models');
const { verifyAuthToken } = require('../utils/authToken');
const { sanitizeUser } = require('../utils/validation');
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Token nao informado.' });
        }
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            return res.status(401).json({ message: 'Formato do token invalido.' });
        }
        const payload = verifyAuthToken(token);
        if (!payload) {
            return res.status(401).json({ message: 'Token invalido ou expirado.' });
        }
        const user = await User.findOne({
            where: { id: payload.id, email: payload.email },
            include: [{ model: Situation, as: 'situation' }],
        });
        if (!user) {
            return res.status(401).json({ message: 'Usuario do token nao encontrado.' });
        }
        req.auth = payload;
        req.user = sanitizeUser(user);
        return next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Token invalido ou expirado.' });
    }
}
module.exports = authMiddleware;

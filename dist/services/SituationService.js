"use strict";
// @ts-nocheck
const { Op } = require('sequelize');
const { Situation } = require('../models');
const PaginationService = require('./PaginationService');
const SituationEntity = require('../entities/SituationEntity');
const { schemas, validateYupSchema } = require('../utils/validation');
class SituationService {
    async findAll(page, limit) {
        const { limit: lim, offset } = PaginationService.paginate(page, limit);
        const { rows, count } = await Situation.findAndCountAll({
            limit: lim,
            offset,
            order: [['id', 'ASC']],
        });
        const data = rows.map((s) => new SituationEntity(s.toJSON()));
        return PaginationService.formatResponse(data, count, page, lim);
    }
    async findById(id) {
        const s = await Situation.findByPk(id);
        return s ? new SituationEntity(s.toJSON()) : null;
    }
    async create(body) {
        const validationErrors = await validateYupSchema(schemas.situationCreate, body);
        if (validationErrors.length > 0) {
            const error = new Error('Erro de validacao');
            error.statusCode = 400;
            error.errors = validationErrors;
            throw error;
        }
        const cleanName = String(body.nameSituation).trim();
        const exists = await Situation.findOne({ where: { nameSituation: cleanName } });
        if (exists) {
            const error = new Error('Ja existe uma situacao cadastrada com este nome.');
            error.statusCode = 409;
            throw error;
        }
        const s = await Situation.create({ nameSituation: cleanName });
        return new SituationEntity(s.toJSON());
    }
    async update(id, body) {
        const s = await Situation.findByPk(id);
        if (!s)
            return null;
        const validationErrors = await validateYupSchema(schemas.situationUpdate, body);
        if (validationErrors.length > 0) {
            const error = new Error('Erro de validacao');
            error.statusCode = 400;
            error.errors = validationErrors;
            throw error;
        }
        const cleanName = String(body.nameSituation).trim();
        const exists = await Situation.findOne({
            where: {
                nameSituation: cleanName,
                id: { [Op.ne]: Number(id) },
            },
        });
        if (exists) {
            const error = new Error('Ja existe outra situacao cadastrada com este nome.');
            error.statusCode = 409;
            throw error;
        }
        await s.update({ nameSituation: cleanName });
        return new SituationEntity(s.toJSON());
    }
    async delete(id) {
        const s = await Situation.findByPk(id);
        if (!s)
            return false;
        await s.destroy();
        return true;
    }
}
module.exports = new SituationService();

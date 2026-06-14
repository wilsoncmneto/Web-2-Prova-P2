"use strict";
// @ts-nocheck
const { User, Situation } = require('../models');
const PaginationService = require('./PaginationService');
const UserEntity = require('../entities/UserEntity');
class UserService {
    async findAll(page, limit) {
        const { limit: lim, offset } = PaginationService.paginate(page, limit);
        const { rows, count } = await User.findAndCountAll({
            include: [{ model: Situation, as: 'situation' }],
            limit: lim,
            offset,
            order: [['id', 'ASC']],
        });
        const data = rows.map((u) => new UserEntity(u.toJSON()));
        return PaginationService.formatResponse(data, count, page, lim);
    }
    async findById(id) {
        const user = await User.findByPk(id, {
            include: [{ model: Situation, as: 'situation' }],
        });
        if (!user)
            return null;
        return new UserEntity(user.toJSON());
    }
    async create(body) {
        const user = await User.create(body);
        return new UserEntity(user.toJSON());
    }
    async update(id, body) {
        const user = await User.findByPk(id);
        if (!user)
            return null;
        await user.update(body);
        return new UserEntity(user.toJSON());
    }
    async delete(id) {
        const user = await User.findByPk(id);
        if (!user)
            return false;
        await user.destroy();
        return true;
    }
}
module.exports = new UserService();

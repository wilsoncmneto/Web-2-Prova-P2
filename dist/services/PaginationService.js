"use strict";
// @ts-nocheck
class PaginationService {
    static paginate(page = 1, limit = 10) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;
        return { limit: limitNum, offset };
    }
    static formatResponse(data, count, page, limit) {
        const totalPages = Math.ceil(count / limit);
        return {
            data,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1,
            },
        };
    }
}
module.exports = PaginationService;

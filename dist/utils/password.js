// @ts-nocheck
'use strict';
const crypto = require('crypto');
const HASH_ALGORITHM = 'scrypt';
const KEY_LENGTH = 64;
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(String(password), salt, KEY_LENGTH).toString('hex');
    return `${HASH_ALGORITHM}$${salt}$${hash}`;
}
function isPasswordHashed(password) {
    return (typeof password === 'string' &&
        password.startsWith(`${HASH_ALGORITHM}$`) &&
        password.split('$').length === 3);
}
function comparePassword(password, storedPassword) {
    if (!isPasswordHashed(storedPassword)) {
        return String(password) === String(storedPassword);
    }
    const [, salt, originalHash] = storedPassword.split('$');
    const hash = crypto.scryptSync(String(password), salt, KEY_LENGTH).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
}
function generateRecoveryCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}
module.exports = {
    comparePassword,
    generateRecoveryCode,
    hashPassword,
    isPasswordHashed,
};

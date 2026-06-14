// @ts-nocheck
'use strict';
const nodemailer = require('nodemailer');
function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: String(process.env.EMAIL_SECURE || 'false') === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}
class MailService {
    async sendRecoverPasswordEmail({ to, name, recoverPasswordUrl }) {
        const appName = process.env.APP_NAME || 'API P1';
        const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
        const transporter = createTransporter();
        return transporter.sendMail({
            from,
            to,
            subject: 'Recuperar senha',
            text: `Prezado(a) ${name},\n\n` +
                'Recebemos a sua solicitacao de recuperacao de senha.\n\n' +
                `Acesse o link abaixo para criar uma nova senha:\n${recoverPasswordUrl}\n\n` +
                `Esta mensagem foi enviada por ${appName}.`,
            html: `<p>Prezado(a) <strong>${name}</strong>,</p>` +
                '<p>Recebemos a sua solicitacao de recuperacao de senha.</p>' +
                `<p>Acesse o link abaixo para criar uma nova senha:<br><a href="${recoverPasswordUrl}">${recoverPasswordUrl}</a></p>` +
                `<p>Esta mensagem foi enviada por ${appName}.</p>`,
        });
    }
}
module.exports = new MailService();

// @ts-nocheck
const yup = require('yup');

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function normalizeText(value) {
  if (value === undefined || value === null) return value;
  return String(value).trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function isValidEmail(value) {
  if (isBlank(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function isPositiveNumber(value) {
  if (value === undefined || value === null || value === '') return false;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0;
}

function isValidId(value) {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0;
}

function addRequiredError(errors, field, label) {
  errors.push({ field, message: `O campo ${label} é obrigatório.` });
}

function validateRequiredFields(body, fields) {
  const errors = [];

  fields.forEach(({ field, label }) => {
    if (isBlank(body[field])) addRequiredError(errors, field, label || field);
  });

  return errors;
}

function validateEmailField(errors, email) {
  if (!isBlank(email) && !isValidEmail(email)) {
    errors.push({ field: 'email', message: 'O campo email deve possuir um endereço válido.' });
  }
}

function validateIdField(errors, body, field, label) {
  if (!isBlank(body[field]) && !isValidId(body[field])) {
    errors.push({ field, message: `O campo ${label || field} deve ser um ID numérico válido.` });
  }
}

function validatePriceField(errors, price) {
  if (!isBlank(price) && !isPositiveNumber(price)) {
    errors.push({ field: 'price', message: 'O campo price deve ser um número maior que zero.' });
  }
}

function sendValidationError(res, errors) {
  return res.status(400).json({
    message: 'Erro de validação',
    errors,
  });
}

function sanitizeUser(user) {
  if (!user) return user;
  const data = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete data.password;
  delete data.recoverPassword;
  return data;
}

function requiredText(field) {
  return yup
    .string()
    .transform((value) => (typeof value === 'string' ? value.trim() : value))
    .required(`O campo ${field} e obrigatorio.`);
}

function optionalText(field) {
  return yup
    .string()
    .transform((value) => (typeof value === 'string' ? value.trim() : value))
    .test('not-empty', `O campo ${field} nao pode ser vazio.`, (value) => {
      return value === undefined || value === null || String(value).trim() !== '';
    });
}

function requiredUrl(field) {
  return requiredText(field).test('valid-url', `O campo ${field} deve possuir uma URL valida.`, (value) => {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol);
    } catch (error) {
      return false;
    }
  });
}

function requiredId(field) {
  return yup
    .number()
    .typeError(`O campo ${field} deve ser um ID numerico valido.`)
    .integer(`O campo ${field} deve ser um ID numerico valido.`)
    .positive(`O campo ${field} deve ser um ID numerico valido.`)
    .required(`O campo ${field} e obrigatorio.`);
}

function optionalId(field) {
  return yup
    .mixed()
    .test('not-empty', `O campo ${field} nao pode ser vazio.`, (value) => {
      return value === undefined || value === null || String(value).trim() !== '';
    })
    .test('valid-id', `O campo ${field} deve ser um ID numerico valido.`, (value) => {
      if (value === undefined || value === null) return true;
      return isValidId(value);
    });
}

const schemas = {
  login: yup.object({
    email: requiredText('email').email('O campo email deve possuir um endereco valido.'),
    password: requiredText('password'),
  }),

  recoverPassword: yup.object({
    email: requiredText('email').email('O campo email deve possuir um endereco valido.'),
    urlRecoverPassword: requiredUrl('urlRecoverPassword'),
  }),

  validateRecoverPassword: yup.object({
    email: requiredText('email').email('O campo email deve possuir um endereco valido.'),
    recoverPassword: requiredText('recoverPassword'),
  }),

  resetPassword: yup.object({
    email: requiredText('email').email('O campo email deve possuir um endereco valido.'),
    recoverPassword: requiredText('recoverPassword'),
    password: requiredText('password').min(6, 'O campo password deve ter no minimo 6 caracteres.'),
  }),

  userCreate: yup.object({
    name: requiredText('name'),
    email: requiredText('email').email('O campo email deve possuir um endereco valido.'),
    password: requiredText('password').min(6, 'O campo password deve ter no minimo 6 caracteres.'),
    recoverPassword: optionalText('recoverPassword').nullable(),
    situationId: requiredId('situationId'),
  }),

  publicUserCreate: yup.object({
    name: requiredText('name'),
    email: requiredText('email').email('O campo email deve possuir um endereco valido.'),
    password: requiredText('password').min(6, 'O campo password deve ter no minimo 6 caracteres.'),
  }),

  userUpdate: yup.object({
    name: optionalText('name'),
    email: optionalText('email').email('O campo email deve possuir um endereco valido.'),
    password: optionalText('password').min(6, 'O campo password deve ter no minimo 6 caracteres.'),
    recoverPassword: optionalText('recoverPassword').nullable(),
    situationId: optionalId('situationId'),
  }),

  productCreate: yup.object({
    name: requiredText('name'),
    slug: optionalText('slug'),
    description: requiredText('description'),
    price: yup
      .number()
      .typeError('O campo price deve ser um numero maior que zero.')
      .positive('O campo price deve ser um numero maior que zero.')
      .required('O campo price e obrigatorio.'),
    productSituationId: requiredId('productSituationId'),
    productCategoryId: requiredId('productCategoryId'),
  }),

  productUpdate: yup.object({
    name: optionalText('name'),
    slug: optionalText('slug'),
    description: optionalText('description'),
    price: yup
      .mixed()
      .test('not-empty', 'O campo price nao pode ser vazio.', (value) => {
        return value === undefined || value === null || String(value).trim() !== '';
      })
      .test('positive-number', 'O campo price deve ser um numero maior que zero.', (value) => {
        if (value === undefined || value === null) return true;
        return isPositiveNumber(value);
      }),
    productSituationId: optionalId('productSituationId'),
    productCategoryId: optionalId('productCategoryId'),
  }),

  nameCreate: yup.object({
    name: requiredText('name'),
  }),

  nameUpdate: yup.object({
    name: optionalText('name'),
  }),

  situationCreate: yup.object({
    nameSituation: requiredText('nameSituation'),
  }),

  situationUpdate: yup.object({
    nameSituation: requiredText('nameSituation'),
  }),
};

async function validateYupSchema(schema, body) {
  try {
    await schema.validate(body, { abortEarly: false });
    return [];
  } catch (error) {
    if (!error.inner || error.inner.length === 0) {
      return [{ field: error.path || 'body', message: error.message }];
    }

    return error.inner.map((err) => ({
      field: err.path || 'body',
      message: err.message,
    }));
  }
}

module.exports = {
  isBlank,
  normalizeText,
  normalizeEmail,
  isValidEmail,
  isPositiveNumber,
  isValidId,
  validateRequiredFields,
  validateEmailField,
  validateIdField,
  validatePriceField,
  sendValidationError,
  sanitizeUser,
  schemas,
  validateYupSchema,
};

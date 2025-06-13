const Joi = require('joi');

const usuariosSchema = Joi.object({
    quantidade: Joi.number().required(),
    usuarios: Joi.array().items(
        Joi.object({
            nome: Joi.string().required(),
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            password: Joi.string(),
            administrador: Joi.string(),
            _id: Joi.string().required()
        })
    ).required()
});

module.exports = usuariosSchema;
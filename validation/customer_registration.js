const Joi = require('joi');

const customerRegisterValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        mobile: Joi.string().length(10).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).max(20).required(),
    });

    return schema.validate(data);
}

module.exports.customerRegisterValidation = customerRegisterValidation;
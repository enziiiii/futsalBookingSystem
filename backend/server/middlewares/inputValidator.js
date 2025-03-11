const Joi = require("joi");

const schemas = {
    registerSchema: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(255).pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])')).required(),
        phoneNumber: Joi.string().min(10).max(20).required()
    }),

    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(255).required()
    })
};

const validateUser = (schema) => (req, res, next) => {
    const { error } = schemas[schema].validate(req.body);
    if(error) 
        return res.status(400).json({
    status: 400,
    message: error.details[0].message,
    });
    next();
};

module.exports = {
    validateUser
}

/*
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    fullName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(255).pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])')).required(),
    phoneNumber: Joi.string().min(10).max(20).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(255).required()
});




const validateUser = (req, res, next) => {
    const { error } = registerSchema && loginSchema.validate(req.body);
    if(error) 
        return res.status(400).json({
    status: 400,
    message: error.details[0].message,
    });
    next();
};

module.exports = {
    validateUser
}

*/
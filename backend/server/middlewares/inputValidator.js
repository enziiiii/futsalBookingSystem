// const Joi = require("joi");
const { z } = require('zod');

const schemas = {
    registerSchema: z.object({
        username: z.string().min(3).max(30),
        fullName: z.string().min(3).max(100),
        email: z.string().email(),
        password: z.string()
            .min(8, "Password must be atleast 8 chars long")
            .max(255, "Password cannot exceed 255 characters")
            .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
               "Password must contain at least uppercase letter and one special character"),
        phoneNumber: z.string().min(10).max(20)
    }),

    loginSchema: z.object({
        email: z.string().email(),
        password: z.string().min(8).max(255)
    })
};

const validateUser = (schema) => (req, res, next) => {
    const parseResult = schemas[schema].safeParse(req.body);
    if(!parseResult.success) { 
        return res.status(400).json({
            status: 400,
            message: parseResult.error.errors.map(e => e.message).join(", ")
        });
    }
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
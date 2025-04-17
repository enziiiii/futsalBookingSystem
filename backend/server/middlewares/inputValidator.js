// const Joi = require("joi");
const { z } = require('zod');


const schemas = {
// ----------- for Authentication and Authorization -------------------------------------//

    registerSchema: z.object({
        username: z.string().min(3).max(30),
        fullName: z.string().min(3).max(100),
        email: z.string().email(),
        password: z.string()
            .min(8, "Password must be at least 8 chars long")
            .max(255, "Password cannot exceed 255 characters")
            .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
               "Password must contain at least uppercase letter and one special character"),
        phoneNumber: z.string().min(10).max(20)
    }),

    loginSchema: z.object({
        email: z.string().email(),
        password: z.string().min(8).max(255)
    }),

    
    // ----------------- for Court -------------------------------------//
    
    createCourtSchema: z.object({
        court_name: z.string().min(1, "Court name is required"),
        location: z.string().optional(),
        hourly_rate : z.number().positive("Hourly rate must be positive"),
        status: z.enum(["available", "booked", "maintenance", "closed"]).default("available")
    }),

    updateCourtSchema: z.object({
        court_name: z.string().min(1).optional(),
        location: z.string().optional(),
        hourly_rate: z.number(0).positive().optional(),
        status: z.enum(["available", "booked", "maintenance", "closed"]).optional()
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

const validateCourt = (schema) => (req, res, next) => {
    const parseResult = schemas[schema].safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            status: 400,
            message: parseResult.error.errors.map(e => e.message).join(", ")
        });
    }
    next();
};


module.exports = {
    validateUser,
    validateCourt
}
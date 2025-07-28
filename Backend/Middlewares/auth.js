import Joi from 'joi';

export const registerValidation = (req, res, next) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        name: Joi.string().min(3).max(100).required(),
        phoneNumber: Joi.string().length(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        loginType: Joi.string().valid('student', 'admin').required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message:"Bad request", error});
    }
    next();
} 

export const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        password: Joi.string().min(4).max(100).required(),
        loginType: Joi.string().valid('student', 'admin').required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message:"Bad request", error});
    }
    next();
} 

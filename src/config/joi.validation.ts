import * as Joi from 'joi';

export const JoiVlidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3001),
    DEFAULT_LIMIT: Joi.number().default(7),
    DEFAULT_OFFSET: Joi.number().default(0),
})
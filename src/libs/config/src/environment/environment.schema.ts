import * as Joi from 'joi';

export const environmentSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Service ports
  PORT: Joi.number().default(3000),
  AUTH_PORT: Joi.number().default(3000),
  USER_PORT: Joi.number().default(3001),
  PRODUCT_PORT: Joi.number().default(3002),
  ORDER_PORT: Joi.number().default(3003),

  // RabbitMQ
  RABBITMQ_URL: Joi.string().default('amqp://user:password@rabbitmq:5672'),
  RABBITMQ_USER: Joi.string().default('user'),
  RABBITMQ_PASS: Joi.string().default('password'),
  RABBITMQ_HOST: Joi.string().default('rabbitmq'),
  RABBITMQ_PORT: Joi.number().default(5672),

  // Database (for future use)
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('postgres'),
  DATABASE_NAME: Joi.string().default('marketplace'),
}); 
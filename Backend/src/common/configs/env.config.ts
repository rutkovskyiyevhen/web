import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  TYPE_DB: Joi.string(),
  HOST_DB: Joi.string(),
  PORT_DB: Joi.number(),
  USERNAME_DB: Joi.string(),
  PASSWORD_DB: Joi.string(),
  NAME_DB: Joi.string(),
  JWT_SECRET: Joi.string().min(32),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  port: envVars.PORT,
  type_db: envVars.TYPE_DB,
  host_db: envVars.HOST_DB,
  port_db: envVars.PORT_DB,
  username_db: envVars.USERNAME_DB,
  password_db: envVars.PASSWORD_DB,
  name_db: envVars.NAME_DB,
  jwt_secret: envVars.JWT_SECRET,
  mail_user: envVars.MAIL_USER,
  mail_password: envVars.MAIL_PASSWORD,
  mail_from: envVars.MAIL_FROM,
  mail_port: envVars.MAIL_PORT,
  mail_host: envVars.MAIL_HOST,
  dictionary_api_url: envVars.DICTIONARY_API_URL,
  gpt_api: envVars.GPT_API,
  gpt_url: envVars.GPT_URL,
  google_client_id: envVars.GOOGLE_CLIENT_ID,
  google_client_secret: envVars.GOOGLE_CLIENT_SECRET,
  google_callback_url: envVars.GOOGLE_CALLBACK_URL,
  frontend_url: envVars.FRONTEND_URL,
};

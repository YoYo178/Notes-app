import z from 'zod';

export const NODE_ENVS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NODE_ENVS)).default('development'),

  /* App */
  APP_NAME: z.string(),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string(),
  FRONTEND_ORIGIN: z.string(),

  /* AWS */
  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),

  /* Token secrets */
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  RESET_PASSWORD_ACCESS_TOKEN_SECRET: z.string(),

  /* SMTP */
  SMTP_MOCK: z.coerce.boolean().default(true),
  SMTP_PROVIDER: z.string(),
  SMTP_EMAIL: z.email(),
  SMTP_PASS: z.string(),
});

const ENV = envSchema.parse(process.env);

export default ENV;

type EnvKey =
  | "DB_HOST"
  | "DB_PORT"
  | "DB_NAME"
  | "DB_USER"
  | "DB_PASSWORD"
  | "SESSION_SECRET"
  | "AES_SECRET_KEY";

function getEnvValue(key: EnvKey): string {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getRequiredEnv(key: EnvKey): string {
  return getEnvValue(key);
}

export function getRequiredDbConfig() {
  const dbPort = Number(getEnvValue("DB_PORT"));

  if (!Number.isInteger(dbPort) || dbPort <= 0) {
    throw new Error("DB_PORT must be a positive integer.");
  }

  return {
    host: getEnvValue("DB_HOST"),
    port: dbPort,
    database: getEnvValue("DB_NAME"),
    user: getEnvValue("DB_USER"),
    password: getEnvValue("DB_PASSWORD"),
  } as const;
}

export const env = {
  DB_NAME: process.env.DB_NAME,
  SESSION_SECRET: process.env.SESSION_SECRET,
  AES_SECRET_KEY: process.env.AES_SECRET_KEY,
} as const;

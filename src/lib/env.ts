type EnvKey =
  | "DB_HOST"
  | "DB_PORT"
  | "DB_NAME"
  | "DB_USER"
  | "DB_PASSWORD"
  | "SESSION_SECRET"
  | "AES_SECRET_KEY";

const REQUIRED_ENV_KEYS: EnvKey[] = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "SESSION_SECRET",
  "AES_SECRET_KEY",
];

function getEnvValue(key: EnvKey): string {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

const parsedDbPort = Number(getEnvValue("DB_PORT"));

if (!Number.isInteger(parsedDbPort) || parsedDbPort <= 0) {
  throw new Error("DB_PORT must be a positive integer.");
}

for (const key of REQUIRED_ENV_KEYS) {
  getEnvValue(key);
}

export const env = {
  DB_HOST: getEnvValue("DB_HOST"),
  DB_PORT: parsedDbPort,
  DB_NAME: getEnvValue("DB_NAME"),
  DB_USER: getEnvValue("DB_USER"),
  DB_PASSWORD: getEnvValue("DB_PASSWORD"),
  SESSION_SECRET: getEnvValue("SESSION_SECRET"),
  AES_SECRET_KEY: getEnvValue("AES_SECRET_KEY"),
} as const;

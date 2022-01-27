import dotenv from "dotenv"
dotenv.config()

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue
  if (value == null) {
    throw new Error(`Key ${key} is undefined`)
  }
  return value
}

export const config = {
  db: {
    host: required("DB_HOST"),
  },
  port: {
    port: required("PORT"),
  },
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN"),
  },
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
  },
}

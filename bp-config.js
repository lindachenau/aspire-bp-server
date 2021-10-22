require('dotenv').config()

const bpConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 10
  },
  options: {
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    }
  }
}

module.exports = {
  bpConfig
}

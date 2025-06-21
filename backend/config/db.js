// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase SSL
  },
  idleTimeoutMillis: 10000, // ✅ Close idle clients after 10s
  connectionTimeoutMillis: 5000, // ✅ Fail fast on connection issues
  max: 10, // ✅ Max number of clients in the pool (adjust to stay within Supabase's limits)
});

// Log unexpected errors from idle clients
pool.on('error', (err) => {
  console.error('🔥 Unexpected error on idle PostgreSQL client:', err);
});

module.exports = pool;

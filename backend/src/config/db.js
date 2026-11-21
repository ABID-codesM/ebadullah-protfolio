// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pg;

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT) || 5432,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,

//   max: 10,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 5000,
// });

// pool.on("error", (error) => {
//   console.error("Unexpected PostgreSQL pool error:", error);
// });

// export default pool;

// ___________________________________rendter sid_______________________________________

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,

  ssl: {
    rejectUnauthorized: true,
  },
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export default pool;

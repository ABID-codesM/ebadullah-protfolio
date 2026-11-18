import pool from "./config/db.js";

try {
  const result = await pool.query(`
    SELECT
      current_database() AS database,
      NOW() AS server_time
  `);

  console.log("✅ Neon Database Connected Successfully!");
  console.log("Database:", result.rows[0].database);
  console.log("Server Time:", result.rows[0].server_time);
} catch (error) {
  console.error("❌ Database Connection Failed:", error.message);
} finally {
  await pool.end();
}

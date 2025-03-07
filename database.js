const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});


pool.query(
  `CREATE TABLE IF NOT EXISTS settings (
    feature TEXT PRIMARY KEY,
    status TEXT NOT NULL
  )`,
  (err) => {
    if (err) console.error("❌ Database setup failed:", err);
    else console.log("✅ Database is ready!");
  }
);

module.exports = pool;
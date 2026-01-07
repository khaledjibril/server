import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
  max: 3,                     // 🔥 very important
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000, // 🔥 very important
  keepAlive: true,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("🔥 Unexpected PostgreSQL pool error:", err);
});

export default pool;
//$env:PGPASSWORD = "194VYZPK7Eafd8JOUxyFRUmqdGoiTvw6"
//psql -h dpg-d5ehobvgi27c73b164rg-a.oregon-postgres.render.com -U neriah_db_user -d neriah_db

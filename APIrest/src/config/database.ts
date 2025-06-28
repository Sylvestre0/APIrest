import { Pool } from 'pg';
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.ConnectionString;
const database = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
});

export default database;
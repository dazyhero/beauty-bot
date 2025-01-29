import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URI
});

export const initializeDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bot_statistics (
      id SERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      username VARCHAR(255),
      command VARCHAR(255) NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      success BOOLEAN NOT NULL,
      error TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
  } catch (error) {
    console.error('Error creating table:', error);
  }
};


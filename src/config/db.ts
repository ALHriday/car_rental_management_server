import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: `${config.connectionString}`,
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        role TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(250) NOT NULL,
        type VARCHAR(100) NOT NULL,
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL,
        availability_status TEXT NOT NULL
        )
        `)
};

export default initDB;
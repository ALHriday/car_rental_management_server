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
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        role VARCHAR(10) DEFAULT 'customer'
        )
        `)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(250) NOT NULL,
        type VARCHAR(100) NOT NULL,
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL,
        availability_status TEXT NOT NULL,
        CHECK (daily_rent_price > 0)
        )
        `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) NOT NULL,
        vehicle_id INT REFERENCES vehicles(id) NOT NULL,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price INT NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        CHECK (rent_end_date > rent_start_date)
        )
        `)
};

export default initDB;
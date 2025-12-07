import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from "../config"
import { pool } from '../config/db';

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone } = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);

    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone) VALUES($1, $2, $3, $4) RETURNING *`,
        [name, email, hashedPass, phone]
    );
    return result;
}

const login = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email,]);

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
        return false;
    }
    const secret = config.jwt_secret;

    const token = jwt.sign({ name: user.name, email: user.email, role: user?.role }, secret as string, { expiresIn: '7d' });

    return { token, user };
}

export const authServices = {
    createUser,
    login
}
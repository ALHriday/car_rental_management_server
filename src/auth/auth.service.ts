import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from "../config"
import { pool } from '../config/db';

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);
    const emailLowerCase: string = String(email).toLowerCase();

    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [name, emailLowerCase, hashedPass, phone, role]
    );
    return result;
}

const login = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
        throw new Error('Wrong Email or Password!');
    }

    const user = result.rows[0];

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
        throw new Error('Wrong Email or Password!');
    }
    const secret = config.jwt_secret;

    const token = jwt.sign({ id: user.id, email: user.email, role: user?.role }, secret as string, { expiresIn: '7d' });

    return { token, user };
}

export const authServices = {
    createUser,
    login
}
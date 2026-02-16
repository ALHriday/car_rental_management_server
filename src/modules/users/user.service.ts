import { pool } from "../../config/db"
import bcrypt from "bcrypt"
import { ROLE } from "../../types/role.enum";

const getUser = async () => {
    const result = await pool.query(
        `SELECT * FROM users`
    )
    return result;
}


const updateUser = async (payload: Record<string, unknown>, userId: string, currentUserId: string, currentUserRole: string) => {
    const { name, email, password, phone, role } = payload;


    if (currentUserRole === ROLE.CUSTOMER && String(currentUserId) !== String(userId)) {
        throw new Error("You can't update this profile!");
    }

    let hashedPass: string | undefined;
    if (password) {
        hashedPass = await bcrypt.hash(password as string, 10);
    }

    try {

        if (currentUserRole === ROLE.ADMIN) {
            const result = await pool.query(
                ` UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING *
            `,
                [name, email, hashedPass, phone, role, userId]
            );
            return result;

        }

        const result = await pool.query(
            ` UPDATE users SET name=$1, email=$2, password=$3, phone=$4 WHERE id=$5 RETURNING *
            `,
            [name, email, hashedPass, phone, userId]
        );
        return result;

    } catch (err) {
        throw err;
    }

}

const deleteUser = async (userId: string) => {

    try {
        const checkUser = await pool.query(
            `SELECT id FROM users WHERE id=$1`,
            [userId]
        );

        if (checkUser.rowCount === 0) {
            throw new Error("User not found!");
        }

        const result = await pool.query(
            ` DELETE FROM users WHERE id = $1 AND NOT EXISTS (
            SELECT 1 FROM bookings WHERE customer_id =$1 AND status ='active'
            ) RETURNING *`,
            [userId]
        );

        if (result.rowCount === 0) {
            throw new Error("User has active booking. Can't delete!");
        }

        return result;

    } catch (err) {
        throw err;
    }
}

export const userServices = {
    getUser,
    updateUser,
    deleteUser,
}
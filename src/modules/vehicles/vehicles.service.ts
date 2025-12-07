import { pool } from "../../config/db";

//  "vehicle_name": "Toyota Camry 2024",
//     "type": "car",
//     "registration_number": "ABC-1234",
//     "daily_rent_price": 50,
//     "availability_status": "available"

const createVehicles = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(
        `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );
    return result;
}

const getVehicles = async () => {
    const result = await pool.query(
        `SELECT * FROM vehicles`
    )
    return result;
}
const getSingleVehicle = async (id: string) => {
    const result = await pool.query(
        `SELECT * FROM vehicles WHERE id=$1`, [id]
    )
    return result;
}

const updateVehicles = async (payload: Record<string, unknown>, id: string) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(
        ` UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *
            `,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
    );
    return result;
}

export const vehiclesServices = {
    createVehicles,
    getVehicles,
    getSingleVehicle,
    updateVehicles,
}
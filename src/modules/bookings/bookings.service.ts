import { pool } from "../../config/db";
import calculateNumberOfDay from "../../hooks/calculateDay";

const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const bookingVehicle = await pool.query(
        `SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]
    );

    const { daily_rent_price, availability_status } = bookingVehicle.rows[0] || [];

    if (availability_status !== "available") {
        return;
    }

    const numberOfDays: number = calculateNumberOfDay(rent_start_date as Date, rent_end_date as Date);

    const totalPrice = daily_rent_price as number * numberOfDays;
    const booked = "booked";

    await pool.query(
        `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
        [booked, vehicle_id]
    );

    const result = await pool.query(
        `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
    );
    return result;
}


const getBookings = async () => {
    const result = await pool.query(
        `SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            u.name AS customer_name,
            u.email AS customer_email,
            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b JOIN users u ON b.customer_id = u.id JOIN vehicles v ON b.vehicle_id = v.id ORDER BY b.id DESC
        `
    );

    return result;
}
const getBookingCustomer = async () => {
    const result = await pool.query(
        `SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b JOIN users u ON b.customer_id = u.id JOIN vehicles v ON b.vehicle_id = v.id ORDER BY b.id DESC
        `
    );

    return result;
}

const updateBooking = async (payload: Record<string, unknown>, id: string) => {
    const { vehicle_id, rent_start_date, rent_end_date } = payload;

    const bookingVehicle = await pool.query(
        `SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]
    );

    const { daily_rent_price, availability_status } = bookingVehicle.rows[0] || [];

    const numberOfDays: number = calculateNumberOfDay(rent_start_date as Date, rent_end_date as Date);

    const totalPrice = daily_rent_price as number * numberOfDays;

    const result = await pool.query(
        `UPDATE bookings SET rent_start_date=$1, rent_end_date=$2, total_price=$3 WHERE id=$4 RETURNING *`,
        [rent_start_date, rent_end_date, totalPrice, id]
    );
    return result;
}

export const bookingsServices = {
    createBooking,
    getBookings,
    updateBooking,
    getBookingCustomer,
}
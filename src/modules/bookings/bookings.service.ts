import { pool } from "../../config/db";
import calculateNumberOfDay from "../../hooks/calculateDay";
import { ROLE } from "../../types/role.enum";

const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const bookingVehicle = await pool.query(
        `SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]
    );

    const { daily_rent_price, availability_status } = bookingVehicle.rows[0];

    const today = new Date();
    const checkRentStartDate = new Date(rent_start_date as Date);

    if (checkRentStartDate < today) {
        throw new Error("Rent started date must be in the future!");
    }


    if (String(availability_status) !== "available") {
        throw new Error("Vehicle already booked!");
    };

    const numberOfDays: number = calculateNumberOfDay(rent_start_date as Date, rent_end_date as Date);

    const totalPrice = daily_rent_price as number * numberOfDays;

    await pool.query(
        `UPDATE vehicles SET availability_status= 'booked' WHERE id=$1 RETURNING *`,
        [vehicle_id]
    );


    const result = await pool.query(
        `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
    );
    return result;
}


const getBookings = async (userRole: string, userId: string) => {

    if (userRole === ROLE.ADMIN) {
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
        FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.customer_id = $1 ORDER BY b.id DESC
        `, [userId]
    );

    return result;
}


const updateBooking = async (payload: Record<string, unknown>, bookingId: string, currentUserRole: string) => {
    const { status } = payload;

    const bookingsResult = await pool.query(
        `SELECT * FROM bookings WHERE id=$1`,
        [bookingId]
    );

    if (!bookingsResult.rowCount) {
        throw new Error('Booking not found!');
    }

    const booking = bookingsResult.rows[0];

    if (booking.status === status) {
        throw new Error("Can't update booking status!");
    }

    try {

        if (currentUserRole === ROLE.CUSTOMER && status === 'cancelled') {
            const today = new Date();
            const bookingStartDate = new Date(booking.rent_start_date);

            if (today >= bookingStartDate) {
                throw new Error("Booking cannot be canceled after start date!");
            }

            const bookingResult = await pool.query(
                `UPDATE bookings SET status= 'cancelled' WHERE id=$1 RETURNING *`,
                [bookingId]
            );

            const { vehicle_id } = bookingResult.rows[0];

            await pool.query(
                `UPDATE vehicles SET availability_status= 'available' WHERE id=$1 RETURNING *
            `,
                [vehicle_id]
            );

            return bookingResult;
        }

        if (currentUserRole === ROLE.ADMIN && status === 'returned') {
            const bookingResult = await pool.query(
                `UPDATE bookings SET status= 'returned' WHERE id=$1 RETURNING vehicle_id`,
                [bookingId]
            );

            const vehicleId = bookingResult.rows[0].vehicle_id;

            await pool.query(
                `UPDATE vehicles SET availability_status= 'available' WHERE id=$1 RETURNING *
            `,
                [vehicleId]
            );

            return bookingResult;
        }
    } catch (err) {
        throw err;
    }
}

export const bookingsServices = {
    createBooking,
    getBookings,
    updateBooking,
}
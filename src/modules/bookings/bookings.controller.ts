import { Request, Response } from "express";
import { bookingsServices } from "./bookings.service";
import { ROLE } from "../../types/role.enum";


const createBooking = async (req: Request, res: Response) => {

    try {
        const result = await bookingsServices.createBooking(req.body);

        if (!result?.rowCount) {
            throw new Error("Vehicle already booked!");
        }

        res.status(201).json({
            success: true,
            message: "Booking registered successfully",
            data: result.rows[0],
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


const getBookings = async (req: Request, res: Response) => {
    const userRole = req.user?.role;
    const userId = req.user?.id;
    try {
        const result = await bookingsServices.getBookings(userRole, userId);
        let data;
        if (userRole === ROLE.ADMIN) {

            data = result.rows.map(d => {
                const { id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, customer_name, customer_email, vehicle_name, registration_number } = d;

                return { id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, customer: { customer_name, customer_email }, vehicle: { vehicle_name, registration_number } };
            });

        } else {
            data = result.rows.map(d => {
                const { id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, vehicle_name, registration_number } = d;

                return { id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, vehicle: { vehicle_name, registration_number } };
            });
        }

        if (result.rows.length === 0) {
            res.status(200).json({
                success: true,
                message: "No bookings Found!",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: data,
            });
        }

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const updateBooking = async (req: Request, res: Response) => {
    const bookingId = req.params?.bookingId;
    const currentUserRole = req.user?.role;

    try {
        const result = await bookingsServices.updateBooking(req.body, bookingId as string, currentUserRole as string);

        if (!result?.rowCount) {
            throw new Error("Can't update booking status!")
        }

        res.status(200).json({
            success: true,
            message: "Booking Status Updated Successfully.",
            data: result?.rows[0]
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


export const bookingsController = {
    createBooking,
    getBookings,
    updateBooking
}
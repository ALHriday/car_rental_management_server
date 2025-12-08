import { Request, Response } from "express";
import { bookingsServices } from "./bookings.service";


const createBooking = async (req: Request, res: Response) => {

    try {
        const result = await bookingsServices.createBooking(req.body);

        if (!result?.rows.length) {
            res.status(400).json({
                success: false,
                message: "Vehicle already booked!",
                data: result?.rows[0],
            });
        }

        res.status(201).json({
            success: true,
            message: "Booking registered successfully",
            data: result?.rows[0],
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


const getBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.getBookings();

        const data = result.rows.map(d => {
            const { id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, customer_name, customer_email, vehicle_name, registration_number } = d;

            const output = { id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, customer: { customer_name, customer_email }, vehicle: { vehicle_name, registration_number } };

            return output;
        });

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
const getBookingCustomer = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.getBookingCustomer();

        const data = result.rows.map(d => {
            const { id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, vehicle_name, registration_number } = d;

            const output = { id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, vehicle: { vehicle_name, registration_number } };

            return output;
        });

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
    const id = req.params?.id;
    try {
        const result = await bookingsServices.updateBooking(req.body, id as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Sorry Can't Update Booking!",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Booking Updated Successfully.",
                data: result.rows[0],
            });
        }


    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


export const bookingsController = {
    getBookings,
    createBooking,
    updateBooking,
    getBookingCustomer,
}
import express from "express"
import auth from "../../middleware/auth";
import { bookingsController } from "./bookings.controller";

const router = express.Router();

router.get('/bookings', auth('admin'), bookingsController.getBookings);
router.get('/bookings', auth('customer'), bookingsController.getBookingCustomer);
router.post('/bookings', bookingsController.createBooking);
router.put('/bookings/:id', auth('admin', 'customer'), bookingsController.updateBooking);


export const bookingsRoutes = router;
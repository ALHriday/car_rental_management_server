import express from "express"
import auth from "../../middleware/auth";
import { bookingsController } from "./bookings.controller";
import { ROLE } from "../../types/role.enum";

const router = express.Router();

router.post('/bookings', auth(ROLE.CUSTOMER, ROLE.ADMIN), bookingsController.createBooking);
router.get('/bookings', auth(ROLE.ADMIN, ROLE.CUSTOMER), bookingsController.getBookings);
router.put('/bookings/:bookingId', auth(ROLE.CUSTOMER, ROLE.ADMIN), bookingsController.updateBooking);


export const bookingsRoutes = router;
import express, { Request, Response } from "express"
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/vehicles', auth('admin'), vehiclesController.createVehicles);
router.get('/vehicles', vehiclesController.getVehicles);
router.get('/vehicles/:id', vehiclesController.getSingleVehicle);
router.put('/vehicles/:id', auth('admin', 'customer'), vehiclesController.updateVehicles);

export const vehiclesRoutes = router;
import express, { Request, Response } from "express"
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";
import { ROLE } from "../../types/role.enum";

const router = express.Router();

router.post('/vehicles', auth(ROLE.ADMIN), vehiclesController.createVehicles);
router.get('/vehicles', vehiclesController.getAllVehicles);
router.get('/vehicles/:vehicleId', vehiclesController.getSingleVehicle);
router.put('/vehicles/:vehicleId', auth(ROLE.ADMIN), vehiclesController.updateVehicles);

router.delete('/vehicles/:vehicleId', auth(ROLE.ADMIN), vehiclesController.deleteVehicle);

export const vehiclesRoutes = router;
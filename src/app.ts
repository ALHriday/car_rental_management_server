import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./auth/auth.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";

const app = express();
app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
    res.send({
        status: true,
        message: 'Car Rental Management app is running...'
    })
})

app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', vehiclesRoutes);


export default app;
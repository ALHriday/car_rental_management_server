import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";


const createVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.createVehicles(req.body);

        res.status(201).json({
            success: true,
            message: "Vehicles registered successfully.",
            data: result.rows[0],
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getVehicles();

        if (result.rows.length === 0) {
            res.status(200).json({
                success: true,
                message: "No Vehicles Found!",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully.",
                data: result.rows,
            });
        }

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const getSingleVehicle = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const result = await vehiclesServices.getSingleVehicle(id as string);

        if (result.rows.length === 0) {
            res.status(200).json({
                success: true,
                message: "No Data Found!",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully",
                data: result.rows,
            });
        }

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const updateVehicles = async (req: Request, res: Response) => {
    const id = req.params?.id;
    try {
        const result = await vehiclesServices.updateVehicles(req.body, id as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No Vehicles Found.",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicles Updated Successfully.",
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


export const vehiclesController = {
    createVehicles,
    getVehicles,
    getSingleVehicle,
    updateVehicles,
}
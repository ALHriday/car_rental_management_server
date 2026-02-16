import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();

        if (result.rows.length === 0) {
            res.status(200).json({
                success: true,
                message: "No Data Found!",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
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


const updateUser = async (req: Request, res: Response) => {
    const userId = req.params?.userId;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    try {
        const result = await userServices.updateUser(req.body, userId as string, currentUserId as string, currentUserRole as string);

        if (!req.user) {
            throw new Error('unAuthorized');
        }

        if (result?.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found.",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User Updated Successfully.",
                data: result?.rows[0],
            });
        }


    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params?.userId;
    try {
        const result = await userServices.deleteUser(userId as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Data Not Found.",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User Deleted Successful.",
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


export const userControllers = {
    getUser,
    updateUser,
    deleteUser
}


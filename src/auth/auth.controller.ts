import { Request, Response } from "express";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {

    try {
        const result = await authServices.createUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0],
        });

    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {

        const result = await authServices.login(email, password);

        if (!result) {
            res.status(401).json({
                success: false,
                message: "LogIn unSuccessful!",
                data: [],
            })
        }
        res.status(200).json({
            success: true,
            message: "LogIn Successful.",
            data: result,
        });


    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

export const authControllers = {
    createUser,
    loginUser,
}
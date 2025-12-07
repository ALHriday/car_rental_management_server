import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeaders = req.headers.authorization;

        if (!authHeaders) {
            return res.status(401).json({ message: 'unAuthorized' });
        }
        const token = authHeaders?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'You are not Allowed!!!' })
        }
        try {
            const decoded = Jwt.verify(token as string, config.jwt_secret as string) as JwtPayload;
            req.user = decoded;

            if (roles.length && !roles.includes(decoded?.role)) {
                res.status(401).json({ message: "unAuthorized" })
            }

            next();
        } catch (error: any) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
}

export default auth;
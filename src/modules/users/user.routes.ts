import express from "express"
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { ROLE } from "../../types/role.enum";

const router = express.Router();

router.get('/users', auth(ROLE.ADMIN), userControllers.getUser);
router.put('/users/:userId', auth(ROLE.CUSTOMER, ROLE.ADMIN), userControllers.updateUser);
router.delete('/users/:userId', auth(ROLE.ADMIN), userControllers.deleteUser);

export const userRoutes = router;
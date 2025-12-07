import express from "express"
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/users', auth('admin'), userControllers.getUser);
router.put('/users/:id', auth('admin', 'customer'), userControllers.updateUser);
router.delete('/users/:id', auth('admin'), userControllers.deleteUser);

export const userRoutes = router;
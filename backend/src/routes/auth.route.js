import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {login, signout, signup, updateProfile, checkAuth} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signout", signout);
router.post("/login", login);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check-auth", protectRoute, checkAuth);

export default router
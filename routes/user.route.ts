import express, { Router } from "express";
import { signup, login, session } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/session", isAuthenticated, session);

export default router;

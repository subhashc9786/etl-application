import { Router } from "express";
import {findUserForFogotpassword, forgotPassword, loginUser, registerUser} from "../controllers/user.controller.js";

const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/finduser/forgotpassword").post(findUserForFogotpassword);
router.route("/forgotpassword").post(forgotPassword);


export default router;
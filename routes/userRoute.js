import express from "express";
import userController from "../controllers/userController.js";
import checkUserAuth from "../middleware/authMiddleware.js";
const router = express.Router();
import cors from "cors";

// object instance for userController
const users = new userController();

// Router level middleware
router.use(cors());
router.use("/changePassword", checkUserAuth);

// stayLogin middleware
router.use("/stayLogin", checkUserAuth);
// @public routes
router.get("/", users.getInformation);
router.post("/register", users.userRegistration);
router.post("/login", users.userLogin);
router.post("/reset-password", users.sendUserResetPassword);
// router.post("/register", userController.userRegistration);
// reset password after reset email link
router.post(
  "/reset-password-after-email/:id/:token",
  users.userResetPasswordAfterEmail
);

// @private routes
router.post("/changePassword", users.changeUserPassword);

router.get("/stayLogin", users.stayLoginUser);
export default router;

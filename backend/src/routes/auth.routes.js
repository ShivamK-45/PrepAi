const {Router } = require('express');
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middelwares/auth.middleware");
const tokenBlacklistModel = require("../models/blacklist.model");


const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

authRouter.post("/register", authController.registerUserController);
 
/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @post GET /api/auth/logout
 * @desc clear token from user cookie and add token to blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user details, expects token in the cookie
 * @access Private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);


module.exports = authRouter;
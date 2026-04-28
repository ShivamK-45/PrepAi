const express = require('express');
const authMiddleware = require('../middelwares/auth.middleware');
const mockInterviewController = require('../controllers/mockInterview.controller');
const upload = require('../middelwares/file.middleware');

const mockInterviewRouter = express.Router();

/**
 * @route POST /api/mock-interview/initialize
 * @description Initialize a new mock interview session, generate questions
 * @access Private
 */
mockInterviewRouter.post(
    "/initialize",
    authMiddleware.authUser,
    upload.single('resume'),
    mockInterviewController.initializeMockInterviewController
);

/**
 * @route POST /api/mock-interview/save-answer
 * @description Save user's answer to a question (no scoring yet)
 * @access Private
 */
mockInterviewRouter.post(
    "/save-answer",
    authMiddleware.authUser,
    mockInterviewController.saveAnswerController
);

/**
 * @route POST /api/mock-interview/complete
 * @description Complete the interview, calculate scores and generate feedback
 * @access Private
 */
mockInterviewRouter.post(
    "/complete",
    authMiddleware.authUser,
    mockInterviewController.completeMockInterviewController
);

/**
 * @route GET /api/mock-interview/session/:sessionId
 * @description Get mock interview session by ID
 * @access Private
 */
mockInterviewRouter.get(
    "/session/:sessionId",
    authMiddleware.authUser,
    mockInterviewController.getMockSessionByIdController
);

/**
 * @route GET /api/mock-interview/sessions
 * @description Get all mock interview sessions for logged in user
 * @access Private
 */
mockInterviewRouter.get(
    "/sessions",
    authMiddleware.authUser,
    mockInterviewController.getAllMockSessionsController
);

module.exports = mockInterviewRouter;

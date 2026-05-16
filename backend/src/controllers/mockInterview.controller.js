const { PDFParse } = require('pdf-parse');
const mockInterviewSessionModel = require('../models/mockInterviewSession.model');
const { generateMockInterviewQuestions, evaluateAllAnswers, generateFinalFeedback } = require('../services/ai.service');

/**
 * @description Controller to initialize a mock interview session
 * Creates a new session, generates questions, and returns session ID + first question
 */
async function initializeMockInterviewController(req, res) {
    try {
        let resumeText = "";

        // Parse resume PDF if uploaded
        if (req.file) { 
            const parser = new PDFParse({ data: req.file.buffer, verbosity: 0 });
            const resumeContent = await parser.getText();
            resumeText = resumeContent.text;
        }

        const { jobDescription, jobRole, duration } = req.body;

        // Validate required fields
        if (!resumeText) {
            return res.status(400).json({
                message: "Resume is required"
            });
        }

        if (!jobRole) {
            return res.status(400).json({
                message: "Job role is required"
            });
        }

        // Determine number of questions based on duration
        const questionCount = duration === 10 ? 6 : duration === 20 ? 10 : 8; // default 15 min = 8 questions

        // Generate questions using AI
        const questions = await generateMockInterviewQuestions({
            resume: resumeText,
            jobRole,
            jobDescription,
            questionCount
        });

        // Create new session in database
        const mockSession = await mockInterviewSessionModel.create({
            userId: req.user.id,
            jobDescription: jobDescription || "",
            jobRole,
            resume: resumeText,
            questions: questions.map((q, index) => ({
                questionText: q.question,
                category: q.category,
                askedAt: new Date()
            })),
            sessionStatus: "ongoing",
            startTime: new Date()
        });

        res.status(201).json({
            message: "Mock interview session initialized successfully",
            sessionId: mockSession._id,
            questions: questions,
            firstQuestion: questions[0]
        });

    } catch (error) {
        console.error("Error initializing mock interview:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

// /**
//  * @description Controller to evaluate user's answer to a question
//  * Analyzes transcript, calculates scores, provides feedback
//  */
// async function evaluateAnswerController(req, res) {
//     try {
//         const { sessionId, questionIndex, transcript, duration } = req.body;

//         // Validate inputs
//         if (!sessionId || questionIndex === undefined || !transcript) {
//             return res.status(400).json({
//                 message: "Session ID, question index, and transcript are required"
//             });
//         }

//         // Fetch session
//         const session = await mockInterviewSessionModel.findOne({
//             _id: sessionId,
//             userId: req.user.id
//         });

//         if (!session) {
//             return res.status(404).json({
//                 message: "Mock interview session not found"
//             });
//         }

//         // Get the question being answered
//         const question = session.questions[questionIndex];
//         if (!question) {
//             return res.status(400).json({
//                 message: "Invalid question index"
//             });
//         }

//         // Calculate speaking metrics
//         const wordCount = transcript.trim().split(/\s+/).length;
//         const speakingPace = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

//         // Count filler words (um, uh, like, you know, actually, basically, etc.)
//         const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'sort of', 'kind of'];
//         const fillerWordCount = fillerWords.reduce((count, word) => {
//             const regex = new RegExp(`\\b${word}\\b`, 'gi');
//             return count + (transcript.match(regex) || []).length;
//         }, 0);

//         // Evaluate answer using AI
//         const evaluation = await evaluateMockAnswer({
//             question: question.questionText,
//             category: question.category,
//             answer: transcript,
//             resume: session.resume,
//             jobRole: session.jobRole
//         });

//         // Create answer object
//         const answer = {
//             questionIndex,
//             transcript,
//             duration: duration || 0,
//             wordCount,
//             fillerWordCount,
//             speakingPace,
//             scores: evaluation.scores,
//             aiFeedback: evaluation.feedback
//         };

//         // Add answer to session
//         session.answers.push(answer);
//         await session.save();

//         // Determine next question
//         const nextQuestionIndex = questionIndex + 1;
//         const nextQuestion = session.questions[nextQuestionIndex] || null;

//         res.status(200).json({
//             message: "Answer evaluated successfully",
//             scores: evaluation.scores,
//             feedback: evaluation.feedback,
//             nextQuestion: nextQuestion ? {
//                 index: nextQuestionIndex,
//                 question: nextQuestion.questionText,
//                 category: nextQuestion.category
//             } : null,
//             isComplete: !nextQuestion
//         });

//     } catch (error) {
//         console.error("Error evaluating answer:", error);
//         res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// }


/**
 * @description Controller to save user's answer (no scoring yet)
 * Just stores transcript and moves to next question
 */
async function saveAnswerController(req, res) {
    try {
        const { sessionId, questionIndex, transcript, duration } = req.body;

        // Validate inputs
        if (!sessionId || questionIndex === undefined || !transcript) {
            return res.status(400).json({
                message: "Session ID, question index, and transcript are required"
            });
        }

        // Fetch session
        const session = await mockInterviewSessionModel.findOne({
            _id: sessionId,
            userId: req.user.id
        });

        if (!session) {
            return res.status(404).json({
                message: "Mock interview session not found"
            });
        }

        // Calculate basic metrics only (no AI evaluation)
        const wordCount = transcript.trim().split(/\s+/).length;
        const speakingPace = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

        // Count filler words
        const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'sort of', 'kind of'];
        const fillerWordCount = fillerWords.reduce((count, word) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            return count + (transcript.match(regex) || []).length;
        }, 0);

        // Save answer WITHOUT scores (will be calculated at end)
        const answer = {
            questionIndex,
            transcript,
            duration: duration || 0,
            wordCount,
            fillerWordCount,
            speakingPace,
            scores: {
                clarity: 0,
                technical: 0,
                confidence: 0,
                completeness: 0
            },                   // Placeholder, will be filled at completion
            aiFeedback: ""      // Will be filled at completion
        };

        session.answers.push(answer);
        await session.save();

        // Get next question
        const nextQuestionIndex = questionIndex + 1;
        const nextQuestion = session.questions[nextQuestionIndex] || null;

        res.status(200).json({
            message: "Answer saved successfully",
            nextQuestion: nextQuestion ? {
                index: nextQuestionIndex,
                question: nextQuestion.questionText,
                category: nextQuestion.category
            } : null,
            isComplete: !nextQuestion
        });

    } catch (error) {
        console.error("Error saving answer:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// /**
//  * @description Controller to complete mock interview session
//  * Calculates final scores, generates strengths/improvements, updates session status
//  */
// async function completeMockInterviewController(req, res) {
//     try {
//         const { sessionId } = req.body;

//         // Fetch session
//         const session = await mockInterviewSessionModel.findOne({
//             _id: sessionId,
//             userId: req.user.id
//         });

//         if (!session) {
//             return res.status(404).json({
//                 message: "Mock interview session not found"
//             });
//         }

//         if (session.sessionStatus === "completed") {
//             return res.status(400).json({
//                 message: "Session already completed"
//             });
//         }


//         // Evaluate ALL answers using AI (batch evaluation)
//         const evaluatedAnswers = await evaluateAllAnswers({
//             questions: session.questions,
//             answers: session.answers,
//             resume: session.resume,
//             jobRole: session.jobRole
//         });

//         // Update session answers with scores and feedback
//         session.answers = evaluatedAnswers;

//         // Calculate average scores from evaluated answers
//         const avgScores = evaluatedAnswers.reduce((acc, answer) => {
//             acc.clarity += answer.scores.clarity;
//             acc.technical += answer.scores.technical;
//             acc.confidence += answer.scores.confidence;
//             acc.completeness += answer.scores.completeness;
//             return acc;
//         }, { clarity: 0, technical: 0, confidence: 0, completeness: 0 });


//         const answerCount = session.answers.length;
//         const finalScore = {
//             communication: Math.round((avgScores.clarity / answerCount) * 10),
//             technical: Math.round((avgScores.technical / answerCount) * 10),
//             confidence: Math.round((avgScores.confidence / answerCount) * 10),
//             overall: Math.round(((avgScores.clarity + avgScores.technical + avgScores.confidence + avgScores.completeness) / (answerCount * 4)) * 10)
//         };

//         // Generate detailed feedback using AI
//         const feedback = await generateFinalFeedback({
//             jobRole: session.jobRole,
//             answers: session.answers,
//             questions: session.questions,
//             finalScore
//         });

//         // Update session
//         session.finalScore = finalScore;
//         session.strengths = feedback.strengths;
//         session.improvements = feedback.improvements;
//         session.detailedFeedback = feedback.detailedFeedback;
//         session.sessionStatus = "completed";
//         session.endTime = new Date();
//         session.totalDuration = Math.round((session.endTime - session.startTime) / 1000); // in seconds

//         await session.save();

//         res.status(200).json({
//             message: "Mock interview completed successfully",
//             finalScore,
//             strengths: feedback.strengths,
//             improvements: feedback.improvements,
//             detailedFeedback: feedback.detailedFeedback
//         });

//     } catch (error) {
//         console.error("Error completing mock interview:", error);
//         res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// }


/**
 * @description Controller to complete mock interview session
 * Calculates final scores, generates strengths/improvements, updates session status
 */
async function completeMockInterviewController(req, res) {
    try {
        const { sessionId } = req.body;

        // Fetch session
        const session = await mockInterviewSessionModel.findOne({
            _id: sessionId,
            userId: req.user.id
        });

        if (!session) {
            return res.status(404).json({
                message: "Mock interview session not found"
            });
        }

        if (session.sessionStatus === "completed") {
            return res.status(400).json({
                message: "Session already completed"
            });
        }

        // Evaluate ALL answers using AI (batch evaluation)
        const evaluatedAnswers = await evaluateAllAnswers({
            questions: session.questions,
            answers: session.answers,
            resume: session.resume,
            jobRole: session.jobRole
        });

        // Calculate average scores from evaluated answers
        const avgScores = evaluatedAnswers.reduce((acc, answer) => {
            acc.clarity += answer.scores.clarity || 0;
            acc.technical += answer.scores.technical || 0;
            acc.confidence += answer.scores.confidence || 0;
            acc.completeness += answer.scores.completeness || 0;
            return acc;
        }, { clarity: 0, technical: 0, confidence: 0, completeness: 0 });

        const answerCount = evaluatedAnswers.length;
        
        // Calculate final score (convert 0-10 scale to 0-100)
        const finalScore = {
            communication: Math.round((avgScores.clarity / answerCount) * 10),
            technical: Math.round((avgScores.technical / answerCount) * 10),
            confidence: Math.round((avgScores.confidence / answerCount) * 10),
            overall: Math.round(((avgScores.clarity + avgScores.technical + avgScores.confidence + avgScores.completeness) / (answerCount * 4)) * 10)
        };

        // Generate detailed feedback using AI
        const feedback = await generateFinalFeedback({
            jobRole: session.jobRole,
            answers: evaluatedAnswers,
            questions: session.questions,
            finalScore
        });

        // Update session with evaluated answers
        session.answers = evaluatedAnswers;
        session.finalScore = finalScore;
        session.strengths = feedback.strengths;
        session.improvements = feedback.improvements;
        session.detailedFeedback = feedback.detailedFeedback;
        session.sessionStatus = "completed";
        session.endTime = new Date();
        session.totalDuration = Math.round((session.endTime - session.startTime) / 1000);

        await session.save();

        res.status(200).json({
            message: "Mock interview completed successfully",
            finalScore,
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            detailedFeedback: feedback.detailedFeedback
        });

    } catch (error) {
        console.error("Error completing mock interview:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}



/**
 * @description Controller to get mock interview session by ID
 */
async function getMockSessionByIdController(req, res) {
    try {
        const { sessionId } = req.params;

        const session = await mockInterviewSessionModel.findOne({
            _id: sessionId,
            userId: req.user.id
        });

        if (!session) {
            return res.status(404).json({
                message: "Mock interview session not found"
            });
        }

        res.status(200).json({
            message: "Mock interview session fetched successfully",
            session
        });

    } catch (error) {
        console.error("Error fetching mock session:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

/**
 * @description Controller to get all mock interview sessions for logged in user
 */
async function getAllMockSessionsController(req, res) {
    try {
        const sessions = await mockInterviewSessionModel
            .find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -jobDescription -questions -answers -__v");

        res.status(200).json({
            message: "Mock interview sessions fetched successfully",
            sessions
        });

    } catch (error) {
        console.error("Error fetching mock sessions:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

module.exports = {
    initializeMockInterviewController,
    saveAnswerController,
    completeMockInterviewController,
    getMockSessionByIdController,
    getAllMockSessionsController
};

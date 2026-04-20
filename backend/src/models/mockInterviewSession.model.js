/**
 * Mock Interview Session Schema
 * 
 * - userId: Reference to User
 * - jobDescription: String (optional - if user pastes full JD)
 * - jobRole: String (e.g., "Full Stack Developer", "DevOps Engineer")
 * - resume: String (parsed text)
 * - sessionStatus: String (enum: "ongoing", "completed", "abandoned")
 * - startTime: Date
 * - endTime: Date
 * - totalDuration: Number (in seconds)
 * 
 * - questions: [{
 *     questionText: String,
 *     category: String (enum: "technical", "behavioral", "project"),
 *     askedAt: Date
 * }]
 * 
 * - answers: [{
 *     questionIndex: Number,
 *     transcript: String (what user said),
 *     duration: Number (seconds), 
 *     wordCount: Number,
 *     fillerWordCount: Number,
 *     speakingPace: Number (words per minute),
 *     scores: {
 *         clarity: Number (0-10),
 *         technical: Number (0-10),
 *         confidence: Number (0-10),
 *         completeness: Number (0-10)
 *     },
 *     aiFeedback: String
 * }]
 * 
 * - finalScore: {
 *     overall: Number (0-100),
 *     communication: Number (0-100),
 *     technical: Number (0-100),
 *     confidence: Number (0-100)
 * }
 * 
 * - strengths: [String]
 * - improvements: [String]
 * - detailedFeedback: String
 */

const mongoose = require('mongoose');

// Sub-schema for questions
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, "Question text is required"]
    },
    category: {
        type: String,
        enum: ["technical", "behavioral", "project"],
        required: [true, "Question category is required"]
    },
    askedAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
});

// Sub-schema for answer scores
const answerScoresSchema = new mongoose.Schema({
    clarity: {
        type: Number,
        min: 0,
        max: 10,
        required: [true, "Clarity score is required"]
    },
    technical: {
        type: Number,
        min: 0,
        max: 10,
        required: [true, "Technical score is required"]
    },
    confidence: {
        type: Number,
        min: 0,
        max: 10,
        required: [true, "Confidence score is required"]
    },
    completeness: {
        type: Number,
        min: 0,
        max: 10,
        required: [true, "Completeness score is required"]
    }
}, {
    _id: false
});

// Sub-schema for answers
const answerSchema = new mongoose.Schema({
    questionIndex: {
        type: Number,
        required: [true, "Question index is required"]
    },
    transcript: {
        type: String,
        required: [true, "Transcript is required"]
    },
    duration: {
        type: Number,
        required: [true, "Answer duration is required"]
    },
    wordCount: {
        type: Number,
        required: [true, "Word count is required"]
    },
    fillerWordCount: {
        type: Number,
        default: 0
    },
    speakingPace: {
        type: Number,
        required: [true, "Speaking pace is required"]
    },
    scores: answerScoresSchema,
    aiFeedback: {
        type: String,
        required: [true, "AI feedback is required"]
    }
}, {
    _id: false
});

// Sub-schema for final scores
const finalScoreSchema = new mongoose.Schema({
    overall: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, "Overall score is required"]
    },
    communication: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, "Communication score is required"]
    },
    technical: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, "Technical score is required"]
    },
    confidence: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, "Confidence score is required"]
    }
}, {
    _id: false
});

// Main schema
const mockInterviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User ID is required"]
    },
    jobDescription: {
        type: String
    },
    jobRole: {
        type: String,
        required: [true, "Job role is required"]
    },
    resume: {
        type: String,
        required: [true, "Resume is required"]
    },
    sessionStatus: {
        type: String,
        enum: ["ongoing", "completed", "abandoned"],
        default: "ongoing"
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    totalDuration: {
        type: Number,
        default: 0
    },
    questions: [questionSchema],
    answers: [answerSchema],
    finalScore: finalScoreSchema,
    strengths: [{
        type: String
    }],
    improvements: [{
        type: String
    }],
    detailedFeedback: {
        type: String
    }
}, {
    timestamps: true
});

const mockInterviewSessionModel = mongoose.model("MockInterviewSessions", mockInterviewSessionSchema);

module.exports = mockInterviewSessionModel;
const { PDFParse } = require('pdf-parse');
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res) {
    try {
        let resumeText = "";
 
        // If a resume file was uploaded, parse the PDF
        if (req.file) {
            const parser = new PDFParse({ data: req.file.buffer, verbosity: 0 });
            const resumeContent = await parser.getText();
            resumeText = resumeContent.text;
        }

        const { selfDescription, jobDescription } = req.body;

        // Reject if neither resume nor self description is provided
        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Resume or self description is required"
            });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
} catch (error) {
    console.error("Error fetching interview report:", error);
    res.status(500).json({
        message: "Server Error",
        error: error.message
    });
}}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try{
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
} catch (error) {
    console.error("Error generating resume PDF:", error);
    res.status(500).json({
        message: "Server Error",
        error: error.message
    });
}}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}

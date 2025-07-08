const fs = require("fs");
const pdfParse = require("pdf-parse");
const path = require("path");
const PDFDocument = require("pdfkit");
const { analyzeResume, generateCoverLetter } = require("../services/geminiService");
const { fetchJobsByRole } = require("../services/jobSearchService");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Analyze Resume from PDF or Text
const uploadResume = async (req, res) => {
  try {
    const pdfPath = req.file?.path;
    const resumeTextFromBody = req.body.resumeText;

    let resumeText = "";

    if (pdfPath) {
      const dataBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdfParse(dataBuffer);
      resumeText = pdfData.text;
    } else if (resumeTextFromBody) {
      resumeText = resumeTextFromBody;
    } else {
      return res.status(400).json({ message: "No resume data provided" });
    }

    const analysis = await analyzeResume(resumeText);

    let jobs = [];
    if (analysis?.job_roles?.length) {
      const role = analysis.job_roles[0];
      jobs = await fetchJobsByRole(role);
    }

    res.status(200).json({ analysis, jobs });
  } catch (error) {
    console.error("Resume Upload Error:", error.message);
    res.status(500).json({ message: "Failed to analyze resume" });
  }
};

// ✅ Generate Cover Letter and Return as PDF
const generateCoverLetterPDF = async (req, res) => {
  const { resumeText, jobTitle, companyName } = req.body;

  if (!resumeText || !jobTitle || !companyName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const coverLetterText = await generateCoverLetter(resumeText, jobTitle, companyName);

    // Generate PDF using pdfkit
    const doc = new PDFDocument();
    const filename = `${jobTitle.replace(/ /g, "_")}_CoverLetter.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);
    doc.font("Times-Roman").fontSize(12).text(coverLetterText, {
      align: "left",
    });
    doc.end();
  } catch (error) {
    console.error("Cover Letter Error:", error.message);
    res.status(500).json({ message: "Failed to generate cover letter" });
  }
};

module.exports = {
  uploadResume,
  generateCoverLetterPDF,
};

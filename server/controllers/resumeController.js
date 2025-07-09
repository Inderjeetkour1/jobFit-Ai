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

    // ✅ If fromFallback exists, return it to frontend
    const response = {
      analysis,
      jobs,
    };

    if (analysis.fromFallback) {
      response.fromFallback = true;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Resume Upload Error:", error.message);
    res.status(500).json({ message: "Failed to analyze resume" });
  }
};

// ✅ Generate Cover Letter and Return as Plain Text (for preview)
const generateCoverLetterPreview = async (req, res) => {
  const { resumeText, jobTitle, companyName } = req.body;

  if (!resumeText || !jobTitle || !companyName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await generateCoverLetter(resumeText, jobTitle, companyName);

    // It may return either a string or an object with { coverLetter, fromFallback }
    const coverLetter = typeof result === "string" ? result : result.coverLetter;
    const fromFallback = result?.fromFallback ?? false;

    res.status(200).json({ coverLetter, fromFallback });
  } catch (error) {
    console.error("Cover Letter Error:", error.message);
    res.status(500).json({ message: "Failed to generate cover letter" });
  }
};

// ✅ Generate and Return Cover Letter as Downloadable PDF
const generateCoverLetterPDF = async (req, res) => {
  const { resumeText, jobTitle, companyName } = req.body;

  if (!resumeText || !jobTitle || !companyName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await generateCoverLetter(resumeText, jobTitle, companyName);
    const coverLetter = typeof result === "string" ? result : result.coverLetter;

    const doc = new PDFDocument();
    const filename = `${jobTitle.replace(/ /g, "_")}_CoverLetter.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);
    doc.font("Times-Roman").fontSize(12).text(coverLetter, { align: "left" });
    doc.end();
  } catch (error) {
    console.error("Cover Letter PDF Error:", error.message);
    res.status(500).json({ message: "Failed to generate cover letter PDF" });
  }
};

module.exports = {
  uploadResume,
  generateCoverLetterPreview,
  generateCoverLetterPDF,
};

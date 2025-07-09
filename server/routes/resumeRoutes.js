const fs = require("fs");
const path = require("path");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const express = require("express");

const {
  analyzeResume,
  generateCoverLetter
} = require("../services/geminiService");

const { fetchJobsByRole } = require("../services/jobSearchService");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * ✅ 1. Upload PDF & Analyze Resume
 */
router.post("/uploadFile", upload.single("resume"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    const analysis = await analyzeResume(resumeText);
    analysis.rawText = resumeText; // ✅ Add raw text for use in cover letter

    let jobs = [];
    if (analysis?.job_roles?.length) {
      const role = analysis.job_roles[0];
      jobs = await fetchJobsByRole(role);
    }

    res.status(200).json({
      analysis,
      jobs,
      fromFallback: analysis.fromFallback || false
    });
  } catch (err) {
    console.error("Error analyzing PDF:", err.message);
    res.status(500).json({ message: "Failed to analyze PDF" });
  }
});

/**
 * ✅ 2. Upload Plain Text Resume
 */
router.post("/upload", async (req, res) => {
  const { resumeText } = req.body;
  try {
    const analysis = await analyzeResume(resumeText);
    analysis.rawText = resumeText; // ✅ Consistent with PDF fallback

    let jobs = [];
    if (analysis?.job_roles?.length) {
      const role = analysis.job_roles[0];
      jobs = await fetchJobsByRole(role);
    }

    res.status(200).json({
      analysis,
      jobs,
      fromFallback: analysis.fromFallback || false
    });
  } catch (err) {
    console.error("Text analysis failed:", err.message);
    res.status(500).json({ message: "Failed to analyze resume text" });
  }
});

/**
 * ✅ 3. Generate Cover Letter
 */
router.post("/cover-letter", async (req, res) => {
  const { resumeText, jobTitle, companyName } = req.body;

  if (!resumeText || !jobTitle || !companyName) {
    return res.status(400).json({ message: "Missing resume text or job details" });
  }

  try {
    const result = await generateCoverLetter(resumeText, jobTitle, companyName);

    const coverLetter = typeof result === "string" ? result : result.coverLetter;
    const fromFallback = typeof result === "object" && result.fromFallback;

    res.status(200).json({ coverLetter, fromFallback });
  } catch (err) {
    console.error("Cover Letter Generation Error:", err.message);
    res.status(500).json({ message: "Failed to generate cover letter" });
  }
});

module.exports = router;

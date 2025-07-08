const { analyzeResume } = require('../services/geminiService');

const uploadResume = async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({ message: 'Resume text is required' });
  }

  try {
    console.log("Analyzing resume with Gemini...");
    const analysis = await analyzeResume(resumeText);

    if (!analysis) {
      return res.status(500).json({ message: "AI failed to generate structured analysis." });
    }
    console.log("ANALYSIS:", analysis);
    res.status(200).json({ analysis });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ message: "Failed to analyze resume" });
  }
};

module.exports = { uploadResume };

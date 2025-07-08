const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
You are a smart resume analyzer. Analyze the following resume and return JSON format like this:

{
  "summary": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "job_roles": ["...", "..."]
}

Resume:
${resumeText}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      return json;
    } catch (parseErr) {
      console.error("❌ JSON Parsing Failed. Gemini said:", text);
      throw new Error("Invalid JSON response from Gemini.");
    }

  } catch (apiError) {
    console.error("❌ Gemini API Error:", apiError.message);

    // 🔁 Use mock fallback if Gemini fails
    return {
      summary: "A highly motivated and detail-oriented developer with a passion for solving problems using modern web technologies.",
      strengths: ["JavaScript", "React", "Node.js", "REST APIs", "Team Collaboration"],
      improvements: ["Add CI/CD knowledge", "Contribute to open source", "Master Docker"],
      job_roles: ["Frontend Developer", "Full Stack Developer", "Software Engineer"]
    };
  }
};


/**
 * ✅ Generate Cover Letter using Gemini
 */
const generateCoverLetter = async (resumeText, jobTitle, companyName) => {
  try{
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
You are a professional job applicant assistant.

Based on the following resume, write a personalized, professional cover letter
for the job title "${jobTitle}" at "${companyName}". Keep it concise, enthusiastic, and confident.

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return await response.text();
} catch (err) {
    console.error("Cover Letter Generation Error:", err.message);
// 🔁 Mock fallback
    return `
Dear Hiring Manager,

I'm excited to apply for the ${jobTitle} role at ${companyName}. With strong experience in web development and a passion for building clean, scalable solutions, I believe I can contribute effectively to your team.

I’d welcome the opportunity to discuss how I can support your goals.

Sincerely,
[Your Name]
    `;
  }
};

module.exports = {
  analyzeResume,
  generateCoverLetter, // ✅ Export the new function
};

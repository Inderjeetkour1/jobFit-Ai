const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze Resume using Gemini or fallback
 */
const analyzeResume = async (resumeText, forceFallback = false) => {
  if (forceFallback || !resumeText) {
    return {
      summary: "A versatile and eager software developer with hands-on experience in modern web technologies.",
      strengths: ["JavaScript", "React", "Express", "MongoDB"],
      improvements: ["Add CI/CD", "Build projects with microservices", "Explore cloud deployments"],
      job_roles: ["Frontend Developer", "Full Stack Developer"],
      fromFallback: true,
      rawText: resumeText
    };
  }

  try {
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      json.rawText = resumeText; // ✅ Add raw text for cover letter generation
      return json;
    } catch (err) {
      console.error("❌ JSON Parsing Failed. Gemini said:", text);
      return {
        fromFallback: true,
        summary: "Motivated developer skilled in modern web technologies.",
        strengths: ["JavaScript", "React", "Node.js"],
        improvements: ["Learn Docker", "Contribute to open source"],
        job_roles: ["Frontend Developer", "Full Stack Developer"],
        rawText: resumeText
      };
    }
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
    return {
      fromFallback: true,
      summary: "Motivated developer skilled in modern web technologies.",
      strengths: ["JavaScript", "React", "Node.js"],
      improvements: ["Learn Docker", "Contribute to open source"],
      job_roles: ["Frontend Developer", "Full Stack Developer"],
      rawText: resumeText
    };
  }
};

/**
 * Generate Cover Letter using Gemini or fallback
 */
const generateCoverLetter = async (resumeText, jobTitle, companyName) => {
  try {
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
    const text = await response.text();

    return text;
  } catch (err) {
    console.error("Cover Letter Generation Error:", err.message);

    // ✅ Return a basic fallback cover letter
    return `
Dear Hiring Manager,

I'm excited to apply for the ${jobTitle} role at ${companyName}. With experience in full-stack development and a drive for innovation, I believe I’d make a strong contribution to your team.

Looking forward to the opportunity to connect.

Sincerely,  
[Your Name]
    `;
  }
};

module.exports = {
  analyzeResume,
  generateCoverLetter
};

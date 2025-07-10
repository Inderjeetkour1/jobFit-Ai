import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Spinner from "./components/Spinner";
import AnalysisResult from "./components/AnalysisResult";

const BASE_URL = "";

function Home() {
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [companyName, setCompanyName] = useState("ABC Corp");

  console.log("Using backend API:", BASE_URL);

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !file) {
      return alert("Please upload a resume file or paste your resume text.");
    }

    setLoading(true);
    setAnalysis(null);
    setJobs([]);
    setCoverLetter("");

    try {
      let res;

      if (file) {
        const formData = new FormData();
        formData.append("resume", file);
        res = await fetch(`${BASE_URL}/resume/uploadFile`, {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch(`${BASE_URL}/resume/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText }),
        });
      }

      const data = await res.json();
      setAnalysis(data.analysis);
      setJobs(data.jobs || []);

      if (data.fromFallback) {
        alert("⚠️ Showing fallback results due to AI quota limits.");
      }

      // Ensure we have resume text in state
      if (!resumeText && data.analysis?.rawText) {
        setResumeText(data.analysis.rawText);
      }
    } catch (err) {
      console.error("Analyze Error:", err);
      alert("Failed to get AI analysis. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resumeText.trim() && !file) {
      return alert("Please upload a resume file or paste your resume text.");
    }

    setGeneratingCover(true);
    setCoverLetter("");

    let resumeTextToUse = resumeText;

    try {
      if (!resumeTextToUse && file) {
        const formData = new FormData();
        formData.append("resume", file);
        const res = await fetch(`${BASE_URL}/resume/uploadFile`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        resumeTextToUse = data.analysis?.rawText || "";
        if (!resumeTextToUse) throw new Error("No resume text found in PDF.");
      }

      const res = await fetch(`${BASE_URL}/resume/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeTextToUse,
          jobTitle,
          companyName,
        }),
      });

      const data = await res.json();
      setCoverLetter(data.coverLetter || "Failed to generate cover letter.");

      if (data.fromFallback) {
        alert("⚠️ Showing fallback cover letter due to AI quota limits.");
      }
    } catch (err) {
      console.error("Cover Letter Error:", err.message);
      setCoverLetter("Something went wrong.");
    } finally {
      setGeneratingCover(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-4">AI Resume Analyzer</h1>

        <section>
          <label className="block mb-2 font-medium">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          <h3 className="mt-6 mb-2 font-semibold text-lg">OR Paste Resume Text:</h3>
          <textarea
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg resize-none text-black"
            rows={10}
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAnalyze}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Analyze Resume
            </button>
          </div>
        </section>

        <section className="mt-6 flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm mb-1">Job Title</label>
            <select
              className="w-full p-2 border dark:border-gray-700 rounded-lg text-black"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Company Name</label>
            <input
              type="text"
              className="w-full p-2 border dark:border-gray-700 rounded-lg text-black"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <button
            onClick={handleGenerateCoverLetter}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg self-end"
          >
            Generate Cover Letter
          </button>
        </section>

        {loading && <Spinner />}
        {!loading && analysis && <AnalysisResult analysis={analysis} />}

        {jobs.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Top Job Suggestions</h2>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow"
                >
                  <h3 className="text-xl font-semibold">{job.job_title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {job.company_name} – {job.job_country}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {job.job_description?.slice(0, 150)}...
                  </p>
                  <a
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 mt-2 inline-block"
                  >
                    Apply
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {generatingCover && <Spinner />}
        {coverLetter && (
          <div className="mt-8 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow">
            <h2 className="text-2xl font-bold mb-4">Generated Cover Letter</h2>
            <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-200">
              {coverLetter}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;

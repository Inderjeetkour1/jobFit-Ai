import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Spinner from "./components/Spinner";
import AnalysisResult from "./components/AnalysisResult";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [companyName, setCompanyName] = useState("ABC Corp");

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return alert("Please paste your resume first.");
    setLoading(true);
    setAnalysis(null);
    setJobs([]);
    setCoverLetter("");

    try {
      const res = await fetch(`${BASE_URL}/resume/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      setAnalysis(data.analysis);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to get AI analysis. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resumeText.trim()) return alert("Please paste your resume first.");
    setGeneratingCover(true);
    setCoverLetter("");

    try {
      const res = await fetch(`${BASE_URL}/resume/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobTitle, companyName }),
      });

      const data = await res.json();
      setCoverLetter(data.coverLetter || "Failed to generate cover letter.");
    } catch (err) {
      console.error("Error:", err);
      setCoverLetter("Something went wrong.");
    } finally {
      setGeneratingCover(false);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/resume/uploadFile`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("PDF Upload Error:", error);
      alert("Failed to upload PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-4">AI Resume Analyzer</h1>

        <section id="upload">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              className="border p-2 rounded bg-white text-black"
            />
          </div>

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

        <section id="cover" className="mt-6 flex flex-col sm:flex-row gap-4">
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
          <section id="jobs" className="mt-8">
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

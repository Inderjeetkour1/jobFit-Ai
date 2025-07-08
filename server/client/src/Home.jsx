import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Spinner from "./components/Spinner";
import AnalysisResult from "./components/AnalysisResult";

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
      const res = await fetch("http://localhost:5000/resume/upload", {
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
      const res = await fetch("http://localhost:5000/resume/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobTitle,
          companyName,
        }),
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

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">AI Resume Analyzer</h1>

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
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
  <div>
    <label className="block text-sm mb-1">Select Job Title</label>
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
      className="w-full p-2 border dark:border-gray-700 rounded-lg text-black"
      type="text"
      placeholder="Enter company name"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
    />
  </div>
</div>

          <button
            onClick={handleGenerateCoverLetter}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Generate Cover Letter
          </button>
        </div>

        {loading && <Spinner />}
        {!loading && analysis && <AnalysisResult analysis={analysis} />}

        {jobs.length > 0 && (
          <div className="mt-8">
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
          </div>
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

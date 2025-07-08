import React, { useState } from 'react';

function Dashboard() {
  const [resumeText, setResumeText] = useState("");
  const [jobMatches, setJobMatches] = useState([]);

  const handleMatchJobs = async () => {
    const res = await fetch("http://localhost:5000/resume/matchJobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    });

    const data = await res.json();
    setJobMatches(data.jobs || []);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Job Match Dashboard</h1>
      <textarea
        className="w-full p-3 border rounded"
        placeholder="Paste your resume here..."
        rows="10"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <button
        onClick={handleMatchJobs}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Find Job Matches
      </button>

      {jobMatches.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Recommended Jobs:</h2>
          <ul className="list-disc pl-5">
            {jobMatches.map((job, index) => (
              <li key={index}>{job}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import React from "react";

function AnalysisResult({ analysis }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 mt-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-3 text-blue-600">Analysis Result</h3>

      {analysis.summary && (
        <div className="mb-4">
          <h4 className="font-bold">📄 Summary</h4>
          <p>{analysis.summary}</p>
        </div>
      )}

      {analysis.strengths && (
        <div className="mb-4">
          <h4 className="font-bold">💪 Strengths</h4>
          <ul className="list-disc list-inside">
            {analysis.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.improvements && (
        <div className="mb-4">
          <h4 className="font-bold">🔧 Improvements</h4>
          <ul className="list-disc list-inside">
            {analysis.improvements.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.job_roles && (
        <div className="mb-4">
          <h4 className="font-bold">💼 Best Fit Roles</h4>
          <ul className="list-disc list-inside">
            {analysis.job_roles.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AnalysisResult;

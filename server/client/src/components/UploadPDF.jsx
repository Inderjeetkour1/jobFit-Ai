import React, { useState } from "react";

function UploadPDF() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file.");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resume/uploadFile`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setMessage("Resume analyzed successfully ✅");
      console.log(data.analysis); // Optional: Use this
    } catch (err) {
      setMessage("Upload failed ❌");
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Upload PDF Resume</h1>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <br />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Upload & Analyze
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}

export default UploadPDF;

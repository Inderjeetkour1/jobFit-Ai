const uploadResume = async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({ message: 'Resume text is required' });
  }

  try {
    const analysis = await analyzeResume(resumeText);
    return res.status(200).json({ message: analysis });
  } catch (error) {
    console.error('GPT Error:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to analyze resume' });
  }
};

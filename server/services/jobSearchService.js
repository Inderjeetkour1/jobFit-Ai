const axios = require('axios');

const fetchJobsByRole = async (role) => {
  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
      query: role,
      page: '1',
      num_pages: '1'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // Add to .env
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.data.slice(0, 5); // top 5 jobs
  } catch (error) {
    console.error("Job API Error:", error.message);
    return [];
  }
};

module.exports = { fetchJobsByRole };

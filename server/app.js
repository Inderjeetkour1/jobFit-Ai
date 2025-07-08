const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.get('/', (req, res) => {
  res.send('JobFit AI Backend Running');
});

// ✅ Add this line to connect the resume route
const resumeRoutes = require('./routes/resumeRoutes');
app.use('/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));


const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});


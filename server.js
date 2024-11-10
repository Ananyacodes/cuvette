const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error("Missing Supabase configuration in .env file.");
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Set up EJS view engine
app.set('view engine', 'ejs');

// Blank route to check if server is working
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Routes for job-related endpoints
app.get('/api/job', async (req, res) => {
  const jobType = req.query.type; // Capture the job type from the query

  let { data, error } = await supabase
      .from('job')
      .select('*');

  if (error) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({ error: error.message });
  }

  // Filter jobs based on job type if specified
  if (jobType) {
      data = data.filter(job => job.job_type.toLowerCase() === jobType.toLowerCase());
  }

  res.status(200).json(data);
});


// Get all jobs
app.get('/api/job', async (req, res) => {
    const { data, error } = await supabase
        .from('job')
        .select('*');
  
    if (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({ error: error.message });
    }
  
    res.status(200).json(data);
});

// Add a new job
app.post('/api/job', async (req, res) => {
  const { title, company, location, salary, openings, experience, start_date, probation_duration,job_type } = req.body;
  const { data, error } = await supabase
      .from('job')
      .insert([{ title, company, location, salary, openings, experience, start_date, probation_duration,job_type }]);

  if (error) {
      console.error("Error inserting job:", error);
      return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

// Search jobs by title or company
app.get('/api/job/search', async (req, res) => {
    const searchTerm = req.query.search;
  
    let { data, error } = await supabase
      .from('job')
      .select('*');
  
    if (error) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log(`Data before filtering:`, data); // Log initial data
   
    if (searchTerm) {
      data = data.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())   
      );
    }

    console.log("Data after filtering:", data); // Log data after filtering
    res.json(data);
});
  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

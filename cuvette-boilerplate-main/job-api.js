import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

async function fetchJob() {
    try {
        const response = await fetch('http://localhost:3000/api/job');
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return null;
    }
}

  
  // Function to fetch data from the 'user' table
  async function fetchUserData() {
    const { data, error } = await supabase
        .from('user')
        .select('*');

    if (error) {
        console.error("Error fetching user data:", error);
        return [];
    }
    return data;
}

// Function to fetch job listings
async function fetchJobListings() {
    try {
        const response = await fetch('http://localhost:3000/api/job'); // Corrected URL to http instead of https
        if (!response.ok) {
            throw new Error(`Failed to fetch job listings: ${response.status}`);
        }
        const job = await response.json(); // Parse JSON response
        displayJobListings(job); // Display the fetched job listings
    } catch (error) {
        console.error("Error fetching job listings:", error);
    }
}

// Function to display job listings as cards
function displayJobListings(job) {
    const jobListings = document.getElementById("job-table-body");
    jobListings.innerHTML = ""; // Clear existing listings

    job.forEach((job) => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");

        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3 class="job-title">${job.title}</h3>
                <p class="company-name">${job.company} - ${job.location}</p>
                <span class="job-type">${job.job_type}</span>
            </div>
            <div class="job-tags">
                ${(job.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="job-details">
                <div class="job-details-row">
                    <p>💰 Salary: ${job.salary}</p>
                    <p>📅 Start Date: ${job.start_date}</p>
                    <p>👥 Openings: ${job.openings}</p>
                </div>
                <p>🎓 Experience: ${job.experience}</p>
                <p>🕒 Probation: ${job.probation_duration}</p>
            </div>
            <button class="apply-button"><a href="${job.url}">Apply Now</button>
        `;

// Append jobCard to the main container, e.g., jobTableBody.appendChild(jobCard);
        jobListings.appendChild(jobCard);
    });
}


app.get('/api/job/search', async (req, res) => {
    const searchTerm = req.query.search;  // Capture the search term from the query string
  
    let { data, error } = await supabase
      .from('job')
      .select('*');
  
    if (error) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({ error: error.message });
    }

    if (searchTerm) {
      data = data.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())   
      );
    }

    res.json(data);  // Return the filtered jobs as JSON
});


// Function to search jobs based on search bar input
document.getElementById("search-bar").addEventListener("input", async function () {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();

    try {
        // Use a GET request, not POST
        const response = await fetch(`http://localhost:3000/api/job/search?search=${searchTerm}`);
        
        // If the request fails, throw an error
        if (!response.ok) {
            throw new Error(`Failed to search jobs: ${response.status}`);
        }

        // Parse the JSON response
        const job = await response.json();
        displayJobListings(job); // Display the job listings after searching
    } catch (error) {
        console.error("Error searching job listings:", error);
    }
});

// Load job listings on page load
document.addEventListener("DOMContentLoaded", fetchJobListings);

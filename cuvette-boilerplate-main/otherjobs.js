document.addEventListener("DOMContentLoaded", async () => {
    const jobTableBody = document.getElementById("job-table-body");

    // Fetch jobs from the backend, with optional search term
    async function fetchJobs(searchTerm = '') {
        try {
            const query = searchTerm ? `search=${encodeURIComponent(searchTerm)}` : '';
            const response = await fetch(`http://localhost:3000/api/job/search?${query}`);
            if (!response.ok) {
                throw new Error('Error fetching jobs');
            }

            const jobs = await response.json();
            console.log("Jobs fetched:", jobs); // Debugging: Verify jobs data

            // Display only non-fulltime jobs
            displayJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    }

    // Display jobs on the page
    function displayJobs(jobs) {
        // Clear current job listings
        jobTableBody.innerHTML = '';

        // Filter out 'Fulltime' jobs (case-insensitive)
        const filteredJobs = jobs.filter(job => job.job_type && job.job_type.toLowerCase() !== 'fulltime');

        // Populate the container with filtered job data
        filteredJobs.forEach(job => {
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
                <button class="apply-button"><a href="${job.url}" target="_blank" rel="noopener noreferrer">Apply Now</a></button>
            `;
            jobTableBody.appendChild(jobCard);
        });
    }

    // Initial fetch to show 'Other Jobs' (non-fulltime) on load
    fetchJobs();

    // Optional: Search input functionality if you have a search bar
    const searchInput = document.getElementById("search-bar");
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.trim();
            fetchJobs(searchTerm);
        });
    }
});

console.log("script.js");

document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("search-bar");
    const jobTableBody = document.getElementById("job-table-body");

    // Fetch all jobs on initial load
    async function fetchJobs(searchTerm = '') {
    try {
        const response = await fetch(`http://localhost:3000/api/job/search?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error('Error fetching jobs');
        }

        const jobs = await response.json();

        // Clear current job listings
        const jobListings = document.getElementById("job-table-body");
        jobListings.innerHTML = '';

        // Populate the container with job data as cards
        jobs.forEach(job => {
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
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
    // Fulltime Jobs Event
    // Array.from(document.querySelectorAll("a"))
    //     .find(a => a.textContent.trim() === 'Fulltime Jobs')
    //     .addEventListener('click', () => fetchJobs('', 'Fulltime'));

    //     // Other Jobs Event
    // Array.from(document.querySelectorAll("a"))
    //     .find(a => a.textContent.trim() === 'Other Jobs')
    //     .addEventListener('click', () => fetchJobs('', 'Other')); // Pass 'Other' as a keyword

}


    // Initial job fetch
    fetchJobs();

    // Add event listener for search input
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.trim();
        fetchJobs(searchTerm); // Fetch jobs dynamically as user types
    });
});

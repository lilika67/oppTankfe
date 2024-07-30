document.addEventListener('DOMContentLoaded', () => {
  const jobListings = document.getElementById('job-listings');
  const applyModal = document.getElementById('apply-modal');
  const closeBtn = document.querySelector('.close-btn');
  const modalJobTitle = document.getElementById('job-title');

  // Fetch and display jobs when the page loads
  fetchJobs();

  // Function to fetch jobs from the API
  async function fetchJobs() {
    try {
      const response = await fetch('http://localhost:3000/api/v1/job');
      const { alljobs } = await response.json();

      // Clear the job listings section before adding new cards
      jobListings.innerHTML = '';

      if (Array.isArray(alljobs)) {
        alljobs.forEach(job => addJobCard(job));
      } else {
        console.error('Jobs response is not an array:', alljobs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Function to add a job card to the listings section
  function addJobCard(job) {
    const card = document.createElement('div');
    card.classList.add('job-card');
    card.innerHTML = `
      <h3><strong>${job.title}<strong></h3>
      <p>Company: ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Salary:</strong> ${job.salary || 'N/A'}</p>
      <p><strong>Description:</strong>${job.description}</p>
      <button class="apply-btn" data-job-title="${job.title}">Apply</button>
    `;
    jobListings.appendChild(card);

    // Add event listener to the "Apply" button
    card.querySelector('.apply-btn').addEventListener('click', () => {
      modalJobTitle.value = job.title;
      applyModal.style.display = 'block';
    });
  }

  // Close the modal when the close button is clicked
  closeBtn.addEventListener('click', () => {
    applyModal.style.display = 'none';
  });

  // Close the modal when clicking outside the modal content
  window.addEventListener('click', (event) => {
    if (event.target == applyModal) {
      applyModal.style.display = 'none';
    }
  });
});

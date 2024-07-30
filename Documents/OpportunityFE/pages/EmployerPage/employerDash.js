document.addEventListener('DOMContentLoaded', () => {
  const jobForm = document.getElementById('job-form');
  const jobsTableBody = document.getElementById('jobs-table-body');

  // Fetch and display jobs when the page loads
  fetchJobs();

  // Handle job form submission
  jobForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const jobData = {
      title: jobForm['job-title'].value,
      company: jobForm['company-name'].value,
      location: jobForm['location'].value,
      salary: jobForm['salary'].value,
      description: jobForm['job-description'].value,
    };

    try {
      const response = await fetch('http://localhost:3000/api/v1/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const responseBody = await response.json();

      if (response.ok) {
        console.log('Job added:', responseBody);
        addJobToTable(responseBody);
        jobForm.reset();
      } else {
        console.error('Failed to add job', response.status, responseBody);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Function to fetch jobs from the API
  async function fetchJobs() {
    try {
      const response = await fetch('http://localhost:3000/api/v1/job');
      const { alljobs } = await response.json();

      // Clear the table body before adding new rows
      jobsTableBody.innerHTML = '';

      if (Array.isArray(alljobs)) {
        alljobs.forEach(job => addJobToTable(job));
      } else {
        console.error('Jobs response is not an array:', alljobs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Function to add a job to the table
  function addJobToTable(job) {
    console.log('Adding job to table:', job);  // Log the job object
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${job._id}</td>
      <td>${job.title}</td>
      <td>${job.company}</td>
      <td>${job.salary || 'N/A'}</td>
      <td>${job.location}</td>
    `;
    jobsTableBody.appendChild(row);
  }
});

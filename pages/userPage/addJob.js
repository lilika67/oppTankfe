// // job.js
// document.addEventListener('DOMContentLoaded', async () => {
//   const jobListings = document.getElementById('job-listings');

//   async function fetchJobs() {
//     try {
//       const response = await fetch('http://localhost:3000/api/v1/job');

//       // Check if the response is OK
//       if (!response.ok) {
//         throw new Error('Network response was not ok ' + response.statusText);
//       }

//       const { alljobs } = await response.json();

//       // Log the jobs response to debug
//       console.log('Jobs fetched:', alljobs);

//       if (Array.isArray(alljobs)) {
//         alljobs.forEach(job => addJobToDOM(job));
//       } else {
//         console.error('Jobs response is not an array:', alljobs);
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//     }
//   }

//   function addJobToDOM(job) {
//     const jobCard = document.createElement('div');
//     jobCard.classList.add('job-card');
//     jobCard.innerHTML = `
//       <h2>Job Title: ${job.title}</h2>
//       <p>Company: ${job.company}</p>
//       <p>Location: ${job.location}</p>
//       <p>Description: ${job.description}</p>
//       <p>Salary: ${job.salary || 'N/A'}</p>
//       <button class="apply-btn" data-job="${job.title}">Apply</button>
//     `;
//     jobListings.appendChild(jobCard);
//   }

//   fetchJobs();
// });

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('API Response:', data); // Log the response to check its structure

    const users = data.allUsers || []; // Access the users from the allUsers key
    const tableBody = document.querySelector('.users-table tbody');

    // Clear existing rows
    tableBody.innerHTML = '';

    // Populate table with users
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user._id}</td>
        <td>${user.FirstName}</td>
        <td>${user.LastName}</td>
        <td>${user.email}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});

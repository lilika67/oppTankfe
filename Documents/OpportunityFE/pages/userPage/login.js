

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const Password = document.getElementById('password').value.trim();

    // Basic input validation
    if (!email || !Password) {
      showErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, Password })
      });

      if (!response.ok) {
        const messageData = await response.json();
        showErrorMessage(messageData.error);
        
      }

      // Extract the role from the response
      const userData = await response.json();
      
      console.log(userData);

      // Redirect based on role
      console.log(userData)
      if (userData.user.role === 'admin') {

        window.location.href = '../AdminPage/adminDash.html'; 
      } else if (userData.user.role === 'talent') {
        window.location.href = '../homepage.html'; 
      } else {
        window.location.hred = '../employerDash.html'
      }
    } catch (error) {
      showErrorMessage('Error: Something went wrong during login');
    }
  });
});

// Function to show success message
function showSuccessMessage(message) {
  Toastify({
      text: message || "Operation completed successfully!",
      duration: 3000,
      close: true,
      backgroundColor:"green",
      className: "toastify-success"
  }).showToast();
}

// Function to show error message
function showErrorMessage(message) {
  Toastify({
      text: message || "Error: Something went wrong!",
      duration: 3000,
      close: true,
      backgroundColor:"red",
      className: "toastify-error"
  }).showToast();
}
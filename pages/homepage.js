
// Function to check if the user is registered
function isUserRegistered() {
  // Check local storage or other storage for user registration status
  return localStorage.getItem('isRegistered') === 'true'; // Adjust based on your actual logic
}

document.getElementById('view-jobs-link').addEventListener('click', function(event) {
  event.preventDefault(); 

  if (!isUserRegistered()) {
    showErrorMessage('You need to register first to be able to see available jobs');
    
  } else {
   
    window.location.href = '/jobs'; 
  }
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
      backgroundColor:"blue",
      className: "toastify-error"
  }).showToast();
}
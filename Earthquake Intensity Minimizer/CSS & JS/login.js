document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form fields
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate email format
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (!isValidPasswordLength(password)) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // If all validations pass, proceed with form submission
    this.submit();
  });

  // Function to validate email format
  function isValidEmail(email) {
    // Regular expression for basic email format validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|co|io|info|biz|me|tv|uk|ca|de|fr|jp|au)$/i;

    return emailRegex.test(email);
  }

  // Function to validate password length
  function isValidPasswordLength(password) {
    return password.length >= 8;
  }
});

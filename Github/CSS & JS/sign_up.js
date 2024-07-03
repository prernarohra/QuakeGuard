document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signup-form");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const createAccountButton = document.querySelector(".button");
  const loginButton = document.querySelector(".login-button");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrorMessages();

      const firstName = firstNameInput.value.trim();
      if (!firstName || firstName.length < 3) {
        displayErrorMessage(
          "firstNameError",
          "Please enter a valid first name."
        );
        return;
      }
      const lastName = lastNameInput.value.trim();
      if (!lastName || lastName.length < 3) {
        displayErrorMessage("lastNameError", "Please enter a valid last name.");
        return;
      }

      const email = emailInput.value.trim();
      const emailRegex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        displayErrorMessage(
          "emailError",
          "Please enter a valid email address."
        );
        return;
      }

      const password = passwordInput.value.trim();
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;
      if (!passwordRegex.test(password)) {
        displayErrorMessage(
          "passwordError",
          "Please enter a strong password that meets the requirements."
        );
        return;
      }

      const confirmPassword = confirmPasswordInput.value.trim();
      if (password !== confirmPassword) {
        displayErrorMessage("confirmPasswordError", "Passwords do not match.");
        return;
      }

      console.log(firstName);

      // If all validations pass, submit the form
      submitForm(firstName, lastName, email, password);
    });
  }

  loginButton.addEventListener("click", function () {
    window.location.href = "login.html";
  });

  function displayErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
  }

  function clearErrorMessages() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => {
      element.textContent = "";
    });
  }

  function submitForm(firstName, lastName, email, password) {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Form submitted successfully.");
          // console.log(formData);
          window.location.href = "/login"; // Redirect to login page
          // } else if (response.status === 400) {
          //   // response.json().then((data) => {
          //   //   alert(data.error); // Display error message if email already exists
          //   // });
          //   throw new Error("Email Already exists.");
        } else {
          throw new Error("Form submission failed.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Email Already exists. Please try again.");
      });
  }
});

// function calculateDestructionEstimate() {
//   // Get the selected intensity from the dropdown
//   var intensitySelect = document.getElementById("intensitySelect");
//   var intensity = parseInt(intensitySelect.value);

//   // Check if intensity is a valid number
//   if (isNaN(intensity) || intensity < 1 || intensity > 12) {
//     console.error("Invalid intensity value: " + intensity);
//     return;
//   }

//   // Update the progress bar with the selected intensity
//   var progressBar = document.getElementById("destruction-progress");
//   progressBar.value = intensity;

//   // Update the destruction label with the selected intensity
//   var destructionLabel = document.getElementById("destruction-label");
//   destructionLabel.textContent = "Destruction Level: " + intensity;
// }

// //new
// function calculateDestructionEstimate() {
//   // Get the selected intensity from the dropdown
//   var intensitySelect = document.getElementById("intensitySelect");
//   var intensity = parseInt(intensitySelect.value);

//   // Check if intensity is a valid number
//   if (isNaN(intensity) || intensity < 1 || intensity > 12) {
//     console.error("Invalid intensity value: " + intensity);
//     return;
//   }

//   // Make a request to the Flask route to predict destruction level
//   fetch("/predict_destruction_from_input", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       magnitude: document.getElementById("magnitude").value,
//       depth: document.getElementById("depth").value,
//       intensity: intensity,
//       victims: document.getElementById("victims").value,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // Update the progress bar with the predicted destruction level
//       var progressBar = document.getElementById("destruction-progress");
//       progressBar.value = data.prediction;

//       // Update the destruction label with the predicted destruction level
//       var destructionLabel = document.getElementById("destruction-label");
//       destructionLabel.textContent =
//         "Predicted Destruction Level: " + data.prediction;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }
//new2
// //new
// function calculateDestructionEstimate() {
//   // Get the selected intensity from the dropdown
//   var intensitySelect = document.getElementById("intensitySelect");
//   var intensity = parseInt(intensitySelect.value);

//   // Check if intensity is a valid number
//   if (isNaN(intensity) || intensity < 1 || intensity > 12) {
//     console.error("Invalid intensity value: " + intensity);
//     return;
//   }

//   // Make a request to the Flask route to predict destruction level
//   fetch("/predict_destruction_from_input", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       magnitude: document.getElementById("magnitude").value,
//       depth: document.getElementById("depth").value,
//       intensity: intensity,
//       victims: document.getElementById("victims").value,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // Update the progress bar with the predicted destruction level
//       var progressBar = document.getElementById("destruction-progress");
//       progressBar.value = data.prediction;

//       // Update the destruction label with the predicted destruction level
//       var destructionLabel = document.getElementById("destruction-label");
//       destructionLabel.textContent =
//         "Predicted Destruction Level: " + data.prediction;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }
function calculateDestructionEstimate() {
  // Get the values of all input fields
  var magnitudeInput = document.getElementById("magnitude").value.trim();
  var depthInput = document.getElementById("depth").value.trim();
  var intensitySelect = document.getElementById("intensitySelect");
  var intensity = parseInt(intensitySelect.value);
  var victimsInput = document.getElementById("victims").value.trim();

  // Check if any input field is empty
  if (
    magnitudeInput === "" ||
    depthInput === "" ||
    isNaN(intensity) ||
    victimsInput === ""
  ) {
    alert("Please fill in all input fields.");
    return;
  }

  // Check if intensity is a valid number
  if (intensity < 1 || intensity > 12) {
    alert("Invalid intensity value: " + intensity);
    return;
  }

  // Make a request to the Flask route to predict destruction level
  fetch("/predict_destruction_from_input", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      magnitude: magnitudeInput,
      depth: depthInput,
      intensity: intensity,
      victims: victimsInput,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Update the progress bar with the predicted destruction level
      var progressBar = document.getElementById("destruction-progress");
      progressBar.value = data.prediction;

      // Update the destruction label with the predicted destruction level
      var destructionLabel = document.getElementById("destruction-label");
      destructionLabel.textContent =
        "Predicted Destruction Level: " + data.prediction;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

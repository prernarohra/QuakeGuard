function predict() {
  const magnitude = document.getElementById("magnitude").value;
  const depth = document.getElementById("depth").value;
  const destruction = document.getElementById("destruction").value;
  const victims = document.getElementById("victims").value;

  console.log("Magnitude:", magnitude);
  console.log("Depth:", depth);
  console.log("Destruction:", destruction);
  console.log("Victims:", victims);

  if (!magnitude || !depth || !destruction || !victims) {
    alert("Please fill in all fields.");
    return;
  }
  if (isNaN(magnitude) || magnitude < 0 || magnitude > 9) {
    alert("Please enter a magnitude between 0 and 9.");
    return;
  }
  if (isNaN(depth) || depth < 0 || depth > 700) {
    alert("Please enter a depth between 0 and 700.");
    return;
  }
  // Making a POST request to the Flask API
  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      magnitude: magnitude,
      depth: depth,
      destruction: destruction,
      victims: victims,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      // Displaying the result on frontend UI
      displayResult(result.prediction, result.description);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayResult(prediction, description) {
  const outputBox = document.getElementById("outputbox");
  const scale = document.querySelector(".intensity-scale");

  // Clear existing markers
  const existingMarkers = document.querySelectorAll(".marker");
  existingMarkers.forEach((marker) => {
    marker.remove();
  });

  // Displaying the result only if the prediction and description are defined
  if (prediction !== undefined && description !== undefined) {
    if (prediction < 0 || prediction > 10) {
      console.error("Prediction value out of range. Expected range: [0, 10]");
      return;
    }

    outputBox.innerHTML = `\t\t \n<br><br><b>The predicted earthquake intensity is:</b> ${prediction}.
   \t \t \n<br><br><b>Description:</b> ${description}`;

    // Calculate the position of the marker on the scale
    const markerPosition = (prediction / 10) * 100; // Assuming scale is divided into 10 intervals

    // Set the left position of the marker
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.style.left = markerPosition + "%";
    scale.appendChild(marker);
  }
}
//new reduced
// JavaScript
// Modify openModal function to accept modalId
// function showModal() {
//         var modal = document.getElementById("modal");
//         modal.style.display = "block";
//       }

//       // Function to close the modal
//       function closeModal() {
//         var modal = document.getElementById("modal");
//         modal.style.display = "none";
//       }

//working modal
// function showModal() {
//   var intensityInput = document.getElementById("intensity");
//   var intensityValue = intensityInput.value;

//   if (intensityValue.trim() === "") {
//     alert("Please enter the intensity first.");
//   } else {
//     var modal = document.getElementById("modal");
//     modal.style.display = "block";
//   }
// }

// // Function to close the modal
// function closeModal() {
//   var modal = document.getElementById("modal");
//   modal.style.display = "none";
// }

//workingggg!!!!!!!!
// function getReducedIntensity(button) {
//   var predictedIntensity = document.getElementById("intensity").value;

//   var data = {
//     predicted_intensity: predictedIntensity,
//     button: button,
//   };

//   if (button === "menshin") {
//     var building = prompt("Enter your building size (Tall/Medium/Small):");
//     data["building"] = building;
//   }

//   fetch("/intensity-reduction", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       alert(
//         "Reduced Intensity: " + data.reduced_intensity + "\n" + data.suggestion
//       );
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

//**************KEEEEEEPPPPPPPP*********************** */
// function getReducedIntensity(button) {
//   var predictedIntensity = document.getElementById("intensity").value;

//   // Check if predicted intensity is empty or not an integer between 1 and 12
//   if (
//     !predictedIntensity ||
//     predictedIntensity < 1 ||
//     predictedIntensity > 12 ||
//     !Number.isInteger(Number(predictedIntensity))
//   ) {
//     alert("Please enter an integer value between 1 and 12.");
//     return;
//   }

//   var data = {
//     predicted_intensity: predictedIntensity,
//     button: button,
//   };

//   if (button === "menshin") {
//     var building = prompt("Enter your building size (Tall/Medium/Small):");
//     data["building"] = building;
//   }

//   fetch("/intensity-reduction", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       alert(
//         "Reduced Intensity: " + data.reduced_intensity + "\n" + data.suggestion
//       );
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

//******************KEEEEEEPPPPPPPPP******************* */

///********************NEW MODALLLLLL */
// function getReducedIntensity(button) {
//   var predictedIntensity = document.getElementById("intensity").value;

//   if (
//     !predictedIntensity ||
//     predictedIntensity < 1 ||
//     predictedIntensity > 12 ||
//     !Number.isInteger(Number(predictedIntensity))
//   ) {
//     alert("Please enter an integer value between 1 and 12.");
//     return;
//   }

//   var data = {
//     predicted_intensity: predictedIntensity,
//     button: button,
//   };

//   if (button === "menshin") {
//     var building = prompt("Enter your building size (Tall/Medium/Small):");
//     data["building"] = building;
//   }

//   fetch("/intensity-reduction", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok " + response.statusText);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       if (data.error) {
//         alert(data.error);
//         return;
//       }

//       var modalId;
//       var modalContentId;
//       if (button === "standard") {
//         modalId = "modalAll";
//         modalContentId = "modalContentAll";
//       } else if (button === "seishen") {
//         modalId = "modalSeishen";
//         modalContentId = "modalContentSeishen";
//       } else if (button === "menshin") {
//         modalId = "modalMenshin";
//         modalContentId = "modalContentMenshin";
//       }
//       var modalContent = document.getElementById(modalContentId);
//       modalContent.innerHTML =
//         "Reduced Intensity: " +
//         data.reduced_intensity +
//         "<br>" +
//         data.suggestion;
//       var modal = document.getElementById(modalId);
//       modal.style.display = "block";
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       alert("An error occurred: " + error.message);
//     });
// }

// // Modal close button functionality
// function closeModal(modalId) {
//   var modal = document.getElementById(modalId);
//   modal.style.display = "none";
// }

// // Close the modals when the user clicks outside of them
// window.onclick = function (event) {
//   var modalAll = document.getElementById("modalAll");
//   var modalSeishen = document.getElementById("modalSeishen");
//   var modalMenshin = document.getElementById("modalMenshin");
//   if (event.target == modalAll) {
//     modalAll.style.display = "none";
//   }
//   if (event.target == modalSeishen) {
//     modalSeishen.style.display = "none";
//   }
//   if (event.target == modalMenshin) {
//     modalMenshin.style.display = "none";
//   }
// };

var selectedButton;

function getReducedIntensity(button) {
  var predictedIntensity = document.getElementById("intensity").value;

  if (
    !predictedIntensity ||
    predictedIntensity < 1 ||
    predictedIntensity > 12 ||
    !Number.isInteger(Number(predictedIntensity))
  ) {
    alert("Please enter an integer value between 1 and 12.");
    return;
  }

  var data = {
    predicted_intensity: predictedIntensity,
    button: button,
  };

  if (button === "menshin") {
    selectedButton = button;
    var modal = document.getElementById("buildingSizeModal");
    modal.style.display = "block";
  } else {
    fetchIntensityReduction(data, button);
  }
}

function selectBuildingSize(building) {
  var modal = document.getElementById("buildingSizeModal");
  modal.style.display = "none";

  var data = {
    predicted_intensity: document.getElementById("intensity").value,
    button: selectedButton,
    building: building,
  };

  fetchIntensityReduction(data);
}

function fetchIntensityReduction(data, button = null) {
  if (!button) button = data.button;

  fetch("/intensity-reduction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      var modalId;
      var modalContentId;
      if (button === "standard") {
        modalId = "modalAll";
        modalContentId = "modalContentAll";
      } else if (button === "seishen") {
        modalId = "modalSeishen";
        modalContentId = "modalContentSeishen";
      } else if (button === "menshin") {
        modalId = "modalMenshin";
        modalContentId = "modalContentMenshin";
      }
      var modalContent = document.getElementById(modalContentId);
      modalContent.innerHTML =
        "Reduced Intensity: " +
        data.reduced_intensity +
        "<br>" +
        data.suggestion;
      var modal = document.getElementById(modalId);
      modal.style.display = "block";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred: " + error.message);
    });
}

// Modal close button functionality
function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  modal.style.display = "none";
}

// Closing the modals when the user clicks outside of them
window.onclick = function (event) {
  var modalAll = document.getElementById("modalAll");
  var modalSeishen = document.getElementById("modalSeishen");
  var modalMenshin = document.getElementById("modalMenshin");
  var buildingSizeModal = document.getElementById("buildingSizeModal");
  if (event.target == modalAll) {
    modalAll.style.display = "none";
  }
  if (event.target == modalSeishen) {
    modalSeishen.style.display = "none";
  }
  if (event.target == modalMenshin) {
    modalMenshin.style.display = "none";
  }
  if (event.target == buildingSizeModal) {
    buildingSizeModal.style.display = "none";
  }
};

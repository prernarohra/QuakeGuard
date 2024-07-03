function viewReducedMagnitude() {
  var magnitudeInput = document.getElementById("magnitude");
  var magnitude = parseFloat(magnitudeInput.value.trim());

  if (isNaN(magnitude) || magnitude < 0 || magnitude > 9) {
    alert("Please enter a magnitude between 0 and 9.");
    return;
  }

  fetch("/get_reduced_magnitude?magnitude=" + magnitude)
    .then((response) => response.json())
    .then((data) => {
      fetch(
        "/get_solutions_based_on_magnitude?magnitude=" + data.reduced_magnitude
      )
        .then((response) => response.json())
        .then((solutionsData) => {
          displayModal(data.reduced_magnitude, solutionsData.solutions);
        })
        .catch((error) => {
          console.error("Error fetching solutions based on magnitude:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching reduced magnitude:", error);
    });
}

function displayModal(reducedMagnitude, solutions) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");

  // Clear previous content
  modalContent.innerHTML = "";

  const magnitudeHeading = document.createElement("h3");
  magnitudeHeading.textContent = "Reduced Magnitude:";
  const magnitudeParagraph = document.createElement("p");
  magnitudeParagraph.textContent = reducedMagnitude;

  // Add reduced magnitude elements to modal content
  modalContent.appendChild(magnitudeHeading);
  modalContent.appendChild(magnitudeParagraph);

  // Create elements for solutions
  const solutionsHeading = document.createElement("h3");
  solutionsHeading.textContent = "Solutions:";
  const solutionsList = document.createElement("ul");

  // Add solutions to list
  solutions.forEach((solution) => {
    const solutionItem = document.createElement("li");
    solutionItem.innerHTML = solution; // Preserve HTML formatting
    solutionsList.appendChild(solutionItem);
  });

  // Add solutions elements to modal content
  modalContent.appendChild(solutionsHeading);
  modalContent.appendChild(solutionsList);

  // displaying the modal
  modal.style.display = "block";
}

// Close the modal when the user clicks outside of it
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

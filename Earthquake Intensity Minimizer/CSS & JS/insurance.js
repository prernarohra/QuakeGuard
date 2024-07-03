// JavaScript for scrolling insurance types horizontally
document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector(".scroll-container");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  leftArrow.addEventListener("click", function () {
    // Scroll left by 100px
    scrollContainer.scrollBy({
      left: -100,
      behavior: "smooth",
    });
  });

  rightArrow.addEventListener("click", function () {
    // Scroll right by 100px
    scrollContainer.scrollBy({
      left: 100,
      behavior: "smooth",
    });
  });
});

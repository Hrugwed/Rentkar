 // Get the button
  let mybutton = document.getElementById("backToTopBtn");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      mybutton.style.display = "flex"; // Changed to flex to maintain centering
    } else {
      mybutton.style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  mybutton.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll
    });
  });
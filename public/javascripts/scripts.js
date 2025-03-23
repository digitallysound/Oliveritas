document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('nav');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const userMenuToggle = document.getElementById('user-menu-toggle');
  const userMenu = document.getElementById('user-menu');

  // Ensure the navbar sections are displayed correctly
  if (navbar) {
    navbar.classList.remove('hidden');
  }

  // Mobile Menu Toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('change', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Uncheck the checkbox when any anchor in the mobile menu is clicked
    mobileMenu.querySelectorAll('a').forEach(anchor => {
      anchor.addEventListener('click', () => {
        mobileMenuToggle.checked = false;
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // User Menu Toggle
  if (userMenuToggle) {
    userMenuToggle.addEventListener('change', () => {
      userMenu.classList.toggle('hidden');
    });

    // Uncheck the checkbox when any anchor in the user menu is clicked
    userMenu.querySelectorAll('a').forEach(anchor => {
      anchor.addEventListener('click', () => {
        userMenuToggle.checked = false;
        userMenu.classList.add('hidden');
      });
    });
  }

  // Modal functionality
  document.querySelectorAll('.project-link').forEach(function(element) {
    element.addEventListener('click', function(event) {
      event.preventDefault();
      const modalId = this.getAttribute('href');
      const modal = document.querySelector(modalId);
      modal.classList.add('show');
      // Close modal when clicking inside the modal
      modal.addEventListener('click', function() {
      modal.classList.remove('show');
      });
    });
  });

  // Close modal functionality
  document.querySelectorAll('.close-modal').forEach(function(element) {
    element.addEventListener('click', function() {
      this.closest('.modal').classList.remove('show');
    });
  });

  // Bounce back functionality
  let lastScrollTop = 0;
  const logo = document.querySelector('img[src="../images/main/oliveritas.svg"]');
  const bounceSound = new Audio('../sounds/bounce.mp3'); // Add the path to your sound file
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st === 0 || (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      window.scrollBy(0, st === 0 ? 50 : -50);
      if (logo) {
        logo.classList.add('bounce');
        bounceSound.play();
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        setTimeout(() => logo.classList.remove('bounce'), 1000);
      }
    }
    lastScrollTop = st <= 0 ? 0 : st;
  });
});

function validate() {
  var name = document.getElementById("name");
  var email = document.getElementById("email");
  var message = document.getElementById("message");
  if (name.value === "") {
      name.style.border = "solid 3px red";
      return false;
  } else if (email.value === "" && name.value != "") {
      name.style.border = null;
      email.style.border = "solid 3px red";
      return false;
  } else if (message.value === "" && email.value != "") {
      name.style.border = null;
      email.style.border = null;
      message.style.border = "solid 3px red";
      return false;
  } else {
      return true;
  }
}

function validate() {
  var name = document.getElementById("name");
  var email = document.getElementById("email");
  var message = document.getElementById("message");
  if (name.value === "") {
      name.style.border = "solid 3px red";
      return false;
  } else if (email.value === "" && name.value != "") {
      name.style.border = null;
      email.style.border = "solid 3px red";
      return false;
  } else if (message.value === "" && email.value != "") {
      name.style.border = null;
      email.style.border = null;
      message.style.border = "solid 3px red";
      return false;
  } else {
      return true;
  }
}

// Haptic flow
// Check for the different versions of the vibrate API
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
if (navigator.vibrate) {
  // CLICKABLE ELEMENTS
  document.addEventListener('DOMContentLoaded', () => {
  // Select all clickable elements
  const clickableElements = document.querySelectorAll('a, button, [role="button"], [onclick], input[type="button"], input[type="submit"]');
  // Log the clickable elements
  clickableElements.forEach(element => {
      element.addEventListener('click', () => {
        navigator.vibrate([75, 25, 75, 150, 75, 25, 75, 150, 75, 150]);
      });
    });
  // Add camera-change event listener to model-viewer
  const modelViewer = document.querySelector('model-viewer');
  if (modelViewer) {
    modelViewer.addEventListener('camera-change', () => {
      navigator.vibrate(9);
    });
  }
  });
} else {
  console.log("Vibration API not supported");
}
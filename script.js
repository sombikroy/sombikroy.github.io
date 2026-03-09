// Navbar shadow on scroll
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 2px 20px rgba(12,26,40,0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// Active nav link highlight on scroll
var sections = document.querySelectorAll('section[id], div[id]');
var navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', function () {
  var current = '';
  sections.forEach(function (sec) {
    if (window.scrollY >= sec.offsetTop - 80) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(function (link) {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#0d8c7a';
    }
  });
});

// Smooth scroll for nav links
navLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Contact form submit
var form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent!';
    btn.style.background = '#12b09a';
    setTimeout(function () {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// EMAIL INJECT - bypass Cloudflare mangling
document.addEventListener('DOMContentLoaded', function () {
  var u = 'sombikroy2000';
  var d = 'gmail.com';
  var addr = u + '@' + d;
  document.querySelectorAll('[data-email]').forEach(function (el) {
    el.setAttribute('href', 'mailto:' + addr);
  });
  var aboutEmail = document.getElementById('aboutEmail');
  if (aboutEmail) aboutEmail.textContent = addr;
  var contactEmailVal = document.getElementById('contactEmailVal');
  if (contactEmailVal) contactEmailVal.textContent = addr;
});

// NAVBAR scroll effect
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// Active nav highlight
function updateActiveNav() {
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-links a');
  var scrollY = window.scrollY + 100;
  sections.forEach(function (sec) {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      links.forEach(function (l) { l.classList.remove('active'); });
      var active = document.querySelector('.nav-links a[href="#' + sec.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var href = link.getAttribute('href');
    if (href === '#' || href === '#email') return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
      document.getElementById('mobileMenu').classList.remove('open');
    }
  });
});

// Hamburger menu
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
if (hamburger) {
  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });
}

// Scroll reveal - safe version that shows content if observer fails
if ('IntersectionObserver' in window) {
  var revealEls = document.querySelectorAll(
    '.skill-card, .proj-card, .exp-card, .achieve-item, .contact-card, .info-card, .edu-showcase'
  );
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    revealObserver.observe(el);
  });

  document.querySelectorAll('.skill-card').forEach(function (card, i) {
    card.style.transitionDelay = (i % 3) * 0.08 + 's';
  });

  // Immediately show anything already in viewport
  setTimeout(function () {
    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }, 100);
}

// Contact form
var form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var span = btn.querySelector('span');
    if (span) span.textContent = 'Message Sent! ✓';
    btn.style.background = '#12b09a';
    btn.disabled = true;
    setTimeout(function () {
      if (span) span.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

// Typing effect on hero role
var roleEl = document.querySelector('.hero-role');
if (roleEl) {
  var roles = ['POD Plugin Developer', 'SAP DM Specialist', 'JavaScript Developer', 'System Integrator'];
  var roleIdx = 0;
  var charIdx = 0;
  var deleting = false;
  function typeRole() {
    var current = roles[roleIdx];
    if (deleting) {
      roleEl.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        charIdx = 0;
        setTimeout(typeRole, 500);
        return;
      }
    } else {
      roleEl.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(typeRole, 2000);
        return;
      }
    }
    setTimeout(typeRole, deleting ? 50 : 80);
  }
  setTimeout(typeRole, 2000);
}

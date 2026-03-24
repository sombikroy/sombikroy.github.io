// EMAIL INJECT - built at runtime so Cloudflare cannot mangle it
document.addEventListener('DOMContentLoaded', function () {
  var u = 'sombikroy2000';
  var d = 'gmail.com';
  var addr = u + '@' + d;

  var hireBtn = document.getElementById('hireBtn');
  if (hireBtn) hireBtn.href = 'mailto:' + addr;

  var emailCard = document.getElementById('emailCard');
  if (emailCard) emailCard.href = 'mailto:' + addr;

  var aboutEmail = document.getElementById('aboutEmail');
  if (aboutEmail) aboutEmail.textContent = addr;

  var contactEmailVal = document.getElementById('contactEmailVal');
  if (contactEmailVal) contactEmailVal.textContent = addr;
});

// NAVBAR scroll effect
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});

// Active nav highlight
function updateActiveNav() {
  var scrollY = window.scrollY + 100;
  document.querySelectorAll('section[id]').forEach(function (sec) {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      document.querySelectorAll('.nav-links a').forEach(function (l) { l.classList.remove('active'); });
      var a = document.querySelector('.nav-links a[href="#' + sec.id + '"]');
      if (a) a.classList.add('active');
    }
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var href = link.getAttribute('href');
    if (!href || href.length < 2) return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      document.getElementById('mobileMenu').classList.remove('open');
    }
  });
});

// Hamburger
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
if (hamburger) {
  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });
}

// Scroll reveal
if ('IntersectionObserver' in window) {
  var els = document.querySelectorAll('.skill-card, .proj-card, .exp-card, .achieve-item, .contact-card, .info-card, .edu-showcase');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.55s ease ' + (i % 3) * 0.08 + 's, transform 0.55s ease ' + (i % 3) * 0.08 + 's';
    obs.observe(el);
  });

  // Show elements already in viewport immediately
  setTimeout(function () {
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
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
    if (span) span.textContent = 'Message Sent!';
    btn.style.background = '#12b09a';
    btn.disabled = true;
    setTimeout(function () {
      if (span) span.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// Typing effect
var roleEl = document.querySelector('.hero-role');
if (roleEl) {
  var roles = ['POD Plugin Developer', 'SAP DM Specialist', 'JavaScript Developer', 'System Integrator'];
  var ri = 0, ci = 0, del = false;
  function type() {
    var cur = roles[ri];
    if (del) {
      roleEl.textContent = cur.substring(0, ci--);
      if (ci < 0) { del = false; ri = (ri + 1) % roles.length; ci = 0; setTimeout(type, 500); return; }
    } else {
      roleEl.textContent = cur.substring(0, ci++);
      if (ci > cur.length) { del = true; setTimeout(type, 2000); return; }
    }
    setTimeout(type, del ? 50 : 80);
  }
  setTimeout(type, 2000);
}

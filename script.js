/**
 * Optimized script.js for sombikroy.github.io
 * Improvements: ES6+ syntax, robust scroll logic, and improved observers.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- EMAIL INJECTION ---
    // Bypasses Cloudflare email obfuscation safely
    const injectEmail = () => {
        const u = 'sombikroy2000';
        const d = 'gmail.com';
        const addr = `${u}@${d}`;
        
        document.querySelectorAll('[data-email]').forEach(el => {
            el.setAttribute('href', `mailto:${addr}`);
        });

        const emailElements = ['aboutEmail', 'contactEmailVal'];
        emailElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = addr;
        });
    };

    // --- NAVBAR & ACTIVE LINK LOGIC ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const handleScroll = () => {
        // Sticky Navbar Effect
        if (window.scrollY > 40) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 120; // Offset for better trigger timing

        sections.forEach(sec => {
            if (scrollPosition >= sec.offsetTop && scrollPosition < sec.offsetTop + sec.offsetHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // --- SMOOTH SCROLLING ---
    const setupSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '#email') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    // Using offsetTop is more reliable than getBoundingClientRect during active scrolls
                    const targetPosition = target.offsetTop - 70; 
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    document.getElementById('mobileMenu')?.classList.remove('open');
                }
            });
        });
    };

    // --- SCROLL REVEAL (Intersection Observer) ---
    const setupReveal = () => {
        if (!('IntersectionObserver' in window)) return;

        const revealOptions = {
            threshold: 0.05, // Lowered for better mobile compatibility
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, revealOptions);

        const revealEls = document.querySelectorAll('.skill-card, .proj-card, .exp-card, .achieve-item, .contact-card, .info-card, .edu-showcase');
        
        revealEls.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
            
            // Staggered delay for skill cards
            if (el.classList.contains('skill-card')) {
                el.style.transitionDelay = `${(i % 3) * 0.08}s`;
            }
            
            revealObserver.observe(el);
        });
    };

    // --- TYPING EFFECT ---
    const setupTypingEffect = () => {
        const roleEl = document.querySelector('.hero-role');
        const roles = ['POD Plugin Developer', 'SAP DM Specialist', 'JavaScript Developer', 'System Integrator'];
        
        if (!roleEl || roles.length === 0) return;

        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        const type = () => {
            const currentRole = roles[roleIdx];
            
            if (isDeleting) {
                roleEl.textContent = currentRole.substring(0, charIdx--);
                if (charIdx < 0) {
                    isDeleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                    charIdx = 0;
                    setTimeout(type, 500);
                    return;
                }
            } else {
                roleEl.textContent = currentRole.substring(0, charIdx++);
                if (charIdx > currentRole.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            }
            setTimeout(type, isDeleting ? 50 : 80);
        };

        setTimeout(type, 1500);
    };

    // --- INITIALIZE ALL ---
    injectEmail();
    setupSmoothScroll();
    setupReveal();
    setupTypingEffect();
    window.addEventListener('scroll', handleScroll);

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    hamburger?.addEventListener('click', () => {
        document.getElementById('mobileMenu')?.classList.toggle('open');
    });

    // Form Handling
    const form = document.getElementById('contactForm');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const span = btn?.querySelector('span');
        
        if (span) span.textContent = 'Message Sent! ✓';
        btn.style.background = '#12b09a';
        btn.disabled = true;

        setTimeout(() => {
            if (span) span.textContent = 'Send Message';
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 3500);
    });
});

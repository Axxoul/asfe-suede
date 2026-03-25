/* ========================================
   ASFE Suède Campaign — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initExpandables();
  initContactForm();
});

/* --- Navbar scroll effect --- */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.remove('nav-transparent');
      nav.classList.add('nav-solid');
    } else {
      nav.classList.remove('nav-solid');
      nav.classList.add('nav-transparent');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* --- Mobile menu --- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
}

/* --- Scroll animations (IntersectionObserver) --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up');
  if (!elements.length) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* --- Expandable sections (bios + propositions) --- */
function initExpandables() {
  document.querySelectorAll('[data-expand-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-expand-toggle');
      const target = document.getElementById(targetId);
      const arrow = button.querySelector('.expand-arrow');
      if (!target) return;

      const isExpanded = target.classList.contains('expanded');
      target.classList.toggle('expanded');
      if (arrow) arrow.classList.toggle('rotated');

      button.setAttribute('aria-expanded', !isExpanded);
    });
  });
}

/* --- Contact form (Formspree) --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        showFormMessage('Merci ! Votre message a bien été envoyé.', 'success');
      } else {
        showFormMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
      }
    } catch {
      showFormMessage('Erreur de connexion. Veuillez réessayer.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function showFormMessage(message, type) {
  const existing = document.getElementById('form-message');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.id = 'form-message';
  div.role = 'alert';
  div.className = type === 'success'
    ? 'mt-4 p-4 rounded-lg bg-teal-50 text-teal-800 border border-teal-200'
    : 'mt-4 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200';
  div.textContent = message;

  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(div, form.nextSibling);

  setTimeout(() => div.remove(), 5000);
}

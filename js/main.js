document.getElementById('year').textContent = new Date().getFullYear();

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
});

const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('is-open');
  navToggle.classList.toggle('is-active', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', false);
  });
});

const navLinkMap = {};
document.querySelectorAll('.nav-links a').forEach(link => {
  navLinkMap[link.getAttribute('href').slice(1)] = link;
});

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Object.values(navLinkMap).forEach(link => link.classList.remove('is-active'));
      const link = navLinkMap[entry.target.id];
      if (link) link.classList.add('is-active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => spyObserver.observe(section));

function staggerReveal(selector, step = 0.08) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * step}s`;
  });
}

staggerReveal('.cards-grid .reveal');
staggerReveal('.video-grid .reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(progress * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const submitButton = contactForm.querySelector('button[type="submit"]');
const WEB3FORMS_ACCESS_KEY = '2fa70b71-0fa7-48c0-a8c7-00e357cc4753';

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = contactForm.elements.name.value;
  const phone = contactForm.elements.phone.value;
  const projectSelect = contactForm.elements.project;
  const project = projectSelect.options[projectSelect.selectedIndex].text;
  const message = contactForm.elements.message.value;

  submitButton.disabled = true;
  formFeedback.textContent = 'Envoi en cours...';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Nouvelle demande de devis — ${project}`,
        from_name: name,
        name,
        phone,
        'Type de projet': project,
        message
      })
    });

    const result = await response.json();

    if (result.success) {
      formFeedback.textContent = 'Merci ! Votre demande a été envoyée. Nous vous recontacterons rapidement.';
      contactForm.reset();
    } else {
      formFeedback.textContent = 'Une erreur est survenue. Merci de réessayer ou de nous contacter par téléphone/WhatsApp.';
    }
  } catch {
    formFeedback.textContent = 'Une erreur est survenue. Merci de réessayer ou de nous contacter par téléphone/WhatsApp.';
  } finally {
    submitButton.disabled = false;
  }
});

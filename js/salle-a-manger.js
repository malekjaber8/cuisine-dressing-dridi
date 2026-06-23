const DINING_IMAGES = [
  'images/salle a manger/salle a manger .jpeg',
  'images/salle a manger/2.jpeg',
  'images/salle a manger/3.jpeg',
  'images/salle a manger/4.jpeg',
  'images/salle a manger/5.jpeg',
  'images/salle a manger/6.jpeg',
  'images/salle a manger/7.jpeg',
  'images/salle a manger/8.jpeg',
  'images/salle a manger/9.jpeg',
  'images/salle a manger/10.jpeg',
  'images/salle a manger/11.jpeg',
  'images/salle a manger/12.jpeg',
  'images/salle a manger/13.jpeg',
  'images/salle a manger/14.jpeg'
];

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

function renderPhotoGrid() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = DINING_IMAGES.map((path, index) => `
    <figure class="photo-item reveal" data-index="${index}">
      <img src="${encodeURI(path)}" alt="Salle à manger — vue ${index + 1}" loading="lazy">
    </figure>`).join('');

  grid.querySelectorAll('.photo-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index, 10)));
  });

  grid.querySelectorAll('.photo-item').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;
  });
}

renderPhotoGrid();

const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxDots = document.getElementById('lightboxDots');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let activeIndex = 0;

function renderDots() {
  lightboxDots.innerHTML = DINING_IMAGES.map((_, i) =>
    `<span class="lightbox-dot${i === activeIndex ? ' is-active' : ''}" data-index="${i}"></span>`
  ).join('');
  lightboxDots.querySelectorAll('.lightbox-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIndex = parseInt(dot.dataset.index, 10);
      renderLightbox();
    });
  });
}

function renderLightbox() {
  const path = DINING_IMAGES[activeIndex];
  const caption = `Salle à manger — vue ${activeIndex + 1}`;
  const currentImg = lightboxContent.querySelector('img');

  const swapImage = () => {
    lightboxContent.innerHTML = `<img src="${encodeURI(path)}" alt="${caption}" class="is-switching">`;
    requestAnimationFrame(() => {
      lightboxContent.querySelector('img').classList.remove('is-switching');
    });
  };

  if (currentImg) {
    currentImg.classList.add('is-switching');
    setTimeout(swapImage, 150);
  } else {
    swapImage();
  }

  lightboxCaption.textContent = caption;
  lightboxCounter.textContent = `${activeIndex + 1} / ${DINING_IMAGES.length}`;
  renderDots();
}

function openLightbox(index) {
  activeIndex = index;
  renderLightbox();
  lightbox.classList.add('is-open');
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
}

function showPrev() {
  activeIndex = (activeIndex - 1 + DINING_IMAGES.length) % DINING_IMAGES.length;
  renderLightbox();
}

function showNext() {
  activeIndex = (activeIndex + 1) % DINING_IMAGES.length;
  renderLightbox();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

let touchStartX = 0;
lightboxContent.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});
lightboxContent.addEventListener('touchend', (e) => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (delta > 50) showPrev();
  else if (delta < -50) showNext();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

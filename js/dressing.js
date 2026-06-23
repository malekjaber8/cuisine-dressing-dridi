const DRESSING_PROJECTS = [
  { title: 'Dressing', images: ['images/dressing/1.jpeg'] },
  { title: 'Dressing', images: ['images/dressing/2.jpeg'] },
  {
    title: 'Dressing',
    images: [
      'images/dressing/3.jpeg',
      'images/dressing/3 image 2.jpeg'
    ]
  },
  {
    title: 'Dressing',
    images: [
      'images/dressing/4.jpeg',
      'images/dressing/4 image 2.jpeg',
      'images/dressing/4 image 3.jpeg',
      'images/dressing/4 image 4.jpeg',
      'images/dressing/4 image 5.jpeg',
      'images/dressing/4 image 6.jpeg',
      'images/dressing/4 image 7.jpeg'
    ]
  },
  {
    title: 'Dressing',
    images: [
      'images/dressing/5.jpeg',
      'images/dressing/5 image 2.jpeg'
    ]
  }
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

function captionFromFilename(path, index, title) {
  const filename = path.split('/').pop().replace(/\.[^.]+$/, '');
  const cleaned = filename
    .replace(/^\d+\s*image\s*\d+\s*/i, '')
    .replace(/([a-zA-Z])(\d)/, '$1 $2')
    .trim();
  if (cleaned && /[a-zA-Z]/.test(cleaned)) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return `${title} — vue ${index + 1}`;
}

function renderGrid() {
  const grid = document.getElementById('dressingGrid');
  grid.innerHTML = DRESSING_PROJECTS.map((project, index) => `
    <figure class="gallery-item project-card reveal" data-project="${index}">
      <div class="project-media">
        <img src="${encodeURI(project.images[0])}" alt="${project.title}" loading="lazy">
        ${project.images.length > 1 ? `<span class="project-badge">${project.images.length} photos</span>` : ''}
      </div>
      <figcaption class="project-caption">
        <span class="project-title">${project.title}</span>
        <span class="project-cta">Voir ${project.images.length > 1 ? 'les photos' : 'la photo'} →</span>
      </figcaption>
    </figure>`).join('');

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(DRESSING_PROJECTS[card.dataset.project], 0);
    });
  });

  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.06}s`;
  });
}

renderGrid();

const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxDots = document.getElementById('lightboxDots');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let activeProject = null;
let activeIndex = 0;

function renderDots() {
  if (activeProject.images.length <= 1) {
    lightboxDots.innerHTML = '';
    return;
  }
  lightboxDots.innerHTML = activeProject.images.map((_, i) =>
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
  const path = activeProject.images[activeIndex];
  const caption = `${activeProject.title} — ${captionFromFilename(path, activeIndex, activeProject.title)}`;
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
  lightboxCounter.textContent = `${activeIndex + 1} / ${activeProject.images.length}`;
  renderDots();

  const multi = activeProject.images.length > 1;
  lightboxPrev.style.display = multi ? 'flex' : 'none';
  lightboxNext.style.display = multi ? 'flex' : 'none';
}

function openLightbox(project, index) {
  activeProject = project;
  activeIndex = index;
  renderLightbox();
  lightbox.classList.add('is-open');
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  activeProject = null;
}

function showPrev() {
  if (!activeProject) return;
  activeIndex = (activeIndex - 1 + activeProject.images.length) % activeProject.images.length;
  renderLightbox();
}

function showNext() {
  if (!activeProject) return;
  activeIndex = (activeIndex + 1) % activeProject.images.length;
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
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

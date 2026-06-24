const KITCHEN_PROJECTS = [
  {
    title: 'Cuisine 1',
    images: [
      'images/cuisine/cuisine 1/image 1 facade globale.jpeg',
      'images/cuisine/cuisine 1/image 2 .jpeg',
      'images/cuisine/cuisine 1/image 3 .jpeg'
    ]
  },
  {
    title: 'Cuisine 2',
    images: [
      'images/cuisine/cuisine2/vue globale 1.jpeg',
      'images/cuisine/cuisine2/vue2.jpeg',
      'images/cuisine/cuisine2/vue 3.jpeg',
      'images/cuisine/cuisine2/vue4.jpeg',
      'images/cuisine/cuisine2/vue 5.jpeg',
      'images/cuisine/cuisine2/vue 6.jpeg'
    ]
  },
  {
    title: 'Cuisine 3',
    images: [
      'images/cuisine/cuisine 3/vue globale 1.jpg',
      'images/cuisine/cuisine 3/vue 2.jpg',
      'images/cuisine/cuisine 3/vue 3.jpg'
    ]
  },
  {
    title: 'Cuisine 4',
    images: [
      'images/cuisine/cuisine 4/1.jpeg',
      'images/cuisine/cuisine 4/2.jpeg',
      'images/cuisine/cuisine 4/3.jpeg',
      'images/cuisine/cuisine 4/4.jpeg',
      'images/cuisine/cuisine 4/5.jpeg',
      'images/cuisine/cuisine 4/6.jpeg',
      'images/cuisine/cuisine 4/7.jpeg',
      'images/cuisine/cuisine 4/8.jpeg'
    ]
  },
  {
    title: 'Cuisine 5',
    images: [
      'images/cuisine/cuisine 5/1.jpeg',
      'images/cuisine/cuisine 5/2.jpeg',
      'images/cuisine/cuisine 5/3.jpeg',
      'images/cuisine/cuisine 5/4.jpeg',
      'images/cuisine/cuisine 5/5.jpeg',
      'images/cuisine/cuisine 5/6.jpeg',
      'images/cuisine/cuisine 5/7.jpeg'
    ]
  },
  {
    title: 'Cuisine 6',
    images: [
      'images/cuisine/cuisine 6/1.jpeg',
      'images/cuisine/cuisine 6/2.jpeg',
      'images/cuisine/cuisine 6/3.jpeg',
      'images/cuisine/cuisine 6/4.jpeg',
      'images/cuisine/cuisine 6/5.jpeg',
      'images/cuisine/cuisine 6/6.jpeg'
    ]
  },
  {
    title: 'Cuisine 7',
    images: [
      'images/cuisine/cuisine 7/1.jpeg',
      'images/cuisine/cuisine 7/2.jpeg',
      'images/cuisine/cuisine 7/3.jpeg',
      'images/cuisine/cuisine 7/4.jpeg',
      'images/cuisine/cuisine 7/5.jpeg',
      'images/cuisine/cuisine 7/6.jpeg'
    ]
  },
  {
    title: 'Cuisine 8',
    images: [
      'images/cuisine/cuisine 8/1.jpeg',
      'images/cuisine/cuisine 8/2.jpeg',
      'images/cuisine/cuisine 8/3.jpeg',
      'images/cuisine/cuisine 8/4.jpeg',
      'images/cuisine/cuisine 8/5.jpeg'
    ]
  },
  {
    title: 'Cuisine 9',
    images: [
      'images/cuisine/cuisine 9/1.jpeg',
      'images/cuisine/cuisine 9/2.jpeg',
      'images/cuisine/cuisine 9/3.jpeg',
      'images/cuisine/cuisine 9/4.jpeg',
      'images/cuisine/cuisine 9/5.jpeg'
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
    .replace(/^image\s*\d+\s*/i, '')
    .replace(/([a-zA-Z])(\d)/, '$1 $2')
    .trim();
  if (cleaned) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return `${title} — vue ${index + 1}`;
}

function renderGrid() {
  const grid = document.getElementById('kitchenGrid');
  grid.innerHTML = KITCHEN_PROJECTS.map((project, index) => `
    <figure class="gallery-item project-card reveal" data-project="${index}">
      <div class="project-media">
        <img src="${encodeURI(project.images[0])}" alt="${project.title}" loading="lazy">
        <span class="project-badge">${project.images.length} photos</span>
      </div>
      <figcaption class="project-caption">
        <span class="project-title">${project.title}</span>
        <span class="project-cta">Voir les photos →</span>
      </figcaption>
    </figure>`).join('');

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(KITCHEN_PROJECTS[card.dataset.project], 0);
    });
  });

  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
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
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

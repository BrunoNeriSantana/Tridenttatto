const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((el) => observer.observe(el));

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const galleryItems = document.querySelectorAll('.gallery-item');
const gallerySources = Array.from(galleryItems).map((item) => item.getAttribute('data-full'));
let activeImageIndex = -1;

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const fullImage = item.getAttribute('data-full');
    if (!fullImage || !lightbox || !lightboxImage) return;
    activeImageIndex = gallerySources.findIndex((source) => source === fullImage);
    lightboxImage.src = fullImage;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function goToImage(direction) {
  if (!lightboxImage || gallerySources.length < 2) return;
  if (activeImageIndex < 0) {
    activeImageIndex = 0;
  } else {
    activeImageIndex = (activeImageIndex + direction + gallerySources.length) % gallerySources.length;
  }
  lightboxImage.src = gallerySources[activeImageIndex];
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', () => goToImage(-1));
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', () => goToImage(1));
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
  if (lightbox && lightbox.classList.contains('active') && event.key === 'ArrowLeft') {
    goToImage(-1);
  }
  if (lightbox && lightbox.classList.contains('active') && event.key === 'ArrowRight') {
    goToImage(1);
  }
});

const cards = Array.from(document.querySelectorAll('.testimonial-card'));
const controls = document.querySelectorAll('.carousel-btn');
let carouselIndex = 0;
let carouselTimer = null;

function showCard(index) {
  cards.forEach((card, i) => card.classList.toggle('active', i === index));
}

function nextCard(direction = 1) {
  carouselIndex = (carouselIndex + direction + cards.length) % cards.length;
  showCard(carouselIndex);
}

controls.forEach((btn) => {
  btn.addEventListener('click', () => {
    const dir = btn.getAttribute('data-dir') === 'prev' ? -1 : 1;
    nextCard(dir);
    restartCarousel();
  });
});

function startCarousel() {
  if (cards.length < 2) return;
  carouselTimer = setInterval(() => nextCard(1), 4200);
}

function restartCarousel() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
  }
  startCarousel();
}

showCard(carouselIndex);
startCarousel();

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.getAttribute('data-counter'));
    if (!target) return;

    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current.toLocaleString('pt-BR') + '+';
    }, 22);

    counterObserver.unobserve(element);
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

// Ready for paid traffic analytics tagging.
window.dataLayer = window.dataLayer || [];

const trackedLinks = document.querySelectorAll('[data-track="whatsapp-click"]');
trackedLinks.forEach((link) => {
  link.addEventListener('click', () => {
    window.dataLayer.push({
      event: 'whatsapp_click',
      source: 'landing_page',
      timestamp: new Date().toISOString()
    });
  });
});

const header = document.querySelector('.site-header');
function toggleHeaderState() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
}

toggleHeaderState();
window.addEventListener('scroll', toggleHeaderState, { passive: true });

const navLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('main section[id]');

if (navLinks.length && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach((section) => sectionObserver.observe(section));
}

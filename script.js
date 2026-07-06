const sections = Array.from(document.querySelectorAll('.section'));
const sectionDots = Array.from(document.querySelectorAll('.section-dot'));

const activateSection = (id) => {
  sections.forEach((section) => section.classList.toggle('is-active', section.id === id));
  sectionDots.forEach((dot) => {
    const active = dot.dataset.dot === id;
    dot.classList.toggle('bg-emerald-400', active);
    dot.classList.toggle('shadow-[0_0_0_6px_rgba(16,185,129,0.14)]', active);
    dot.classList.toggle('bg-white/30', !active);
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const revealItems = entry.target.querySelectorAll('.reveal');
      if (entry.isIntersecting) {
        activateSection(entry.target.id);
        revealItems.forEach((node) => node.classList.add('is-visible'));
      } else {
        revealItems.forEach((node) => node.classList.remove('is-visible'));
      }
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => observer.observe(section));

const title = document.getElementById('typing-title');
const titleText = title.textContent.trim();
title.textContent = '';
let index = 0;

const typeTitle = () => {
  title.textContent = titleText.slice(0, index);
  index += 1;
  if (index <= titleText.length) {
    window.setTimeout(typeTitle, 58);
  }
};

window.setTimeout(typeTitle, 260);

const syncCarousel = (carouselRoot) => {
  const track = carouselRoot.querySelector('[data-carousel]');
  const slides = Array.from(carouselRoot.querySelectorAll('.carousel-slide'));
  const prevButton = carouselRoot.querySelector('[data-carousel-prev]');
  const nextButton = carouselRoot.querySelector('[data-carousel-next]');
  const dotsWrapper = carouselRoot.querySelector('[data-carousel-dots]');
  let activeIndex = 0;

  const dots = slides.map((_, slideIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'h-2 w-2.5 rounded-full bg-white/25 transition-all duration-300';
    dot.setAttribute('aria-label', `Lompat ke slide ${slideIndex + 1}`);
    dot.addEventListener('click', () => {
      slides[slideIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
    dotsWrapper.appendChild(dot);
    return dot;
  });

  const updateState = () => {
    const trackLeft = track.getBoundingClientRect().left;
    const nearest = slides.reduce(
      (best, slide, slideIndex) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        return distance < best.distance ? { index: slideIndex, distance } : best;
      },
      { index: 0, distance: Infinity }
    );

    activeIndex = nearest.index;
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === activeIndex;
      dot.classList.toggle('w-6', active);
      dot.classList.toggle('w-2.5', !active);
      dot.classList.toggle('bg-emerald-400', active && (carouselRoot.closest('#project-1') !== null));
      dot.classList.toggle('bg-indigo-400', active && (carouselRoot.closest('#project-2') !== null));
      dot.classList.toggle('bg-cyan-400', active && (carouselRoot.closest('#project-3') !== null));
      if (!active) {
        dot.classList.remove('bg-emerald-400', 'bg-indigo-400', 'bg-cyan-400');
        dot.classList.add('bg-white/25');
      } else {
        dot.classList.remove('bg-white/25');
      }
    });
  };

  prevButton.addEventListener('click', () => {
    const nextIndex = Math.max(0, activeIndex - 1);
    slides[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  });

  nextButton.addEventListener('click', () => {
    const nextIndex = Math.min(slides.length - 1, activeIndex + 1);
    slides[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  });

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateState);
  });

  window.addEventListener('resize', updateState);
  updateState();
};

document.querySelectorAll('[data-carousel]').forEach((track) => syncCarousel(track.parentElement));
document.getElementById('year').textContent = new Date().getFullYear();
activateSection('hero');

// Lightbox Modal Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

// Find all zoomable images in the portfolio carousels
const zoomableImages = document.querySelectorAll('.carousel-slide img');
zoomableImages.forEach((img) => {
  img.classList.add('cursor-zoom-in');
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    const container = lightbox.querySelector('.lightbox-container');
    if (container) {
      container.classList.remove('scale-95');
      container.classList.add('scale-100');
    }
  });
});

const closeLightbox = () => {
  lightbox.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = ''; // Unlock background scroll
  const container = lightbox.querySelector('.lightbox-container');
  if (container) {
    container.classList.remove('scale-100');
    container.classList.add('scale-95');
  }
};

lightboxClose.addEventListener('click', closeLightbox);

// Close on clicking the background (outside the image container)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close on Escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.classList.contains('opacity-0')) {
    closeLightbox();
  }
});

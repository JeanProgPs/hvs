/* =========================================
   SHOW MENU
   ========================================= */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/* Remove Menu Mobile */
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/* =========================================
   CHANGE BACKGROUND HEADER
   ========================================= */
const scrollHeader = () => {
    const header = document.getElementById('header') || document.querySelector('.header');
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}
window.addEventListener('scroll', scrollHeader);

/* =========================================
   ACCORDION FAQ
   ========================================= */
const accordionItems = document.querySelectorAll('.accordion__item');

accordionItems.forEach((item) => {
    const accordionHeader = item.querySelector('.accordion__header');

    // Ensure initial aria state
    if (accordionHeader && !accordionHeader.hasAttribute('aria-expanded')) {
        accordionHeader.setAttribute('aria-expanded', 'false');
    }

    accordionHeader.addEventListener('click', () => {
        const openItem = document.querySelector('.accordion-open');

        toggleItem(item);

        if (openItem && openItem !== item) {
            toggleItem(openItem);
        }
    });

    // Keyboard support: Enter / Space
    accordionHeader.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            accordionHeader.click();
        }
    });
});

const toggleItem = (item) => {
    const accordionHeader = item.querySelector('.accordion__header');
    const accordionContent = item.querySelector('.accordion__content');

    if (item.classList.contains('accordion-open')) {
        accordionContent.style.height = '0';
        item.classList.remove('accordion-open');
        if (accordionHeader) accordionHeader.setAttribute('aria-expanded', 'false');
    } else {
        accordionContent.style.height = accordionContent.scrollHeight + 'px';
        item.classList.add('accordion-open');
        if (accordionHeader) accordionHeader.setAttribute('aria-expanded', 'true');
    }
}

/* =========================================
   SCROLL REVEAL ANIMATION
   ========================================= */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles and observe
const revealElements = document.querySelectorAll('.section__title, .section__subtitle, .sobre__img-wrapper, .servico__card, .diferencial__card, .galeria__img, .depoimento__card, .accordion__item');

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

/* =========================================
   PRELOADER
   ========================================= */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }
});

/* =========================================
   MODAL DE FOTOS DA ROTA
   ========================================= */
const routeImages = {
    cultural: [
        { src: 'assets/Cultural1.jpeg', alt: 'Turismo Cultural 1' },
        { src: 'assets/cultural2.jpeg', alt: 'Turismo Cultural 2' },
        { src: 'assets/Cultural3.jpeg', alt: 'Turismo Cultural 3' }
    ],
    cervejeira: [
        { src: 'assets/rota_cervejeira_1779235020895.png', alt: 'Rota Cervejeira - Degustação' },
        { src: 'assets/galeria_1_1778714689003.png', alt: 'Cervejaria Artesanal' }
    ],
    queijo: [
        { src: 'assets/rota_do_queijo_1779235067915.png', alt: 'Rota do Queijo - Degustação' },
        { src: 'assets/galeria_2_1778714859729.png', alt: 'Fazenda de Queijos' }
    ],
    pedagogico: [
        { src: 'assets/turismo_pedagogico_1779235900196.png', alt: 'Turismo Pedagógico' },
        { src: 'assets/galeria_3_1778715173962.png', alt: 'Grupo em Atividade' }
    ],
    rural: [
        { src: 'assets/sobre_mim.jpg', alt: 'Turismo Rural - Fazenda' },
        { src: 'assets/hero_cultural_premium_1779234977188.png', alt: 'Vivência no Campo' }
    ],
    aves: [
        { src: 'assets/observacao_aves_1779235850294.png', alt: 'Observação de Aves na Mata' },
        { src: 'assets/galeria1.jpg', alt: 'Biodiversidade Local' }
    ]
};

const routeTitles = {
    cultural: "Fotos: Turismo Cultural",
    cervejeira: "Fotos: Rota Cervejeira",
    queijo: "Fotos: Rota do Queijo",
    pedagogico: "Fotos: Turismo Pedagógico",
    rural: "Fotos: Turismo Rural",
    aves: "Fotos: Observação de Aves"
};

const modal = document.getElementById('photo-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalGallery = document.getElementById('modal-gallery');
const btnFotos = document.querySelectorAll('.servico__btn-fotos');

const openModal = (route) => {
    // Set Title
    modalTitle.textContent = routeTitles[route] || "Fotos da Rota";

    // Clear old images
    modalGallery.innerHTML = '';

    // Inject new images
    const images = routeImages[route];
    if (images && images.length > 0) {
        images.forEach(imgData => {
            const imgEl = document.createElement('img');
            imgEl.src = imgData.src;
            imgEl.alt = imgData.alt;
            imgEl.loading = 'lazy';
            modalGallery.appendChild(imgEl);
        });
    } else {
        modalGallery.innerHTML = '<p style="text-align: center; color: var(--text-color-light);">Nenhuma foto disponível no momento.</p>';
    }

    // Show Modal
    modal.classList.add('show-modal');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

const closeModal = () => {
    modal.classList.remove('show-modal');
    document.body.style.overflow = ''; // Restore scrolling
};

// Event Listeners for Buttons
btnFotos.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const route = btn.getAttribute('data-route');
        if (route) {
            openModal(route);
        }
    });
});

// Event Listeners for Closing Modal
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

// Close on Escape Key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('show-modal')) {
        closeModal();
    }
});

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

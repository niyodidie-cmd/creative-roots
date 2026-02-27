/* ============================================
   CREATIVE ROOTS RWANDA - ENHANCED JAVASCRIPT
   Handles: Slideshow, Parallax, Animations, Interactions
   ============================================ */

// ============================================
// 0. HERO SLIDESHOW SYSTEM - With smooth fade & Ken Burns
// ============================================

let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const slideshowTexts = [
    'Everyone Has Hidden Power.',
    'Art Gives It a Voice.',
    'Stories Build Strong Communities.',
    'Creativity Changes Lives.'
];

function initSlideshow() {
    // Show first slide
    showSlide(0);
    
    // Auto-advance slides every 5 seconds with 1.2s fade transition
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5200); // 5 seconds display + 200ms for smooth transition
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(slideInterval);
            currentSlide = index;
            showSlide(currentSlide);
            // Restart auto-advance
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }, 5200);
        });
    });
}

function showSlide(n) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide with fade transition
    slides[n].classList.add('active');
    indicators[n].classList.add('active');
    
    // Update hero title text with smooth fade
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.transition = 'opacity 0.4s ease';
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.textContent = slideshowTexts[n];
            heroTitle.style.opacity = '1';
        }, 200);
    }
}

// ============================================
// 1. NAVIGATION - HAMBURGER MENU
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Toggle mobile menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.style.transition = 'all 0.3s ease');
        
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(10px, 10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) {
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// ============================================
// 2. INTERSECTION OBSERVER - SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger animations
            entry.target.classList.add('animate-active');
            
            // For fade-on-scroll elements
            if (entry.target.classList.contains('fade-on-scroll')) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
            
            // For image animations
            if (entry.target.classList.contains('image-wrapper') || 
                entry.target.classList.contains('gallery-item')) {
                entry.target.classList.add('image-slide-in');
            }
            
            // For section headers
            if (entry.target.classList.contains('section-title')) {
                entry.target.classList.add('section-header-animate');
            }
            
            // For text content
            if (entry.target.classList.contains('text-animation-trigger')) {
                entry.target.classList.add('active');
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply observer to elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-on-scroll, .project-card, .testimonial-card, .gallery-item, .image-wrapper, .section-title, .text-content p');
    
    fadeElements.forEach(element => {
        if (!element.classList.contains('fade-on-scroll') || !element.style.opacity) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        }
        observer.observe(element);
    });
});

// ============================================
// 3. PARALLAX SCROLL EFFECT
// ============================================

window.addEventListener('scroll', () => {
    const scrollLevel = window.scrollY;
    const parallaxElements = document.querySelectorAll('.parallax-element, .hero-slide-image');
    
    parallaxElements.forEach(element => {
        if (element.dataset.parallax !== 'false') {
            const offset = scrollLevel * 0.5;
            element.style.transform = `translateY(${offset}px)`;
        }
    });
});

// ============================================
// 4. COUNTER ANIMATION - IMPACT NUMBERS
// ============================================

let countersAnimated = false;

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                counter.classList.add('counter-animate');
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

const impactSection = document.querySelector('.impact-section');
if (impactSection) {
    const impactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
                
                // Add applaud effect to impact cards
                const impactCards = document.querySelectorAll('.impact-card');
                impactCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('impact-pulse');
                    }, index * 100);
                });
                
                impactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    impactObserver.observe(impactSection);
}

// ============================================
// 5. GALLERY - MODAL POPUP WITH ANIMATIONS
// ============================================

const galleryItems = document.querySelectorAll('.gallery-item');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.querySelector('.modal-close');

// Gallery data
const galleryData = {
    'modal-1': {
        title: 'Abstract Dreams',
        description: 'A vibrant exploration of form and color, representing the boundless creativity within our youth.',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23D4A373" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle"%3E🎨%3C/text%3E%3C/svg%3E'
    },
    'modal-2': {
        title: 'Cultural Sculpture',
        description: 'Traditional forms reimagined for modern times, honoring our heritage while embracing innovation.',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%238B5E3C" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle"%3E🗿%3C/text%3E%3C/svg%3E'
    },
    'modal-3': {
        title: 'Community Stories',
        description: 'Visual narratives that weave together the diverse voices and experiences of our community.',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23FDF6EC" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle"%3E🖼️%3C/text%3E%3C/svg%3E'
    },
    'modal-4': {
        title: 'Creativity Unleashed',
        description: 'When barriers dissolve and confidence blooms, creativity knows no limits.',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23D4A373" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle"%3E✨%3C/text%3E%3C/svg%3E'
    },
    'modal-5': {
        title: 'Hidden Talent',
        description: 'Every brushstroke, every word, reveals the extraordinary potential within.',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%238B5E3C" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle"%3E🌟%3C/text%3E%3C/svg%3E'
    },
    'modal-6': {
        title: 'Artistic Expression',
        description: 'A celebration of voices finding their power through art and storytelling.',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23FDF6EC" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="120" text-anchor="middle" dominant-baseline="middle"%3E💎%3C/text%3E%3C/svg%3E'
    }
};

// Add applaud animation to gallery items on hover
galleryItems.forEach(item => {
    item.classList.add('image-hover-glow', 'image-hover-zoom');
    
    item.addEventListener('mouseenter', () => {
        item.style.filter = 'drop-shadow(0 0 20px rgba(212, 163, 115, 0.8))';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.filter = 'drop-shadow(0 0 0px)';
    });
    
    item.addEventListener('click', () => {
        const modalId = item.getAttribute('data-modal');
        const data = galleryData[modalId];
        
        if (data) {
            modalImage.src = data.image;
            modalTitle.textContent = data.title;
            modalDescription.textContent = data.description;
            modalBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add zoom animation
            document.querySelector('.modal-content').style.animation = 'slideUp 0.3s ease';
        }
    });
});

// Close modal with animations
function closeModal() {
    const modalContent = document.querySelector('.modal-content');
    modalContent.style.animation = 'slideDown 0.3s ease';
    
    setTimeout(() => {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    }, 300);
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
        closeModal();
    }
});

// ============================================
// 6. DROPDOWN MENU - HOVER FUNCTIONALITY
// ============================================

const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (menu) {
        dropdown.addEventListener('mouseenter', () => {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
        });
        
        dropdown.addEventListener('mouseleave', () => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
        });
    }
});

// ============================================
// 7. SMOOTH SCROLL BEHAVIOR
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// 8. NAVBAR SCROLL EFFECT & HOVER GLOW
// ============================================

const navbar = document.querySelector('.navbar');
const btns = document.querySelectorAll('.btn');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Add glow effect to buttons
btns.forEach(btn => {
    if (!btn.classList.contains('animate-glow-hover')) {
        btn.classList.add('animate-glow-hover');
    }
});

// ============================================
// 9. ACTIVE NAV LINK HIGHLIGHTING
// ============================================

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// 10. SECTION-SPECIFIC ANIMATIONS
// ============================================

function setupSectionAnimations() {
    // Animate section headers
    const sectionHeaders = document.querySelectorAll('.section-title');
    sectionHeaders.forEach(header => {
        header.classList.add('section-header-animate');
    });
    
    // Animate project cards with stagger
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('animate-bounce-in', `stagger-${index + 1}`);
    });
    
    // Animate testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.classList.add('testimonial-animate', `stagger-${index + 1}`);
    });
    
    // Add hover lift to cards
    const allCards = document.querySelectorAll('.project-card, .testimonial-card, .impact-card');
    allCards.forEach(card => {
        card.classList.add('card-lift');
    });
}

// ============================================
// 11. CTA ANIMATIONS
// ============================================

function setupCTAAnimations() {
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const ctaTitle = ctaSection.querySelector('.cta-title');
        if (ctaTitle) {
            ctaTitle.classList.add('cta-bounce');
        }
    }
}

// ============================================
// 12. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Creative Roots Rwanda - Enhanced with Dynamic Animations ✨');
    
    // Initialize slideshow
    initSlideshow();
    
    // Setup all animations
    setupSectionAnimations();
    setupCTAAnimations();
    
    // Log features
    console.log('✅ Features loaded:');
    console.log('   • Hero slideshow with parallax');
    console.log('   • Scroll-triggered animations');
    console.log('   • Glow and hover effects');
    console.log('   • Modal animations');
    console.log('   • Counter animations');
    console.log('   • Parallax effects');
});

// ============================================
// 13. KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Quick navigation with number keys
    if (e.key === '1') document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    else if (e.key === '2') document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    else if (e.key === '3') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    else if (e.key === '4') document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
    else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        clearInterval(slideInterval);
        showSlide(--currentSlide);
    }
    else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        clearInterval(slideInterval);
        showSlide(++currentSlide);
    }
});

// ============================================
// 14. APPLAUD ANIMATION TRIGGER
// ============================================

// Add applaud effect to highlighted gallery items
function triggerApplaudEffect(element) {
    if (element) {
        element.classList.add('animate-applaud');
        setTimeout(() => {
            element.classList.remove('animate-applaud');
        }, 1200);
    }
}

// Periodically applaud a random gallery item
setInterval(() => {
    const randomGallery = document.querySelectorAll('.gallery-item');
    if (randomGallery.length > 0) {
        const randomItem = randomGallery[Math.floor(Math.random() * randomGallery.length)];
        triggerApplaudEffect(randomItem);
    }
}, 5000);

console.log('✨ Animation system fully initialized!');

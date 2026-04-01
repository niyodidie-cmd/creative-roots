/* ============================================
   INKINGI CREATIVE HUB - MAIN JAVASCRIPT
   Clean, Professional, Fully Functional
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroSlider();
    loadDynamicContent();
    initForms();
    initGalleryModal();
    initEventBookingModal();
    initScrollAnimations();
});

// ============================================
// 1. NAVIGATION
// ============================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Handle dropdown clicks for mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Only prevent default and handle click on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = toggle.parentElement;
                dropdown.classList.toggle('active');
            }
        });
    });

    // Update admin link based on login status
    updateAdminLink();
}

function updateAdminLink() {
    const adminLink = document.getElementById('admin-link');
    if (!adminLink) return;

    const token = localStorage.getItem('admin_token');
    if (token) {
        adminLink.textContent = 'Dashboard';
        adminLink.href = 'admin/dashboard.html';
    } else {
        adminLink.textContent = 'Login';
        adminLink.href = 'admin/login.html';
    }
}

// ============================================
// 2. HERO SLIDER - Automatic Image Slider
// ============================================

function initHeroSlider() {
    const slider = document.getElementById('hero-slider');
    const indicators = document.getElementById('slider-indicators');

    if (!slider || !indicators) return;

    // Load applauded gallery images for slider
    fetch('/api/gallery')
        .then(response => response.json())
        .then(images => {
            const applaudedImages = images.filter(img => img.applauded && img.orientation === 'landscape');
            if (applaudedImages.length > 0) {
                createHeroSlides(applaudedImages);
            } else {
                // Fallback to default slide
                createDefaultHeroSlide();
            }
        })
        .catch(err => {
            console.error('Failed to load hero images:', err);
            createDefaultHeroSlide();
        });
}

function createHeroSlides(images) {
    const slider = document.getElementById('hero-slider');
    const indicators = document.getElementById('slider-indicators');

    slider.innerHTML = '';
    indicators.innerHTML = '';

    images.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(${image.image_url})`;
        slider.appendChild(slide);

        // Create indicator
        const indicator = document.createElement('span');
        indicator.className = index === 0 ? 'active' : '';
        indicator.addEventListener('click', () => showSlide(index));
        indicators.appendChild(indicator);
    });

    // Start automatic slideshow
    startSlideshow(images.length);
}

function createDefaultHeroSlide() {
    const slider = document.getElementById('hero-slider');
    const indicators = document.getElementById('slider-indicators');

    slider.innerHTML = '<div class="hero-slide active" style="background: linear-gradient(135deg, #8B5E3C, #D4A373);"></div>';
    indicators.innerHTML = '<span class="active"></span>';
}

function showSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.slider-indicators span');

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

function startSlideshow(totalSlides) {
    let currentSlide = 0;

    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }, 5000); // Change slide every 5 seconds
}

// ============================================
// 3. DYNAMIC CONTENT LOADING
// ============================================

function loadDynamicContent() {
    loadSocialMedia();
    loadAboutContent();
    loadImpactStats();
    loadTestimonials();
    loadEvents();
    loadGallery();
    loadLogo();
}

// Load social media links
function loadSocialMedia() {
    fetch('/api/social-media')
        .then(response => response.json())
        .then(links => {
            updateSocialNav(links);
            updateFooterSocial(links);
        })
        .catch(err => console.error('Failed to load social media:', err));
}

function updateSocialNav(links) {
    const nav = document.getElementById('social-media-nav');
    if (!nav) return;

    nav.innerHTML = '';
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.className = 'social-nav-link';
        a.innerHTML = `<i class="${link.icon_class}"></i>`;
        a.title = link.platform;
        nav.appendChild(a);
    });
}

function updateFooterSocial(links) {
    const footer = document.getElementById('footer-social-icons');
    if (!footer) return;

    footer.innerHTML = '';
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.innerHTML = `<i class="${link.icon_class}"></i>`;
        footer.appendChild(a);
    });
}

// Load About Us content
function loadAboutContent() {
    const sections = ['who_we_are', 'mission', 'vision'];

    sections.forEach(section => {
        fetch(`/api/content-sections/${section}`)
            .then(response => response.json())
            .then(data => {
                const contentElement = document.getElementById(`${section}-content`);
                const imageElement = document.getElementById(`${section}-image`);

                if (contentElement) contentElement.textContent = data.content;
                if (imageElement && data.image_url) {
                    imageElement.src = data.image_url;
                    imageElement.style.display = 'block';
                }
            })
            .catch(err => console.error(`Failed to load ${section}:`, err));
    });
}

// Load impact statistics
function loadImpactStats() {
    const grid = document.getElementById('impact-grid');
    if (!grid) return;

    fetch('/api/impact-stats')
        .then(response => response.json())
        .then(stats => {
            grid.innerHTML = '';
            stats.forEach(stat => {
                const card = document.createElement('div');
                card.className = 'impact-card';
                card.innerHTML = `
                    <div class="impact-number counter" data-target="${stat.value}">0</div>
                    <p class="impact-label">${stat.label}</p>
                `;
                grid.appendChild(card);
            });
            initCounters();
        })
        .catch(err => console.error('Failed to load impact stats:', err));
}

// Load testimonials
function loadTestimonials() {
    const slider = document.getElementById('testimonials-slider');
    if (!slider) return;

    fetch('/api/testimonials')
        .then(response => response.json())
        .then(testimonials => {
            slider.innerHTML = '';
            testimonials.forEach(testimonial => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                card.innerHTML = `
                    <div class="testimonial-content">
                        <p>"${testimonial.quote}"</p>
                        <div class="testimonial-author">
                            <img src="${testimonial.image_url || 'images/default-avatar.jpg'}" alt="${testimonial.name}" class="testimonial-avatar" onerror="this.style.display='none'">
                            <span>${testimonial.name}</span>
                        </div>
                    </div>
                `;
                slider.appendChild(card);
            });
        })
        .catch(err => console.error('Failed to load testimonials:', err));
}

// Load events
function loadEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    fetch('/api/events')
        .then(response => response.json())
        .then(events => {
            grid.innerHTML = '';
            events.forEach(event => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.innerHTML = `
                    <div class="event-image">
                        <img src="${event.image_url || 'images/default-event.jpg'}" alt="${event.title}">
                    </div>
                    <div class="event-content">
                        <h3>${event.title}</h3>
                        <p class="event-date">${new Date(event.date).toLocaleDateString()}</p>
                        <p class="event-description">${event.description}</p>
                        <button class="btn btn-primary book-event-btn" data-event-id="${event.id}">Book Now</button>
                    </div>
                `;
                grid.appendChild(card);
            });

            // Add event booking listeners
            initEventBooking();
        })
        .catch(err => console.error('Failed to load events:', err));
}

// Load gallery
function loadGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    fetch('/api/gallery')
        .then(response => response.json())
        .then(items => {
            grid.innerHTML = '';
            items.forEach(item => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${item.image_url}" alt="${item.title}" data-modal-src="${item.image_url}" data-modal-title="${item.title}" data-modal-desc="${item.description || ''}">
                `;
                grid.appendChild(galleryItem);
            });
        })
        .catch(err => console.error('Failed to load gallery:', err));
}

// Load logo
function loadLogo() {
    fetch('/api/logo')
        .then(response => response.json())
        .then(logo => {
            const logoElements = document.querySelectorAll('.logo-image');
            logoElements.forEach(img => {
                if (logo && logo.image_url) {
                    img.src = logo.image_url;
                    img.style.display = 'block';
                } else {
                    img.style.display = 'none';
                }
            });
        })
        .catch(err => console.error('Failed to load logo:', err));
}

// ============================================
// 4. FORM HANDLING
// ============================================

function initForms() {
    initContactForm();
    initVolunteerForm();
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                document.getElementById('contactSuccess').style.display = 'block';
                document.getElementById('contactError').style.display = 'none';
                form.reset();
                setTimeout(() => {
                    document.getElementById('contactSuccess').style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            document.getElementById('contactError').style.display = 'block';
            document.getElementById('contactSuccess').style.display = 'none';
        }
    });
}

function initVolunteerForm() {
    const form = document.getElementById('volunteerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                document.getElementById('volunteerSuccess').style.display = 'block';
                document.getElementById('volunteerError').style.display = 'none';
                form.reset();
                setTimeout(() => {
                    document.getElementById('volunteerSuccess').style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Failed to submit application');
            }
        } catch (error) {
            console.error('Volunteer form error:', error);
            document.getElementById('volunteerError').style.display = 'block';
            document.getElementById('volunteerSuccess').style.display = 'none';
        }
    });
}

// ============================================
// 5. EVENT BOOKING
// ============================================

function initEventBooking() {
    const bookButtons = document.querySelectorAll('.book-event-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const eventId = e.target.getAttribute('data-event-id');
            openEventBookingModal(eventId);
        });
    });
}

function openEventBookingModal(eventId) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventBookingForm');

    document.getElementById('bookingEventId').value = eventId;
    modal.style.display = 'flex';

    // Reset form
    form.reset();
    document.getElementById('bookingSuccess').style.display = 'none';
    document.getElementById('bookingError').style.display = 'none';
}

function initEventBookingModal() {
    const modal = document.getElementById('eventModal');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('eventBookingForm');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                document.getElementById('bookingSuccess').style.display = 'block';
                document.getElementById('bookingError').style.display = 'none';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 3000);
            } else {
                throw new Error('Failed to book event');
            }
        } catch (error) {
            console.error('Event booking error:', error);
            document.getElementById('bookingError').style.display = 'block';
            document.getElementById('bookingSuccess').style.display = 'none';
        }
    });
}

// ============================================
// 6. GALLERY MODAL
// ============================================

function initGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const closeBtn = modal.querySelector('.modal-close');

    // Add click listeners to gallery images
    document.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-item img')) {
            const img = e.target;
            modalImage.src = img.getAttribute('data-modal-src');
            modalTitle.textContent = img.getAttribute('data-modal-title');
            modalDesc.textContent = img.getAttribute('data-modal-desc');
            modal.style.display = 'flex';
        }
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ============================================
// 7. ANIMATIONS & EFFECTS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-on-scroll');
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// Counter animation for impact stats
function initCounters() {
    const impactSection = document.querySelector('.impact-section');
    if (!impactSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(impactSection);
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// ============================================
// 6. GALLERY MODAL
// ============================================

function initGalleryModal() {
    const modal = document.getElementById('modalBackdrop');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.modal-close');

    if (!modal) return;

    // Add click listeners to gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.getAttribute('data-modal-src');
            modalTitle.textContent = img.getAttribute('data-modal-title');
            modalDesc.textContent = img.getAttribute('data-modal-desc');
            modal.style.display = 'flex';
        });
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function initModalBackdrop() {
    // Ensure modal is hidden on page load
    const modal = document.getElementById('modalBackdrop');
    if (modal) {
        modal.style.display = 'none';
    }
}
            <div class="hero-overlay">
                <div class="hero-content">
                    <h1 class="hero-title">${item.title}</h1>
                    <p class="hero-subtitle">${item.description || ''}</p>
                </div>
            </div>
        `;
        heroSection.appendChild(slide);
    });

    // Create indicators
    const indicatorsContainer = heroSection.querySelector('.slideshow-indicators') || document.createElement('div');
    indicatorsContainer.className = 'slideshow-indicators';
    indicatorsContainer.innerHTML = '';
    items.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => showSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    heroSection.appendChild(indicatorsContainer);

    // Auto-advance
    let currentSlide = 0;
    setInterval(() => {
        showSlide((currentSlide + 1) % items.length);
    }, 6000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    slides.forEach(s => s.classList.remove('active'));
    indicators.forEach(i => i.classList.remove('active'));
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function initHeroText() {
    const heroTexts = [
        'Everyone Has Hidden Power.',
        'Art Gives It a Voice.',
        'Stories Build Strong Communities.',
        'Creativity Changes Lives.'
    ];

    let textIndex = 0;
    const heroTitle = document.querySelector('.hero-title');

    if (!heroTitle) return;

    function changeHeroText() {
        heroTitle.textContent = heroTexts[textIndex];
        heroTitle.classList.remove('fade-text');
        void heroTitle.offsetWidth;
        heroTitle.classList.add('fade-text');
        textIndex = (textIndex + 1) % heroTexts.length;
    }

    setInterval(changeHeroText, 4000);
}

// ============================================
// 3. SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-on-scroll');
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// ============================================
// 4. COUNTER ANIMATION
// ============================================

let countersAnimated = false;

function initCounters() {
    const impactSection = document.querySelector('.impact-section');
    if (!impactSection) return;

    const impactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
                impactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    impactObserver.observe(impactSection);
}

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
                setTimeout(updateCounter, 50);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ============================================
// 5. GALLERY MANAGEMENT
// ============================================

function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    fetch('/api/gallery')
        .then(response => response.json())
        .then(items => {
            galleryGrid.innerHTML = '';

            items.forEach(item => {
                const galleryItem = document.createElement('div');
                galleryItem.className = `gallery-item fade-on-scroll ${item.orientation}`;
                galleryItem.innerHTML = `
                    <img src="${item.image_url}" alt="${item.title}" onerror="this.src='images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png';">
                    <div class="gallery-overlay">
                        <p class="gallery-title">${item.title}</p>
                        <p class="gallery-artist">${item.category}</p>
                    </div>
                `;

                galleryItem.addEventListener('click', () => {
                    openGalleryModal(item);
                });

                galleryGrid.appendChild(galleryItem);
            });

            // Re-apply scroll animations
            initScrollAnimations();
        })
        .catch(err => {
            console.error('Failed to load gallery:', err);
        });
}

function initVolunteerSection() {
    const volunteerForm = document.getElementById('volunteerForm');
    if (!volunteerForm) return;

    volunteerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('volunteerName').value.trim();
        const email = document.getElementById('volunteerEmail').value.trim();
        const phone = document.getElementById('volunteerPhone').value.trim();
        const skills = document.getElementById('volunteerSkills').value.trim();
        const interests = document.getElementById('volunteerInterests').value.trim();

        const successEl = document.getElementById('volunteerSuccess');
        const errorEl = document.getElementById('volunteerError');
        errorEl.style.display = 'none';
        successEl.style.display = 'none';

        if (!name || !email || !phone || !skills || !interests) {
            errorEl.textContent = 'Please fill all fields.';
            errorEl.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/api/volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, skills, interests })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Unable to submit volunteer form');

            successEl.style.display = 'block';
            volunteerForm.reset();
        } catch (err) {
            errorEl.textContent = err.message || 'Unable to submit. Please try again.';
            errorEl.style.display = 'block';
        }
    });
}

function openGalleryModal(item) {
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    if (modalBackdrop && modalImage && modalTitle && modalDescription) {
        modalImage.src = item.image;
        modalImage.onerror = function() { this.src = 'images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png'; };
        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// ============================================
// 6. MODAL BACKDROP
// ============================================

function initModalBackdrop() {
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.querySelector('.modal-close');

    if (!modalBackdrop) return;

    function closeModal() {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ============================================
// 7. EVENTS DISPLAY
// ============================================

async function initEvents() {
    const eventsGrid = document.getElementById('events-grid');
    if (!eventsGrid) return;

    await displayEvents();
    window.addEventListener('languageChanged', displayEvents);
}

async function displayEvents() {
    const eventsGrid = document.getElementById('events-grid');
    if (!eventsGrid) return;

    let events = [];
    try {
        const data = await api.getEvents();
        events = data || [];
    } catch (err) {
        console.error('Failed to load events:', err);
    }

    eventsGrid.innerHTML = '';

    events.forEach(event => {
        const spotsLeft = event.capacity - (event.booked || 0);
        const isFull = spotsLeft <= 0;

        const eventCard = document.createElement('div');
        eventCard.className = 'event-card fade-on-scroll';
        eventCard.innerHTML = `
            <div class="event-image">
                <img src="${event.image_url || event.image || ''}" alt="${event.title}" onerror="this.src='images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png';" loading="lazy">
            </div>
            <div class="event-content">
                <h3>${event.title}</h3>
                <p>${event.description || ''}</p>
                <div class="event-details">
                    <span>📅 ${event.date}</span>
                    <span>⏰ ${event.time || ''}</span>
                    <span>📍 ${event.location || ''}</span>
                </div>
                <div class="event-capacity">
                    <div class="capacity-bar">
                        <div class="capacity-fill" style="width: ${event.capacity ? ((event.booked || 0) / event.capacity) * 100 : 0}%"></div>
                    </div>
                    <p>${event.booked || 0}/${event.capacity || 0} ${LanguageManager.t('events.capacity')}</p>
                </div>
                <button class="btn btn-primary event-book-btn" data-event-id="${event.id}" ${isFull ? 'disabled' : ''}>
                    ${isFull ? LanguageManager.t('events.full') : LanguageManager.t('events.book')}
                </button>
            </div>
        `;

        eventsGrid.appendChild(eventCard);

        const bookBtn = eventCard.querySelector('.event-book-btn');
        if (!isFull) {
            bookBtn.addEventListener('click', () => {
                openBookingModal(event);
            });
        }
    });

    initScrollAnimations();
}

// ============================================
// 8. BOOKING MODAL
// ============================================

let selectedEventForBooking = null;

function openBookingModal(event) {
    selectedEventForBooking = event;
    const modal = document.getElementById('bookingModal') || createBookingModal();
    const eventNameInput = modal.querySelector('#eventNameDisplay');
    if (eventNameInput) {
        eventNameInput.textContent = event.title;
    }
    modal.style.display = 'flex';
}

function createBookingModal() {
    const modal = document.createElement('div');
    modal.id = 'bookingModal';
    modal.className = 'booking-modal-backdrop';
    modal.innerHTML = `
        <div class="booking-modal">
            <button class="modal-close" onclick="document.getElementById('bookingModal').style.display = 'none';">&times;</button>
            <h2>${LanguageManager.t('booking.modal_title')}</h2>
            <p id="eventNameDisplay"></p>
            <form id="bookingForm">
                <div class="form-group">
                    <label>${LanguageManager.t('booking.name')}</label>
                    <input type="text" id="bookingName" required>
                </div>
                <div class="form-group">
                    <label>${LanguageManager.t('booking.email')}</label>
                    <input type="email" id="bookingEmail" required>
                </div>
                <div class="form-group">
                    <label>${LanguageManager.t('booking.phone')}</label>
                    <input type="tel" id="bookingPhone" required>
                </div>
                <div class="form-group">
                    <label>${LanguageManager.t('booking.attendees')}</label>
                    <input type="number" id="bookingAttendees" min="1" value="1" required>
                </div>
                <button type="submit" class="btn btn-primary">${LanguageManager.t('booking.submit')}</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    const form = modal.querySelector('#bookingForm');
    form.addEventListener('submit', submitBooking);

    return modal;
}

async function submitBooking(e) {
    e.preventDefault();

    if (!selectedEventForBooking) return;

    const name = document.getElementById('bookingName').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const attendees = parseInt(document.getElementById('bookingAttendees').value, 10);

    const event = selectedEventForBooking;
    const spotsLeft = event.capacity - (event.booked || 0);

    if (attendees > spotsLeft) {
        alert(`Only ${spotsLeft} spots available`);
        return;
    }

    try {
        const resp = await api.createBooking({
            name,
            email,
            phone,
            attendees,
            eventId: event.id
        });

        if (resp && resp.success) {
            showNotification(
                LanguageManager.t('booking.success'),
                LanguageManager.t('booking.message')
            );
            const modal = document.getElementById('bookingModal');
            modal.style.display = 'none';
            document.getElementById('bookingForm').reset();
            await displayEvents();
        }
    } catch (err) {
        console.error('Booking failed:', err);
        alert(err.message || 'Booking could not be completed');
    }
}

// ============================================
// 9. STORIES DISPLAY
// ============================================

function initStories() {
    const storiesGrid = document.getElementById('testimonials-grid');
    if (!storiesGrid) return;

    displayStories();
    window.addEventListener('languageChanged', displayStories);
}

function displayStories() {
    const storiesGrid = document.getElementById('testimonials-grid');
    if (!storiesGrid) return;

    const stories = StorageManager.getStories();
    storiesGrid.innerHTML = '';

    stories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'testimonial-card fade-on-scroll';
        storyCard.innerHTML = `
            <div class="testimonial-image">
                <img src="${story.image}" alt="${story.name}" onerror="this.src='images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png';">
            </div>
            <div class="testimonial-content">
                <p class="testimonial-text">"${story.description}"</p>
                <p class="testimonial-author">– ${story.name}</p>
                <p class="testimonial-title">${story.title}</p>
                ${story.videoUrl ? `<button class="btn btn-small" onclick="openVideoModal('${story.videoUrl}')">${LanguageManager.t('stories.watch')}</button>` : ''}
            </div>
        `;

        storiesGrid.appendChild(storyCard);
    });

    initScrollAnimations();
}

function openVideoModal(videoUrl) {
    const modal = document.createElement('div');
    modal.className = 'video-modal-backdrop';
    modal.innerHTML = `
        <div class="video-modal">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove();">&times;</button>
            <iframe width="100%" height="500" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ============================================
// 10. NOTIFICATIONS
// ============================================

function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export functions for use in HTML
window.openBookingModal = openBookingModal;
window.submitBooking = submitBooking;
window.openVideoModal = openVideoModal;
window.showNotification = showNotification;

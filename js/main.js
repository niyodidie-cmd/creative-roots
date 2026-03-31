/* ============================================
   CREATIVE ROOTS RWANDA - MAIN JAVASCRIPT
   Updated to work with Storage System
   Handles: Gallery, Events, Stories, Animations
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();
    LanguageManager.init();
    initNavigation();
    initHeroSection();
    initScrollAnimations();
    initCounters();
    initGallery();
    initEvents();
    initStories();
    initVolunteerSection();
    initModalBackdrop();
});

// ============================================
// 1. NAVIGATION - HAMBURGER MENU
// ============================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

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
        adminLink.textContent = 'Admin Login';
        adminLink.href = 'secure-admin-portal';
    }
}

// ============================================
// 2. HERO SECTION - AUTO-CHANGING TEXT
// ============================================

function initHeroSection() {
    // Fetch landscape applauded images for slider
    fetch('/api/gallery')
        .then(response => response.json())
        .then(items => {
            const landscapeItems = items.filter(item => item.orientation === 'landscape');
            if (landscapeItems.length > 0) {
                createHeroSlides(landscapeItems);
            } else {
                // Fallback to text if no images
                initHeroText();
            }
        })
        .catch(err => {
            console.error('Failed to load hero images:', err);
            initHeroText();
        });
}

function createHeroSlides(items) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Clear existing slides
    const existingSlides = heroSection.querySelectorAll('.hero-slide');
    existingSlides.forEach(slide => slide.remove());

    // Create new slides
    items.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(${item.image_url})`;
        slide.innerHTML = `
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

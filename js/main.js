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
}

// ============================================
// 2. HERO SECTION - AUTO-CHANGING TEXT
// ============================================

function initHeroSection() {
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

    // Auto-advance hero slides
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;

    function advanceSlide() {
        const slides = document.querySelectorAll('.hero-slide');
        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));

        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    setInterval(advanceSlide, 5000);

    // Allow manual slide control
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            const slides = document.querySelectorAll('.hero-slide');
            slides.forEach(s => s.classList.remove('active'));
            indicators.forEach(i => i.classList.remove('active'));
            slides[index].classList.add('active');
            indicator.classList.add('active');
            currentSlide = index;
        });
    });
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

    const gallery = StorageManager.getGallery();
    galleryGrid.innerHTML = '';

    gallery.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-on-scroll';
        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png';">
            <div class="gallery-overlay">
                <p class="gallery-title">${item.title}</p>
                <p class="gallery-artist">${item.artist}</p>
            </div>
        `;

        galleryItem.addEventListener('click', () => {
            openGalleryModal(item);
        });

        galleryGrid.appendChild(galleryItem);
    });

    // Re-apply scroll animations
    initScrollAnimations();
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

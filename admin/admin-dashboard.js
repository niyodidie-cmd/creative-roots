/* ============================================
   INKINGI CREATIVE HUB - ADMIN DASHBOARD
   Complete CRUD functionality for all content types
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    setupEventListeners();
    loadAllData();
});

// ============================================
// AUTHENTICATION
// ============================================

function checkAuthentication() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    // Set token for API calls
    if (window.apiClient) {
        window.apiClient.setToken(token);
    }
}

function logoutAdmin() {
    localStorage.removeItem('admin_token');
    window.location.href = 'login.html';
}

// ============================================
// NAVIGATION & TABS
// ============================================

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Form submissions
    setupFormHandlers();

    // Image previews
    setupImagePreviews();
}

function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all menu links
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to selected menu link
    const selectedLink = document.querySelector(`[data-tab="${tabId}"]`);
    if (selectedLink) {
        selectedLink.classList.add('active');
    }

    // Load data for the tab
    loadTabData(tabId);
}

function loadTabData(tabId) {
    switch(tabId) {
        case 'gallery':
            loadGallery();
            break;
        case 'events':
            loadEvents();
            break;
        case 'testimonials':
            loadTestimonials();
            break;
        case 'content':
            loadContentSections();
            break;
        case 'social':
            loadSocialMedia();
            break;
        case 'impact':
            loadImpactStats();
            break;
        case 'logo':
            loadLogo();
            break;
        case 'contact':
            loadContactMessages();
            break;
        case 'bookings':
            loadBookings();
            break;
    }
}

function loadAllData() {
    loadGallery();
    loadEvents();
    loadTestimonials();
    loadContentSections();
    loadSocialMedia();
    loadImpactStats();
    loadLogo();
    loadContactMessages();
    loadBookings();
}

// ============================================
// FORM HANDLERS
// ============================================

function setupFormHandlers() {
    // Gallery form
    const galleryForm = document.getElementById('galleryUploadForm');
    if (galleryForm) {
        galleryForm.addEventListener('submit', handleGallerySubmit);
    }

    // Event form
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }

    // Testimonial form
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', handleTestimonialSubmit);
    }

    // Social media form
    const socialForm = document.getElementById('socialForm');
    if (socialForm) {
        socialForm.addEventListener('submit', handleSocialSubmit);
    }

    // Impact stats form
    const impactForm = document.getElementById('impactForm');
    if (impactForm) {
        impactForm.addEventListener('submit', handleImpactSubmit);
    }

    // Logo form
    const logoForm = document.getElementById('logoForm');
    if (logoForm) {
        logoForm.addEventListener('submit', handleLogoSubmit);
    }
}

// ============================================
// IMAGE PREVIEWS
// ============================================

function setupImagePreviews() {
    // Gallery image preview
    const galleryImageInput = document.getElementById('galleryImageInput');
    if (galleryImageInput) {
        galleryImageInput.addEventListener('change', (e) => {
            previewImage(e.target, 'imagePreview');
        });
    }

    // Event image preview
    const eventImageInput = document.getElementById('eventImageInput');
    if (eventImageInput) {
        eventImageInput.addEventListener('change', (e) => {
            previewImage(e.target, 'eventImagePreview');
        });
    }

    // Testimonial image preview
    const testimonialImageInput = document.getElementById('testimonialImageInput');
    if (testimonialImageInput) {
        testimonialImageInput.addEventListener('change', (e) => {
            previewImage(e.target, 'storyImagePreview');
        });
    }

    // Logo preview
    const logoImageInput = document.getElementById('logoImageInput');
    if (logoImageInput) {
        logoImageInput.addEventListener('change', (e) => {
            previewImage(e.target, 'logoPreview');
        });
    }

    // Content section image previews
    const contentImageInputs = ['whoWeAreImageInput', 'missionImageInput', 'visionImageInput'];
    contentImageInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            const previewId = inputId.replace('Input', 'Preview');
            input.addEventListener('change', (e) => {
                previewImage(e.target, previewId);
            });
        }
    });
}

function previewImage(input, previewId) {
    const file = input.files[0];
    const preview = document.getElementById(previewId);

    if (file && preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// ============================================
// GALLERY MANAGEMENT
// ============================================

async function loadGallery() {
    try {
        const response = await fetch('/api/gallery');
        const items = await response.json();

        const container = document.getElementById('galleryPreview');
        if (!container) return;

        container.innerHTML = '';

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'gallery-preview-item';
            itemDiv.innerHTML = `
                <img src="${item.image_url}" alt="${item.title}">
                <div class="item-info">
                    <div>${item.title}</div>
                    <div>Artist: ${item.artist || 'Unknown'}</div>
                    <div>Applauded: ${item.applauded ? 'Yes' : 'No'}</div>
                </div>
                <div class="delete-overlay">
                    <button class="edit-btn" onclick="editGalleryItem(${item.id})">Edit</button>
                    <button class="applaud-btn" onclick="toggleApplaud(${item.id}, 'gallery', ${!item.applauded})">
                        ${item.applauded ? 'Unapplaud' : 'Applaud'}
                    </button>
                    <button class="delete-btn" onclick="deleteItem(${item.id}, 'gallery')">Delete</button>
                </div>
            `;
            container.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Failed to load gallery:', error);
        showNotification('Failed to load gallery items', 'error');
    }
}

async function handleGallerySubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('galleryTitle').value);
    formData.append('artist', document.getElementById('galleryArtist').value);
    formData.append('description', document.getElementById('galleryDescription').value);
    formData.append('orientation', document.getElementById('galleryOrientation').value);
    formData.append('image', document.getElementById('galleryImageInput').files[0]);

    try {
        const response = await fetch('/api/gallery', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showNotification('Gallery item added successfully!', 'success');
            e.target.reset();
            document.getElementById('imagePreview').style.display = 'none';
            loadGallery();
        } else {
            throw new Error('Failed to add gallery item');
        }
    } catch (error) {
        console.error('Gallery submit error:', error);
        showNotification('Failed to add gallery item', 'error');
    }
}

// ============================================
// EVENTS MANAGEMENT
// ============================================

async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();

        const container = document.getElementById('eventsPreview');
        if (!container) return;

        container.innerHTML = '';

        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-preview-item';
            eventDiv.innerHTML = `
                <img src="${event.image_url || '/images/default-event.jpg'}" alt="${event.title}">
                <div class="event-info">
                    <div>${event.title}</div>
                    <div>${new Date(event.date).toLocaleDateString()}</div>
                    <div>${event.location || 'TBD'}</div>
                </div>
                <div class="delete-overlay">
                    <button class="edit-btn" onclick="editEvent(${event.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${event.id}, 'events')">Delete</button>
                </div>
            `;
            container.appendChild(eventDiv);
        });
    } catch (error) {
        console.error('Failed to load events:', error);
        showNotification('Failed to load events', 'error');
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('eventTitle').value);
    formData.append('description', document.getElementById('eventDescription').value);
    formData.append('date', document.getElementById('eventDate').value);
    formData.append('time', document.getElementById('eventTime').value);
    formData.append('location', document.getElementById('eventLocation').value);
    formData.append('capacity', document.getElementById('eventCapacity').value);

    const imageFile = document.getElementById('eventImageInput').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showNotification('Event created successfully!', 'success');
            e.target.reset();
            document.getElementById('eventImagePreview').style.display = 'none';
            loadEvents();
        } else {
            throw new Error('Failed to create event');
        }
    } catch (error) {
        console.error('Event submit error:', error);
        showNotification('Failed to create event', 'error');
    }
}

// ============================================
// TESTIMONIALS MANAGEMENT
// ============================================

async function loadTestimonials() {
    try {
        const response = await fetch('/api/testimonials');
        const testimonials = await response.json();

        const container = document.getElementById('testimonialsPreview');
        if (!container) return;

        container.innerHTML = '';

        testimonials.forEach(testimonial => {
            const testimonialDiv = document.createElement('div');
            testimonialDiv.className = 'testimonial-preview-item';
            testimonialDiv.innerHTML = `
                <img src="${testimonial.image_url || '/images/default-avatar.jpg'}" alt="${testimonial.name}">
                <div class="testimonial-info">
                    <div>${testimonial.name}</div>
                    <div>"${testimonial.quote}"</div>
                </div>
                <div class="delete-overlay">
                    <button class="edit-btn" onclick="editTestimonial(${testimonial.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${testimonial.id}, 'testimonials')">Delete</button>
                </div>
            `;
            container.appendChild(testimonialDiv);
        });
    } catch (error) {
        console.error('Failed to load testimonials:', error);
        showNotification('Failed to load testimonials', 'error');
    }
}

async function handleTestimonialSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('testimonialName').value);
    formData.append('quote', document.getElementById('testimonialQuote').value);

    const imageFile = document.getElementById('testimonialImageInput').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch('/api/testimonials', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showNotification('Testimonial added successfully!', 'success');
            e.target.reset();
            document.getElementById('storyImagePreview').style.display = 'none';
            loadTestimonials();
        } else {
            throw new Error('Failed to add testimonial');
        }
    } catch (error) {
        console.error('Testimonial submit error:', error);
        showNotification('Failed to add testimonial', 'error');
    }
}

// ============================================
// CONTENT SECTIONS MANAGEMENT
// ============================================

async function loadContentSections() {
    try {
        // Load Who We Are
        const whoWeAreResponse = await fetch('/api/content-sections/who_we_are');
        const whoWeAre = await whoWeAreResponse.json();
        document.getElementById('whoWeAreContent').value = whoWeAre.content || '';
        if (whoWeAre.image_url) {
            document.getElementById('whoWeArePreview').src = whoWeAre.image_url;
            document.getElementById('whoWeArePreview').style.display = 'block';
        }

        // Load Mission
        const missionResponse = await fetch('/api/content-sections/mission');
        const mission = await missionResponse.json();
        document.getElementById('missionContent').value = mission.content || '';
        if (mission.image_url) {
            document.getElementById('missionPreview').src = mission.image_url;
            document.getElementById('missionPreview').style.display = 'block';
        }

        // Load Vision
        const visionResponse = await fetch('/api/content-sections/vision');
        const vision = await visionResponse.json();
        document.getElementById('visionContent').value = vision.content || '';
        if (vision.image_url) {
            document.getElementById('visionPreview').src = vision.image_url;
            document.getElementById('visionPreview').style.display = 'block';
        }
    } catch (error) {
        console.error('Failed to load content sections:', error);
        showNotification('Failed to load content sections', 'error');
    }
}

async function updateContentSection(section) {
    const contentElement = document.getElementById(`${section}Content`);
    const imageInput = document.getElementById(`${section}ImageInput`);

    if (!contentElement) return;

    const formData = new FormData();
    formData.append('content', contentElement.value);

    if (imageInput && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }

    try {
        const response = await fetch(`/api/content-sections/${section}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            showNotification(`${section.replace('_', ' ').toUpperCase()} updated successfully!`, 'success');
            loadContentSections();
        } else {
            throw new Error(`Failed to update ${section}`);
        }
    } catch (error) {
        console.error(`Content update error for ${section}:`, error);
        showNotification(`Failed to update ${section}`, 'error');
    }
}

// ============================================
// SOCIAL MEDIA MANAGEMENT
// ============================================

async function loadSocialMedia() {
    try {
        const response = await fetch('/api/social-media');
        const links = await response.json();

        const tableBody = document.querySelector('#socialTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        links.forEach(link => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${link.platform}</td>
                <td><a href="${link.url}" target="_blank">${link.url}</a></td>
                <td>${link.icon_class}</td>
                <td>
                    <button class="edit-btn" onclick="editSocialLink(${link.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${link.id}, 'social-media')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load social media:', error);
        showNotification('Failed to load social media links', 'error');
    }
}

async function handleSocialSubmit(e) {
    e.preventDefault();

    const data = {
        platform: document.getElementById('socialPlatform').value,
        url: document.getElementById('socialUrl').value,
        icon_class: document.getElementById('socialIcon').value
    };

    try {
        const response = await fetch('/api/social-media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification('Social media link added successfully!', 'success');
            e.target.reset();
            loadSocialMedia();
        } else {
            throw new Error('Failed to add social media link');
        }
    } catch (error) {
        console.error('Social submit error:', error);
        showNotification('Failed to add social media link', 'error');
    }
}

// ============================================
// IMPACT STATS MANAGEMENT
// ============================================

async function loadImpactStats() {
    try {
        const response = await fetch('/api/impact-stats');
        const stats = await response.json();

        const tableBody = document.querySelector('#impactTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        stats.forEach(stat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stat.label}</td>
                <td>${stat.value}</td>
                <td>
                    <button class="edit-btn" onclick="editImpactStat(${stat.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${stat.id}, 'impact-stats')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load impact stats:', error);
        showNotification('Failed to load impact statistics', 'error');
    }
}

async function handleImpactSubmit(e) {
    e.preventDefault();

    const data = {
        label: document.getElementById('impactLabel').value,
        value: parseInt(document.getElementById('impactValue').value)
    };

    try {
        const response = await fetch('/api/impact-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification('Impact statistic added successfully!', 'success');
            e.target.reset();
            loadImpactStats();
        } else {
            throw new Error('Failed to add impact statistic');
        }
    } catch (error) {
        console.error('Impact submit error:', error);
        showNotification('Failed to add impact statistic', 'error');
    }
}

// ============================================
// LOGO MANAGEMENT
// ============================================

async function loadLogo() {
    try {
        const response = await fetch('/api/logos');
        const logos = await response.json();

        const container = document.getElementById('currentLogoContainer');
        if (!container) return;

        if (logos.length > 0) {
            const logo = logos[0];
            container.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <img src="${logo.image_url}" alt="Current Logo" style="max-width: 200px; max-height: 200px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <p style="margin-top: 10px; color: #666;">Current Logo</p>
                </div>
            `;
        } else {
            container.innerHTML = '<p style="text-align: center; color: #666;">No logo uploaded yet</p>';
        }
    } catch (error) {
        console.error('Failed to load logo:', error);
        showNotification('Failed to load logo', 'error');
    }
}

async function handleLogoSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', document.getElementById('logoImageInput').files[0]);

    try {
        const response = await fetch('/api/logos', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showNotification('Logo updated successfully!', 'success');
            e.target.reset();
            document.getElementById('logoPreview').style.display = 'none';
            loadLogo();
        } else {
            throw new Error('Failed to update logo');
        }
    } catch (error) {
        console.error('Logo submit error:', error);
        showNotification('Failed to update logo', 'error');
    }
}

// ============================================
// CONTACT MESSAGES
// ============================================

async function loadContactMessages() {
    try {
        const response = await fetch('/api/contact');
        const messages = await response.json();

        const tableBody = document.querySelector('#contactTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        messages.forEach(message => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${message.name || 'Anonymous'}</td>
                <td>${message.email || 'N/A'}</td>
                <td>${message.message || 'N/A'}</td>
                <td>${new Date(message.created_at).toLocaleDateString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load contact messages:', error);
        showNotification('Failed to load contact messages', 'error');
    }
}

// ============================================
// BOOKINGS MANAGEMENT
// ============================================

async function loadBookings() {
    try {
        const response = await fetch('/api/bookings');
        const bookings = await response.json();

        const tableBody = document.querySelector('#bookingsTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone || 'N/A'}</td>
                <td>${booking.event_title || 'N/A'}</td>
                <td>${booking.attendees || 1}</td>
                <td>${new Date(booking.created_at).toLocaleDateString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load bookings:', error);
        showNotification('Failed to load bookings', 'error');
    }
}

// ============================================
// CRUD OPERATIONS
// ============================================

async function deleteItem(id, endpoint) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`/api/${endpoint}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Item deleted successfully!', 'success');
            // Reload the appropriate data
            switch(endpoint) {
                case 'gallery':
                    loadGallery();
                    break;
                case 'events':
                    loadEvents();
                    break;
                case 'testimonials':
                    loadTestimonials();
                    break;
                case 'social-media':
                    loadSocialMedia();
                    break;
                case 'impact-stats':
                    loadImpactStats();
                    break;
            }
        } else {
            throw new Error('Failed to delete item');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete item', 'error');
    }
}

async function toggleApplaud(id, endpoint, applauded) {
    try {
        const response = await fetch(`/api/${endpoint}/${id}/applaud`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applauded })
        });

        if (response.ok) {
            showNotification(`Item ${applauded ? 'applauded' : 'unapplauded'} successfully!`, 'success');
            if (endpoint === 'gallery') {
                loadGallery();
            }
        } else {
            throw new Error('Failed to update applauded status');
        }
    } catch (error) {
        console.error('Applaud toggle error:', error);
        showNotification('Failed to update applauded status', 'error');
    }
}

// Placeholder functions for edit operations (can be implemented later)
function editGalleryItem(id) {
    showNotification('Edit functionality coming soon!', 'info');
}

function editEvent(id) {
    showNotification('Edit functionality coming soon!', 'info');
}

function editTestimonial(id) {
    showNotification('Edit functionality coming soon!', 'info');
}

function editSocialLink(id) {
    showNotification('Edit functionality coming soon!', 'info');
}

function editImpactStat(id) {
    showNotification('Edit functionality coming soon!', 'info');
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'admin-notification';

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    notification.innerHTML = `
        <h4>${icon} ${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
        <p>${message}</p>
    `;

    // Override background color based on type
    if (type === 'success') {
        notification.style.borderLeftColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.borderLeftColor = '#f44336';
    } else if (type === 'info') {
        notification.style.borderLeftColor = '#2196F3';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize with gallery tab active
document.addEventListener('DOMContentLoaded', () => {
    switchTab('gallery');
});

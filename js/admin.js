/* ============================================
   ADMIN DASHBOARD JAVASCRIPT
   Handles all admin operations: Images, Events,
   Stories, Bookings management
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!StorageManager.checkAdminAuth()) {
        window.location.href = 'login.html';
        return;
    }

    StorageManager.init();
    LanguageManager.init();
    initAdminTabs();
    initLogout();
    loadGallery();
    loadEvents();
    loadStories();
    loadBookings();
});

// ============================================
// TAB MANAGEMENT
// ============================================

function initAdminTabs() {
    const menuLinks = document.querySelectorAll('.menu-link');
    const tabContents = document.querySelectorAll('.tab-content');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');

            // Remove active class from all
            menuLinks.forEach(m => m.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            // Add active class to clicked
            link.classList.add('active');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// ============================================
// LOGOUT FUNCTIONALITY
// ============================================

function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            StorageManager.logoutAdmin();
            window.location.href = 'login.html';
        });
    }

    const backBtn = document.querySelector('.back-to-website-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
}

// ============================================
// GALLERY IMAGE MANAGEMENT
// ============================================

function loadGallery() {
    displayGalleryPreview();
    setupImageUpload();
}

function setupImageUpload() {
    const uploadForm = document.getElementById('galleryUploadForm');
    const fileInput = document.getElementById('galleryImageInput');
    const previewImg = document.getElementById('imagePreview');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (previewImg) {
                        previewImg.src = event.target.result;
                        previewImg.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('galleryTitle')?.value || 'Untitled';
            const artist = document.getElementById('galleryArtist')?.value || 'Youth Artist';
            const description = document.getElementById('galleryDescription')?.value || '';
            const previewSrc = previewImg?.src;

            if (!previewSrc) {
                alert('Please select an image');
                return;
            }

            const item = {
                title,
                artist,
                description,
                image: previewSrc
            };

            StorageManager.addGalleryItem(item);
            uploadForm.reset();
            previewImg.style.display = 'none';
            displayGalleryPreview();
            showNotification('Success', 'Gallery item added successfully!');
        });
    }
}

function displayGalleryPreview() {
    const preview = document.getElementById('galleryPreview');
    if (!preview) return;

    const gallery = StorageManager.getGallery();
    preview.innerHTML = '';

    gallery.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-preview-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-info">
                <p><strong>${item.title}</strong></p>
                <p>${item.artist}</p>
            </div>
            <div class="delete-overlay">
                <button class="delete-btn" onclick="deleteGalleryItem(${item.id})">Delete</button>
            </div>
        `;
        preview.appendChild(itemDiv);
    });
}

function deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this gallery item?')) {
        StorageManager.deleteGalleryItem(id);
        displayGalleryPreview();
        showNotification('Success', 'Gallery item deleted');
    }
}

// ============================================
// EVENTS MANAGEMENT
// ============================================

function loadEvents() {
    displayEventsPreview();
    setupEventForm();
}

let currentEditEventId = null;

function setupEventForm() {
    const form = document.getElementById('eventForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('eventTitle')?.value;
        const date = document.getElementById('eventDate')?.value;
        const time = document.getElementById('eventTime')?.value;
        const location = document.getElementById('eventLocation')?.value;
        const description = document.getElementById('eventDescription')?.value;
        const capacity = parseInt(document.getElementById('eventCapacity')?.value) || 30;
        const imagePreview = document.getElementById('eventImagePreview');
        const image = imagePreview?.src || 'images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png';

        if (!title || !date || !time || !location) {
            alert('Please fill in all required fields');
            return;
        }

        if (currentEditEventId) {
            const updates = { title, date, time, location, description, capacity, image };
            StorageManager.updateEvent(currentEditEventId, updates);
            showNotification('Success', 'Event updated successfully!');
            currentEditEventId = null;
            form.querySelector('button[type="submit"]').textContent = '✓ Create Event';
        } else {
            const event = {
                title,
                date,
                time,
                location,
                description,
                capacity,
                image,
                booked: 0
            };
            StorageManager.addEvent(event);
            showNotification('Success', 'Event created successfully!');
        }

        form.reset();
        imagePreview.style.display = 'none';
        displayEventsPreview();
    });

    const eventImageInput = document.getElementById('eventImageInput');
    if (eventImageInput) {
        eventImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('eventImagePreview');
                    if (preview) {
                        preview.src = event.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function editEvent(id) {
    const event = StorageManager.getEvent(id);
    if (!event) return;
    currentEditEventId = id;
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventCapacity').value = event.capacity;
    const preview = document.getElementById('eventImagePreview');
    if (preview) {
        preview.src = event.image;
        preview.style.display = 'block';
    }
    form = document.getElementById('eventForm');
    if (form) form.querySelector('button[type="submit"]').textContent = '✓ Update Event';
}

function displayEventsPreview() {
    const preview = document.getElementById('eventsPreview');
    if (!preview) return;

    const events = StorageManager.getEvents();
    preview.innerHTML = '';

    events.forEach(event => {
        const spotsLeft = event.capacity - event.booked;
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-preview-item';
        eventDiv.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <div class="event-info">
                <p><strong>${event.title}</strong></p>
                <p>${event.date} @ ${event.time}</p>
                <p>${event.location}</p>
                <p>Capacity: ${event.booked}/${event.capacity}</p>
            </div>
            <div class="delete-overlay">
                <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
            <div class="edit-overlay" style="position:absolute;top:0;right:0;padding:8px;">
                <button class="btn-secondary" onclick="editEvent(${event.id})">Edit</button>
            </div>
        `;
        preview.appendChild(eventDiv);
    });
}

function deleteEvent(id) {
    if (confirm('Are you sure? This will delete all associated bookings.')) {
        // Delete all bookings for this event
        const bookings = StorageManager.getBookingsForEvent(id);
        bookings.forEach(b => StorageManager.deleteBooking(b.id));
        
        // Delete event
        StorageManager.deleteEvent(id);
        displayEventsPreview();
        loadBookings();
        showNotification('Success', 'Event deleted');
    }
}

// ============================================
// SUCCESS STORIES MANAGEMENT
// ============================================

function loadStories() {
    displayStoriesPreview();
    setupStoryForm();
}

let currentEditStoryId = null;

function setupStoryForm() {
    const form = document.getElementById('storyForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('storyName')?.value;
        const title = document.getElementById('storyTitle')?.value;
        const description = document.getElementById('storyDescription')?.value;
        const videoUrl = document.getElementById('storyVideoUrl')?.value;
        const imagePreview = document.getElementById('storyImagePreview');
        const image = imagePreview?.src || 'images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png';

        if (!name || !title || !description) {
            alert('Please fill in all required fields');
            return;
        }

        if (currentEditStoryId) {
            const updates = { name, title, description, image, videoUrl: videoUrl || null };
            StorageManager.updateStory(currentEditStoryId, updates);
            showNotification('Success', 'Story updated!');
            currentEditStoryId = null;
            form.querySelector('button[type="submit"]').textContent = '✓ Add Story';
        } else {
            const story = {
                name,
                title,
                description,
                image,
                videoUrl: videoUrl || null,
                type: 'youth'
            };
            StorageManager.addStory(story);
            showNotification('Success', 'Success story added!');
        }

        form.reset();
        imagePreview.style.display = 'none';
        displayStoriesPreview();
    });

    const storyImageInput = document.getElementById('storyImageInput');
    if (storyImageInput) {
        storyImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('storyImagePreview');
                    if (preview) {
                        preview.src = event.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function editStory(id) {
    const story = StorageManager.getStory(id);
    if (!story) return;
    currentEditStoryId = id;
    document.getElementById('storyName').value = story.name;
    document.getElementById('storyTitle').value = story.title;
    document.getElementById('storyDescription').value = story.description;
    document.getElementById('storyVideoUrl').value = story.videoUrl || '';
    const preview = document.getElementById('storyImagePreview');
    if (preview) {
        preview.src = story.image;
        preview.style.display = 'block';
    }
    const form = document.getElementById('storyForm');
    if (form) form.querySelector('button[type="submit"]').textContent = '✓ Update Story';
}

function displayStoriesPreview() {
    const preview = document.getElementById('storiesPreview');
    if (!preview) return;

    const stories = StorageManager.getStories();
    preview.innerHTML = '';

    stories.forEach(story => {
        const storyDiv = document.createElement('div');
        storyDiv.className = 'story-preview-item';
        storyDiv.innerHTML = `
            <img src="${story.image}" alt="${story.name}">
            <div class="story-info">
                <p><strong>${story.name}</strong></p>
                <p>${story.title}</p>
                <p>${story.description.substring(0, 50)}...</p>
                ${story.videoUrl ? `<p>📹 Video Link: Yes</p>` : ''}
            </div>
            <div class="delete-overlay">
                <button class="delete-btn" onclick="deleteStory(${story.id})">Delete</button>
            </div>
            <div class="edit-overlay" style="position:absolute;top:0;right:0;padding:8px;">
                <button class="btn-secondary" onclick="editStory(${story.id})">Edit</button>
            </div>
        `;
        preview.appendChild(storyDiv);
    });
}

function deleteStory(id) {
    if (confirm('Are you sure you want to delete this story?')) {
        StorageManager.deleteStory(id);
        displayStoriesPreview();
        showNotification('Success', 'Story deleted');
    }
}

// ============================================
// BOOKINGS MANAGEMENT
// ============================================

function loadBookings() {
    displayBookings();
}

function displayBookings() {
    const table = document.getElementById('bookingsTable');
    if (!table) return;

    const bookings = StorageManager.getBookings();
    const tbody = table.querySelector('tbody');
    
    if (!tbody) return;
    tbody.innerHTML = '';

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No bookings yet</td></tr>';
        return;
    }

    bookings.forEach(booking => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.phone}</td>
            <td>${booking.eventTitle}</td>
            <td>${booking.attendees}</td>
            <td>${new Date(booking.date).toLocaleDateString()}</td>
            <td>
                <button class="delete-btn" onclick="deleteBooking(${booking.id})">Delete</button>
            </td>
        `;
    });
}

function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        StorageManager.deleteBooking(id);
        displayBookings();
        loadEvents();
        showNotification('Success', 'Booking deleted');
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export functions for HTML
window.deleteGalleryItem = deleteGalleryItem;
window.deleteEvent = deleteEvent;
window.deleteStory = deleteStory;
window.deleteBooking = deleteBooking;
window.editEvent = editEvent;
window.editStory = editStory;
window.showNotification = showNotification;

/* ============================================
   ADMIN DASHBOARD - FULL FUNCTIONALITY
   Handles: Auth, Gallery, Videos, Blog, Events, Donations
   ============================================ */

let dashboardState = {
    currentTab: 'overview',
    authToken: localStorage.getItem('admin_token'),
    donations: [],
    gallery: [],
    videos: [],
    blog: [],
    events: []
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    checkAuthentication();
    setupEventListeners();
    loadDashboardData();
    console.log('✓ Admin Dashboard Initialized');
});

// ============================================
// AUTHENTICATION CHECK
// ============================================

function checkAuthentication() {
    const token = localStorage.getItem('admin_token');
    
    if (!token && !window.location.pathname.includes('login')) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    if (token) {
        dashboardState.authToken = token;
        api.setToken(token);
    }
}

// ============================================
// TAB SWITCHING
// ============================================

function setupEventListeners() {
    // Tab buttons
    const tabButtons = document.querySelectorAll('.menu-link');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = btn.getAttribute('data-tab');
            if (tabName) {
                switchTab(tabName);
            }
        });
    });

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Back to website button
    const backBtn = document.querySelector('.back-to-website-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
}

function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.menu-link').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to selected tab
    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }

    dashboardState.currentTab = tabName;

    // Load data for the tab
    if (tabName === 'overview') {
        loadStats();
    } else if (tabName === 'gallery') {
        loadGallery();
    } else if (tabName === 'videos') {
        loadVideos();
    } else if (tabName === 'blog') {
        loadBlog();
    } else if (tabName === 'events') {
        loadEvents();
    } else if (tabName === 'donations') {
        loadDonations();
    }
}

// ============================================
// LOAD DASHBOARD DATA
// ============================================

async function loadDashboardData() {
    try {
        // Load initial stats
        await loadStats();
    } catch (err) {
        console.error('Error loading dashboard data:', err);
    }
}

async function loadStats() {
    try {
        const stats = await api.getStats();
        
        // Update stats display
        const statsHtml = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.donations.count}</div>
                    <div class="stat-label">Total Donations</div>
                    <div class="stat-value">$${stats.donations.total.toFixed(2)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.gallery}</div>
                    <div class="stat-label">Gallery Items</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.videos}</div>
                    <div class="stat-label">Videos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.blogPosts}</div>
                    <div class="stat-label">Blog Posts</div>
                </div>
            </div>
        `;

        const overviewContent = document.querySelector('[data-content="overview"]');
        if (overviewContent) {
            overviewContent.innerHTML = statsHtml;
        }

        console.log('✓ Dashboard stats loaded');
    } catch (err) {
        console.error('Error loading stats:', err);
        showError('Failed to load dashboard statistics');
    }
}

// ============================================
// GALLERY MANAGEMENT
// ============================================

async function loadGallery() {
    try {
        const items = await api.getGallery();
        dashboardState.gallery = items;

        const galleryHtml = `
            <div class="gallery-management">
                <h3>Upload New Gallery Item</h3>
                <form id="galleryUploadForm" class="upload-form">
                    <input type="text" id="galleryTitle" placeholder="Title" required>
                    <textarea id="galleryDescription" placeholder="Description (optional)"></textarea>
                    <input type="file" id="galleryImage" accept="image/*" required>
                    <input type="text" id="galleryCategory" placeholder="Category (e.g., Artwork, Sculpture)" required>
                    <button type="submit" class="btn btn-primary">Upload</button>
                </form>

                <h3 style="margin-top: 2rem;">Current Gallery Items</h3>
                <div class="gallery-list">
                    ${items.map(item => `
                        <div class="gallery-item-card">
                            <img src="${item.image_url}" alt="${item.title}" style="max-width: 200px; height: auto;">
                            <h4>${item.title}</h4>
                            <p>${item.category}</p>
                            <button onclick="deleteGalleryItem(${item.id})" class="btn btn-danger btn-small">Delete</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const galleryContent = document.querySelector('[data-content="gallery"]');
        if (galleryContent) {
            galleryContent.innerHTML = galleryHtml;
        }

        // Setup form handler
        const form = document.getElementById('galleryUploadForm');
        if (form) {
            form.addEventListener('submit', handleGalleryUpload);
        }

        console.log('✓ Gallery items loaded');
    } catch (err) {
        console.error('Error loading gallery:', err);
        showError('Failed to load gallery');
    }
}

async function handleGalleryUpload(e) {
    e.preventDefault();

    const title = document.getElementById('galleryTitle').value;
    const description = document.getElementById('galleryDescription').value;
    const image = document.getElementById('galleryImage').files[0];
    const category = document.getElementById('galleryCategory').value;

    if (!title || !image || !category) {
        showError('Please fill in all required fields');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('category', category);

        await api.addGalleryItem(formData);
        showSuccess('Gallery item uploaded successfully!');
        
        // Reload gallery
        await loadGallery();
    } catch (err) {
        console.error('Upload error:', err);
        showError('Failed to upload gallery item');
    }
}

async function deleteGalleryItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        await api.deleteGalleryItem(id);
        showSuccess('Gallery item deleted');
        await loadGallery();
    } catch (err) {
        showError('Failed to delete gallery item');
    }
}

// ============================================
// VIDEOS MANAGEMENT
// ============================================

async function loadVideos() {
    try {
        const videos = await api.getVideos();
        dashboardState.videos = videos;

        const videosHtml = `
            <div class="videos-management">
                <h3>Upload New Video</h3>
                <form id="videoUploadForm" class="upload-form">
                    <input type="text" id="videoTitle" placeholder="Title" required>
                    <textarea id="videoDescription" placeholder="Description (optional)"></textarea>
                    <input type="file" id="videoFile" accept="video/*" required>
                    <input type="text" id="videoCategory" placeholder="Category (e.g., Showcase, Tutorial)" required>
                    <button type="submit" class="btn btn-primary">Upload</button>
                </form>

                <h3 style="margin-top: 2rem;">Current Videos</h3>
                <div class="videos-list">
                    ${videos.map(video => `
                        <div class="video-item-card">
                            <h4>${video.title}</h4>
                            <p>${video.category}</p>
                            <a href="${video.video_url}" target="_blank" class="btn btn-secondary btn-small">View Video</a>
                            <button onclick="deleteVideo(${video.id})" class="btn btn-danger btn-small">Delete</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const videosContent = document.querySelector('[data-content="videos"]');
        if (videosContent) {
            videosContent.innerHTML = videosHtml;
        }

        const form = document.getElementById('videoUploadForm');
        if (form) {
            form.addEventListener('submit', handleVideoUpload);
        }

        console.log('✓ Videos loaded');
    } catch (err) {
        console.error('Error loading videos:', err);
        showError('Failed to load videos');
    }
}

async function handleVideoUpload(e) {
    e.preventDefault();

    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;
    const file = document.getElementById('videoFile').files[0];
    const category = document.getElementById('videoCategory').value;

    if (!title || !file || !category) {
        showError('Please fill in all required fields');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', file);
        formData.append('category', category);

        await api.addVideo(formData);
        showSuccess('Video uploaded successfully!');
        await loadVideos();
    } catch (err) {
        showError('Failed to upload video');
    }
}

async function deleteVideo(id) {
    if (!confirm('Are you sure?')) return;
    try {
        await api.deleteVideo(id);
        showSuccess('Video deleted');
        await loadVideos();
    } catch (err) {
        showError('Failed to delete video');
    }
}

// ============================================
// BLOG MANAGEMENT
// ============================================

async function loadBlog() {
    try {
        const posts = await api.getBlog();
        dashboardState.blog = posts;

        const blogHtml = `
            <div class="blog-management">
                <h3>Create New Blog Post</h3>
                <form id="blogForm" class="upload-form">
                    <input type="text" id="blogTitle" placeholder="Title" required>
                    <textarea id="blogContent" placeholder="Post content" required style="min-height: 200px;"></textarea>
                    <input type="text" id="blogAuthor" placeholder="Author">
                    <input type="file" id="blogImage" accept="image/*">
                    <input type="text" id="blogCategory" placeholder="Category (e.g., Story, Update)">
                    <button type="submit" class="btn btn-primary">Publish</button>
                </form>

                <h3 style="margin-top: 2rem;">Published Posts</h3>
                <div class="blog-list">
                    ${posts.map(post => `
                        <div class="blog-post-card">
                            <h4>${post.title}</h4>
                            <p><strong>By:</strong> ${post.author || 'Anonymous'}</p>
                            <p>${post.content.substring(0, 100)}...</p>
                            <button onclick="deleteBlogPost(${post.id})" class="btn btn-danger btn-small">Delete</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const blogContent = document.querySelector('[data-content="blog"]');
        if (blogContent) {
            blogContent.innerHTML = blogHtml;
        }

        const form = document.getElementById('blogForm');
        if (form) {
            form.addEventListener('submit', handleBlogSubmit);
        }

        console.log('✓ Blog posts loaded');
    } catch (err) {
        console.error('Error loading blog:', err);
        showError('Failed to load blog posts');
    }
}

async function handleBlogSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const author = document.getElementById('blogAuthor').value || 'Creative Roots';
    const image = document.getElementById('blogImage').files[0];
    const category = document.getElementById('blogCategory').value || 'Update';

    if (!title || !content) {
        showError('Title and content are required');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        await api.addBlogPost(formData);
        showSuccess('Blog post published!');
        await loadBlog();
    } catch (err) {
        showError('Failed to publish blog post');
    }
}

async function deleteBlogPost(id) {
    if (!confirm('Are you sure?')) return;
    try {
        await api.deleteBlogPost(id);
        showSuccess('Blog post deleted');
        await loadBlog();
    } catch (err) {
        showError('Failed to delete blog post');
    }
}

// ============================================
// EVENTS MANAGEMENT
// ============================================

async function loadEvents() {
    try {
        const events = await api.getEvents();
        dashboardState.events = events;

        const eventsHtml = `
            <div class="events-management">
                <h3>Create New Event</h3>
                <form id="eventForm" class="upload-form">
                    <input type="text" id="eventTitle" placeholder="Event Title" required>
                    <textarea id="eventDescription" placeholder="Description (optional)"></textarea>
                    <input type="datetime-local" id="eventDate" required>
                    <input type="text" id="eventLocation" placeholder="Location">
                    <input type="file" id="eventImage" accept="image/*">
                    <button type="submit" class="btn btn-primary">Create Event</button>
                </form>

                <h3 style="margin-top:2rem;">Upcoming Events</h3>
                <div class="events-list">
                    ${events.map(event => `
                        <div class="event-card">
                            <h4>${event.title}</h4>
                            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Location:</strong> ${event.location || 'TBD'}</p>
                            <button onclick="deleteEvent(${event.id})" class="btn btn-danger btn-small">Delete</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const eventsContent = document.querySelector('[data-content="events"]');
        if (eventsContent) {
            eventsContent.innerHTML = eventsHtml;
        }

        const form = document.getElementById('eventForm');
        if (form) {
            form.addEventListener('submit', handleEventSubmit);
        }

        console.log('✓ Events loaded');
    } catch (err) {
        console.error('Error loading events:', err);
        showError('Failed to load events');
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value;
    const image = document.getElementById('eventImage').files[0];

    if (!title || !date) {
        showError('Title and date are required');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', new Date(date).toISOString());
        formData.append('location', location);
        if (image) {
            formData.append('image', image);
        }

        await api.addEvent(formData);
        showSuccess('Event created!');
        await loadEvents();
    } catch (err) {
        showError('Failed to create event');
    }
}

async function deleteEvent(id) {
    if (!confirm('Are you sure?')) return;
    try {
        await api.deleteEvent(id);
        showSuccess('Event deleted');
        await loadEvents();
    } catch (err) {
        showError('Failed to delete event');
    }
}

// ============================================
// DONATIONS MANAGEMENT
// ============================================

async function loadDonations() {
    try {
        const donations = await api.getDonations();
        dashboardState.donations = donations;

        const donationsHtml = `
            <div class="donations-management">
                <h3>Donation Records</h3>
                <div class="table-container">
                    <table class="donations-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Donor Name</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${donations.map(d => `
                                <tr>
                                    <td>${new Date(d.created_at).toLocaleDateString()}</td>
                                    <td>${d.donor_name || 'Anonymous'}</td>
                                    <td>${d.donor_email}</td>
                                    <td>$${d.amount}</td>
                                    <td>${d.payment_method}</td>
                                    <td><span class="status-badge status-${d.status}">${d.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div style="margin-top: 2rem; padding: 20px; background: #f5f5f5; border-radius: 8px;">
                    <h4>Total Donations: $${donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</h4>
                    <p>Total Records: ${donations.length}</p>
                </div>
            </div>
        `;

        const donationsContent = document.querySelector('[data-content="donations"]');
        if (donationsContent) {
            donationsContent.innerHTML = donationsHtml;
        }

        console.log('✓ Donations loaded');
    } catch (err) {
        console.error('Error loading donations:', err);
        showError('Failed to load donations');
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.textContent = '✓ ' + message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-error';
    notification.textContent = '✕ ' + message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f44336;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// ============================================
// LOGOUT
// ============================================

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_token');
        window.location.href = 'login.html';
    }
}

console.log('✨ Admin dashboard script loaded');

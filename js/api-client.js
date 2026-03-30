/* ============================================
   API CLIENT - Frontend Communication Layer
   Handles all requests to backend server
   ============================================ */

class APIClient {
    constructor(baseURL = '') {
        this.baseURL = baseURL || 'http://localhost:3000';
        this.token = localStorage.getItem('admin_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('admin_token', token);
    }

    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (err) {
            console.error(`API Error [${endpoint}]:`, err);
            throw err;
        }
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    logout() {
        localStorage.removeItem('admin_token');
        this.token = null;
    }

    isLoggedIn() {
        return !!this.token;
    }

    // ============================================
    // ADMIN DASHBOARD
    // ============================================

    async getStats() {
        return this.request('/admin/stats');
    }

    // ============================================
    // GALLERY
    // ============================================

    async getGallery() {
        return this.request('/gallery');
    }

    async getAdminGallery() {
        return this.request('/admin/gallery');
    }

    async addGalleryItem(formData) {
        const url = `${this.baseURL}/api/gallery`;
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add gallery item');
        }

        return response.json();
    }

    async updateGalleryItem(id, formData) {
        const url = `${this.baseURL}/api/gallery/${id}`;
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update gallery item');
        }

        return response.json();
    }

    async deleteGalleryItem(id) {
        return this.request(`/gallery/${id}`, { method: 'DELETE' });
    }

    async applaudGalleryItem(id, applauded) {
        return this.request(`/gallery/${id}/applaud`, { 
            method: 'PUT', 
            body: JSON.stringify({ applauded }) 
        });
    }

    // ============================================
    // VIDEOS
    // ============================================

    async getVideos() {
        return this.request('/videos');
    }

    async getAdminVideos() {
        return this.request('/admin/videos');
    }

    async addVideo(formData) {
        const url = `${this.baseURL}/api/videos`;
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add video');
        }

        return response.json();
    }

    async deleteVideo(id) {
        return this.request(`/videos/${id}`, { method: 'DELETE' });
    }

    async applaudVideo(id, applauded) {
        return this.request(`/videos/${id}/applaud`, { 
            method: 'PUT', 
            body: JSON.stringify({ applauded }) 
        });
    }

    // ============================================
    // BLOG
    // ============================================

    async getBlog() {
        return this.request('/blog');
    }

    async getAdminBlog() {
        return this.request('/admin/blog');
    }

    async addBlogPost(formData) {
        const url = `${this.baseURL}/api/blog`;
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add blog post');
        }

        return response.json();
    }

    async deleteBlogPost(id) {
        return this.request(`/blog/${id}`, { method: 'DELETE' });
    }

    async applaudBlogPost(id, applauded) {
        return this.request(`/blog/${id}/applaud`, { 
            method: 'PUT', 
            body: JSON.stringify({ applauded }) 
        });
    }

    // ============================================
    // EVENTS
    // ============================================

    async getEvents() {
        return this.request('/events');
    }

    async getAdminEvents() {
        return this.request('/admin/events');
    }

    async addEvent(formData) {
        const url = `${this.baseURL}/api/events`;
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add event');
        }

        return response.json();
    }

    async deleteEvent(id) {
        return this.request(`/events/${id}`, { method: 'DELETE' });
    }

    async applaudEvent(id, applauded) {
        return this.request(`/events/${id}/applaud`, { 
            method: 'PUT', 
            body: JSON.stringify({ applauded }) 
        });
    }

    // ============================================
    // DONATIONS
    // ============================================

    async getDonations() {
        return this.request('/donations');
    }

    async createDonationIntent(amount, email) {
        return this.request('/donations/intent', {
            method: 'POST',
            body: JSON.stringify({ amount, email })
        });
    }

    async confirmDonation(donationId, paymentIntentId, status) {
        return this.request('/donations/confirm', {
            method: 'POST',
            body: JSON.stringify({ donationId, paymentIntentId, status })
        });
    }

    async createMoMoDonation(donor_name, donor_email, donor_phone, amount) {
        return this.request('/donations/momo', {
            method: 'POST',
            body: JSON.stringify({ donor_name, donor_email, donor_phone, amount })
        });
    }

    // ============================================
    // BOOKINGS
    // ============================================
    async getBookings() {
        return this.request('/bookings');
    }

    async createBooking(data) {
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async deleteBooking(id) {
        return this.request(`/bookings/${id}`, { method: 'DELETE' });
    }

    // ============================================
    // CONTACT
    // ============================================
    async submitContact(formData) {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    }

    async getContactMessages() {
        return this.request('/contact');
    }
}

// Global API client instance
const api = new APIClient();

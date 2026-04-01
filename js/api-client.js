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
            console.log(`API Request: ${options.method || 'GET'} ${url}`);
            const response = await fetch(url, config);
            
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                const errorMsg = typeof data === 'object' ? data.error : data;
                throw new Error(errorMsg || `API request failed with status ${response.status}`);
            }

            return data;
        } catch (err) {
            console.error(`API Error [${endpoint}]:`, err.message || err);
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                throw new Error('Network error - Unable to connect to server. Make sure the server is running on ' + this.baseURL);
            }
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
    // TESTIMONIALS
    // ============================================

    async getTestimonials() {
        return this.request('/testimonials');
    }

    async getApplaudedTestimonials() {
        return this.request('/testimonials/applauded');
    }

    async getAdminTestimonials() {
        return this.request('/admin/testimonials');
    }

    async addTestimonial(formData) {
        const url = `${this.baseURL}/api/testimonials`;
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
            throw new Error('Failed to add testimonial');
        }

        return response.json();
    }

    async updateTestimonial(id, formData) {
        const url = `${this.baseURL}/api/testimonials/${id}`;
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
            throw new Error('Failed to update testimonial');
        }

        return response.json();
    }

    async deleteTestimonial(id) {
        return this.request(`/testimonials/${id}`, { method: 'DELETE' });
    }

    async applaudTestimonial(id, applauded) {
        return this.request(`/testimonials/${id}/applaud`, {
            method: 'PUT',
            body: JSON.stringify({ applauded })
        });
    }

    // ============================================
    // SOCIAL MEDIA
    // ============================================

    async getSocialMedia() {
        return this.request('/social-media');
    }

    async getAdminSocialMedia() {
        return this.request('/admin/social-media');
    }

    async addSocialMedia(data) {
        return this.request('/social-media', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateSocialMedia(id, data) {
        return this.request(`/social-media/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteSocialMedia(id) {
        return this.request(`/social-media/${id}`, { method: 'DELETE' });
    }

    // ============================================
    // IMPACT STATS
    // ============================================

    async getImpactStats() {
        return this.request('/impact-stats');
    }

    async updateImpactStats(data) {
        return this.request('/impact-stats', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // ============================================
    // CONTENT SECTIONS
    // ============================================

    async getContentSection(key) {
        return this.request(`/content-sections/${key}`);
    }

    async updateContentSection(key, formData) {
        const url = `${this.baseURL}/api/content-sections/${key}`;
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
            throw new Error('Failed to update content section');
        }

        return response.json();
    }

    // ============================================
    // LOGOS
    // ============================================

    async getLogos() {
        return this.request('/logos');
    }

    async getApplaudedLogos() {
        return this.request('/logos/applauded');
    }

    async getAdminLogos() {
        return this.request('/admin/logos');
    }

    async addLogo(formData) {
        const url = `${this.baseURL}/api/logos`;
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
            throw new Error('Failed to add logo');
        }

        return response.json();
    }

    async applaudLogo(id, applauded) {
        return this.request(`/logos/${id}/applaud`, {
            method: 'PUT',
            body: JSON.stringify({ applauded })
        });
    }

    async deleteLogo(id) {
        return this.request(`/logos/${id}`, { method: 'DELETE' });
    }

    // ============================================
    // VOLUNTEERS
    // ============================================

    async submitVolunteerApplication(data) {
        return this.request('/volunteers', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getVolunteers() {
        return this.request('/volunteers');
    }

    async approveVolunteer(id) {
        return this.request(`/volunteers/${id}/approve`, { method: 'PUT' });
    }
}

// Global API client instance
const api = new APIClient();

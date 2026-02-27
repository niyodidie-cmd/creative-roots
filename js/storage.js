/* ============================================
   CREATIVE ROOTS - DATA STORAGE SYSTEM
   Handles all localStorage operations for demo
   NOTE: This is demo-level storage. Real deployment
         requires backend + database.
   ============================================ */

const StorageManager = {
    // Initialize default data in localStorage
    init() {
        if (!localStorage.getItem('crw_initialized')) {
            this.createDefaultData();
            localStorage.setItem('crw_initialized', 'true');
        }
    },

    // Create default data if none exists
    createDefaultData() {
        if (!this.get('gallery')) {
            this.set('gallery', [
                {
                    id: 1,
                    title: 'Abstract Dreams',
                    artist: 'Youth Artist',
                    description: 'A vibrant exploration of form and color',
                    image: 'images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png'
                },
                {
                    id: 2,
                    title: 'Cultural Sculpture',
                    artist: 'Youth Artist',
                    description: 'Traditional forms reimagined for modern times',
                    image: 'images/Gemini_Generated_Image_43dziw43dziw43dz.png'
                },
                {
                    id: 3,
                    title: 'Community Stories',
                    artist: 'Youth Artist',
                    description: 'Visual narratives weaving diverse voices',
                    image: 'images/Gemini_Generated_Image_c3y70fc3y70fc3y7.png'
                },
                {
                    id: 4,
                    title: 'Creativity Unleashed',
                    artist: 'Youth Artist',
                    description: 'When barriers dissolve and confidence blooms',
                    image: 'images/Gemini_Generated_Image_ilbvweilbvweilbv.png'
                },
                {
                    id: 5,
                    title: 'Hidden Talent',
                    artist: 'Youth Artist',
                    description: 'Every brushstroke reveals extraordinary potential',
                    image: 'images/Gemini_Generated_Image_fuqoq9fuqoq9fuqo.png'
                },
                {
                    id: 6,
                    title: 'Artistic Expression',
                    artist: 'Youth Artist',
                    description: 'Celebration of voices finding their power',
                    image: 'images/Gemini_Generated_Image_ofmeyhofmeyhofme.png'
                }
            ]);
        }

        if (!this.get('events')) {
            this.set('events', [
                {
                    id: 1,
                    title: 'Youth Art Workshop',
                    date: '2026-03-15',
                    time: '14:00',
                    location: 'Creative Hub, Kigali',
                    description: 'Learn painting, sculpture, and mixed media techniques',
                    capacity: 30,
                    booked: 12,
                    image: 'images/Gemini_Generated_Image_x0csqhx0csqhx0cs.png'
                },
                {
                    id: 2,
                    title: 'Storytelling Circle',
                    date: '2026-03-22',
                    time: '15:00',
                    location: 'Community Center, Kigali',
                    description: 'Share your story, hear others, build community',
                    capacity: 25,
                    booked: 8,
                    image: 'images/Gemini_Generated_Image_rcibkwrcibkwrcib.png'
                },
                {
                    id: 3,
                    title: 'Community Art Exhibition',
                    date: '2026-03-29',
                    time: '10:00',
                    location: 'National Museum, Kigali',
                    description: 'Showcase of artwork created by our young artists',
                    capacity: 100,
                    booked: 45,
                    image: 'images/Gemini_Generated_Image_pbf6cgpbf6cgpbf6.png'
                }
            ]);
        }

        if (!this.get('bookings')) {
            this.set('bookings', []);
        }

        if (!this.get('stories')) {
            this.set('stories', [
                {
                    id: 1,
                    name: 'Claudine W.',
                    title: 'Found Her Voice',
                    description: 'Through art workshops at Creative Roots, I discovered my voice. I went from being shy to sharing my story with 200 people.',
                    image: 'images/Gemini_Generated_Image_pbf6cgpbf6cgpbf6.png',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    type: 'youth'
                },
                {
                    id: 2,
                    name: 'Jean P.',
                    title: 'Transformed Through Creativity',
                    description: 'Creative Roots gave me confidence. Now I mentor other young artists in my community.',
                    image: 'images/Gemini_Generated_Image_x0csqhx0csqhx0cs.png',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    type: 'youth'
                },
                {
                    id: 3,
                    name: 'Marie K.',
                    title: 'Building Future Leaders',
                    description: 'Seeing youth connect with their creativity brings hope. This is real community transformation.',
                    image: 'images/Gemini_Generated_Image_rcibkwrcibkwrcib.png',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    type: 'community'
                }
            ]);
        }
        
        if (!this.get('projects')) {
            this.set('projects', [
                {
                    id: 1,
                    title: 'Youth Art Workshops',
                    description: 'Interactive sessions where young people learn painting, sculpture, and mixed media techniques.',
                    image: 'images/Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png'
                },
                {
                    id: 2,
                    title: 'Storytelling Circles',
                    description: 'Safe spaces for youth to share personal stories and cultural narratives.',
                    image: 'images/Gemini_Generated_Image_43dziw43dziw43dz.png'
                },
                {
                    id: 3,
                    title: 'Community Art Exhibitions',
                    description: 'Public showcases of young people\'s artwork and creative projects.',
                    image: 'images/Gemini_Generated_Image_c3y70fc3y70fc3y7.png'
                }
            ]);
        }

        if (!this.get('language')) {
            this.set('language', 'en');
        }

        if (!this.get('admin_login')) {
            // Demo credentials: username: admin, password: admin123
            this.set('admin_login', { username: 'admin', password: 'admin123' });
        }
    },

    // Generic get from localStorage
    get(key) {
        try {
            const data = localStorage.getItem('crw_' + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error reading ${key} from storage:`, e);
            return null;
        }
    },

    // Generic set to localStorage
    set(key, value) {
        try {
            localStorage.setItem('crw_' + key, JSON.stringify(value));
            // Trigger storage event for other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'crw_' + key,
                newValue: JSON.stringify(value),
                oldValue: null,
                storageArea: localStorage
            }));
        } catch (e) {
            console.error(`Error writing ${key} to storage:`, e);
        }
    },

    // Gallery Management
    getGallery() {
        return this.get('gallery') || [];
    },

    addGalleryItem(item) {
        const gallery = this.getGallery();
        item.id = Math.max(...gallery.map(g => g.id), 0) + 1;
        gallery.push(item);
        this.set('gallery', gallery);
        return item;
    },

    updateGalleryItem(id, updates) {
        const gallery = this.getGallery();
        const item = gallery.find(g => g.id === id);
        if (item) {
            Object.assign(item, updates);
            this.set('gallery', gallery);
        }
        return item;
    },

    deleteGalleryItem(id) {
        const gallery = this.getGallery().filter(g => g.id !== id);
        this.set('gallery', gallery);
    },

    // Events Management
    getEvents() {
        return this.get('events') || [];
    },

    getEvent(id) {
        return this.getEvents().find(e => e.id === id);
    },

    addEvent(event) {
        const events = this.getEvents();
        event.id = Math.max(...events.map(e => e.id), 0) + 1;
        event.booked = 0;
        events.push(event);
        this.set('events', events);
        return event;
    },

    updateEvent(id, updates) {
        const events = this.getEvents();
        const event = events.find(e => e.id === id);
        if (event) {
            Object.assign(event, updates);
            this.set('events', events);
        }
        return event;
    },

    deleteEvent(id) {
        const events = this.getEvents().filter(e => e.id !== id);
        this.set('events', events);
    },

    // Bookings Management
    getBookings() {
        return this.get('bookings') || [];
    },

    getBookingsForEvent(eventId) {
        return this.getBookings().filter(b => b.eventId === eventId);
    },

    addBooking(booking) {
        const bookings = this.getBookings();
        booking.id = Math.max(...bookings.map(b => b.id), 0) + 1;
        booking.date = new Date().toISOString();
        bookings.push(booking);
        this.set('bookings', bookings);

        // Update event booked count
        const event = this.getEvent(booking.eventId);
        if (event) {
            event.booked += booking.attendees;
            this.updateEvent(event.id, event);
        }

        return booking;
    },

    deleteBooking(id) {
        const booking = this.getBookings().find(b => b.id === id);
        if (booking && booking.eventId) {
            const event = this.getEvent(booking.eventId);
            if (event) {
                event.booked = Math.max(0, event.booked - booking.attendees);
                this.updateEvent(event.id, event);
            }
        }
        const bookings = this.getBookings().filter(b => b.id !== id);
        this.set('bookings', bookings);
    },

    // Stories Management
    getStories() {
        return this.get('stories') || [];
    },

    // Projects Management
    getProjects() {
        return this.get('projects') || [];
    },

    getProject(id) {
        return this.getProjects().find(p => p.id === id);
    },

    addProject(project) {
        const projects = this.getProjects();
        project.id = Math.max(...projects.map(p => p.id), 0) + 1;
        projects.push(project);
        this.set('projects', projects);
        return project;
    },

    updateProject(id, updates) {
        const projects = this.getProjects();
        const project = projects.find(p => p.id === id);
        if (project) {
            Object.assign(project, updates);
            this.set('projects', projects);
        }
        return project;
    },

    deleteProject(id) {
        const projects = this.getProjects().filter(p => p.id !== id);
        this.set('projects', projects);
    },

    getStory(id) {
        return this.getStories().find(s => s.id === id);
    },

    addStory(story) {
        const stories = this.getStories();
        story.id = Math.max(...stories.map(s => s.id), 0) + 1;
        stories.push(story);
        this.set('stories', stories);
        return story;
    },

    updateStory(id, updates) {
        const stories = this.getStories();
        const story = stories.find(s => s.id === id);
        if (story) {
            Object.assign(story, updates);
            this.set('stories', stories);
        }
        return story;
    },

    deleteStory(id) {
        const stories = this.getStories().filter(s => s.id !== id);
        this.set('stories', stories);
    },

    // Language Management
    getLanguage() {
        return this.get('language') || 'en';
    },

    setLanguage(lang) {
        this.set('language', lang);
    },

    // Admin Authentication
    checkAdminAuth() {
        const isLoggedIn = localStorage.getItem('crw_admin_logged_in') === 'true';
        return isLoggedIn;
    },

    loginAdmin(username, password) {
        const credentials = this.get('admin_login');
        if (credentials && credentials.username === username && credentials.password === password) {
            localStorage.setItem('crw_admin_logged_in', 'true');
            return true;
        }
        return false;
    },

    logoutAdmin() {
        localStorage.removeItem('crw_admin_logged_in');
    },

    // Image URL conversion (base64 to file path)
    convertImageToPath(file, category) {
        // For demo, we store the file name
        return `images/${category}/${file.name}`;
    },

    // Get available images from images folder
    getAvailableImages() {
        return {
            gallery: [
                'Gemini_Generated_Image_43dziw43dziw43dz.png',
                'Gemini_Generated_Image_9qcfyd9qcfyd9qcf.png',
                'Gemini_Generated_Image_c3y70fc3y70fc3y7.png',
                'Gemini_Generated_Image_fuqoq9fuqoq9fuqo.png',
                'Gemini_Generated_Image_ilbvweilbvweilbv.png',
                'Gemini_Generated_Image_ofmeyhofmeyhofme.png',
                'Gemini_Generated_Image_pbf6cgpbf6cgpbf6.png',
                'Gemini_Generated_Image_rcibkwrcibkwrcib.png',
                'Gemini_Generated_Image_x0csqhx0csqhx0cs.png',
                'ChatGPT Image Feb 22, 2026, 07_37_02 AM.png',
                'ChatGPT Image Feb 22, 2026, 07_38_31 AM.png'
            ]
        };
    }
};

// Initialize storage on page load
document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();
});

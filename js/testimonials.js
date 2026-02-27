/* ============================================
   TESTIMONIALS MANAGEMENT SYSTEM
   Handles: Loading, saving, editing testimonials with localStorage
   ============================================ */

// Default testimonials if none exist
const DEFAULT_TESTIMONIALS = [
    {
        id: 1,
        name: "Amara",
        age: 16,
        quote: "I never saw myself as an artist until I came to Creative Roots. Now I use my art to tell my story and my community sees me differently. I feel powerful.",
        emoji: "👩",
        bgColor: "#D4A373"
    },
    {
        id: 2,
        name: "Jovan",
        age: 22,
        quote: "Through storytelling, I've learned that my voice matters. I went from feeling invisible to leading workshops for other youth. This changed my life.",
        emoji: "👨",
        bgColor: "#8B5E3C"
    },
    {
        id: 3,
        name: "Kagera",
        age: 14,
        quote: "Making sculpture taught me that failure is part of creation. I'm not afraid to try things now. I'm creating my own path.",
        emoji: "👧",
        bgColor: "#D4A373"
    }
];

// ============================================
// TESTIMONIALS MANAGEMENT CLASS
// ============================================

class TestimonialsManager {
    constructor(storageKey = 'creativeRootsTestimonials') {
        this.storageKey = storageKey;
        this.testimonials = this.loadTestimonials();
    }

    // Load testimonials from localStorage
    loadTestimonials() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_TESTIMONIALS));
    }

    // Save testimonials to localStorage
    saveTestimonials() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.testimonials));
    }

    // Add new testimonial
    addTestimonial(testimonial) {
        const newTestimonial = {
            id: Math.max(...this.testimonials.map(t => t.id || 0), 0) + 1,
            name: testimonial.name,
            age: testimonial.age,
            quote: testimonial.quote,
            emoji: testimonial.emoji || "👤",
            bgColor: testimonial.bgColor || "#D4A373"
        };
        this.testimonials.push(newTestimonial);
        this.saveTestimonials();
        return newTestimonial;
    }

    // Update testimonial
    updateTestimonial(id, updates) {
        const index = this.testimonials.findIndex(t => t.id === id);
        if (index !== -1) {
            this.testimonials[index] = { ...this.testimonials[index], ...updates };
            this.saveTestimonials();
            return this.testimonials[index];
        }
        return null;
    }

    // Delete testimonial
    deleteTestimonial(id) {
        const index = this.testimonials.findIndex(t => t.id === id);
        if (index !== -1) {
            this.testimonials.splice(index, 1);
            this.saveTestimonials();
            return true;
        }
        return false;
    }

    // Get all testimonials
    getAll() {
        return this.testimonials;
    }

    // Reset to defaults
    resetToDefaults() {
        this.testimonials = JSON.parse(JSON.stringify(DEFAULT_TESTIMONIALS));
        this.saveTestimonials();
    }
}

// Initialize testimonials manager globally
const testimonialsManager = new TestimonialsManager();

// ============================================
// HOMEPAGE TESTIMONIALS RENDERING
// ============================================

function renderTestimonialsOnHomepage() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;

    const testimonials = testimonialsManager.getAll();
    grid.innerHTML = '';

    testimonials.forEach((testimonial, index) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card fade-on-scroll';
        card.style.animation = `fadeInUp 0.8s ease forwards`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        const svgImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='100' fill='${encodeURIComponent(testimonial.bgColor)}'/%3E%3Ctext x='50%25' y='50%25' font-size='100' text-anchor='middle' dominant-baseline='middle'%3E${testimonial.emoji}%3C/text%3E%3C/svg%3E`;
        
        card.innerHTML = `
            <div class="testimonial-image">
                <img src="${svgImage}" alt="${testimonial.name}'s story">
            </div>
            <h3>${testimonial.name}, ${testimonial.age}</h3>
            <p class="testimonial-quote">
                "${testimonial.quote}"
            </p>
        `;
        
        grid.appendChild(card);
    });
}

// Render testimonials when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderTestimonialsOnHomepage();
    
    // Apply animations
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
        if (!card.style.opacity) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        }
    });
});

// ============================================
// EXPORT FOR ADMIN USE
// ============================================

window.testimonialsManager = testimonialsManager;
window.renderTestimonialsOnHomepage = renderTestimonialsOnHomepage;

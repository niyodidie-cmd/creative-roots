/* ============================================
   CONTACT FORM HANDLER
   Sends user messages to backend and shows feedback
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const successEl = document.getElementById('contactSuccess');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!message) {
            alert('Please enter a message');
            return;
        }

        try {
            await api.submitContact({ name, email, subject, message });
            successEl.textContent = 'Thank you! Your message has been sent.';
            successEl.style.display = 'block';
            form.reset();
            setTimeout(() => successEl.style.display = 'none', 5000);
        } catch (err) {
            console.error('Contact submission error:', err);
            alert('There was an error sending your message. Please try again later.');
        }
    });
});

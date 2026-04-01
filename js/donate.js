/* ============================================
   DONATION PAGE SCRIPT
   Handles form interactions, translations, and demo flow
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
    initAmountButtons();
    initPaymentMethods();
    initDonationForm();
});

function initAmountButtons() {
    const buttons = document.querySelectorAll('.amount-btn');
    const customInput = document.getElementById('customAmount');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            customInput.value = btn.getAttribute('data-amount');
        });
    });

    customInput.addEventListener('input', () => {
        buttons.forEach(b => b.classList.remove('active'));
    });
}

function initPaymentMethods() {
    const methods = document.querySelectorAll('.payment-method');
    const phoneGroup = document.getElementById('phoneGroup');
    methods.forEach(m => {
        m.addEventListener('click', () => {
            methods.forEach(x => x.classList.remove('active'));
            m.classList.add('active');

            // show phone field when mobile selected
            if (m.getAttribute('data-method') === 'mobile') {
                if (phoneGroup) phoneGroup.style.display = 'block';
            } else {
                if (phoneGroup) phoneGroup.style.display = 'none';
            }
        });
    });
}

function initDonationForm() {
    const form = document.getElementById('donationForm');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Get selected payment method
        const activeMethod = document.querySelector('.payment-method.active');
        data.payment_method = activeMethod ? activeMethod.getAttribute('data-method') : 'form';

        try {
            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (response.ok) {
                successMessage.textContent = result.message;
                successMessage.classList.add('show');
                form.reset();
                document.querySelectorAll('.payment-method, .amount-btn').forEach(el => el.classList.remove('active'));
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 6000);
            } else {
                throw new Error(result.error || 'Failed to submit donation');
            }
        } catch (error) {
            console.error('Donation error:', error);
            alert(error.message || 'Failed to submit donation. Please try again.');
        }
    });
}

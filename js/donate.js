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
        const name = form.fullName.value.trim();
        const email = form.email.value.trim();
        const amount = parseFloat(form.customAmount.value);
        const method = document.querySelector('.payment-method.active')?.getAttribute('data-method');
        const phone = form.phone ? form.phone.value.trim() : '';

        if (!name || !email || !amount || amount < 1) {
            alert('Please fill out all required fields with a valid amount.');
            return;
        }

        try {
            if (method === 'card') {
                const intent = await api.createDonationIntent(amount, email);
                // in production you would use Stripe.js to confirm payment using intent.clientSecret
                successMessage.textContent = '✓ Donation intent created. Please complete payment with the provided link or details.';
                successMessage.classList.add('visible');
            } else if (method === 'mobile') {
                const resp = await api.createMoMoDonation(name, email, phone, amount);
                if (resp.success) {
                    successMessage.textContent = resp.message;
                    successMessage.classList.add('visible');
                } else {
                    throw new Error(resp.error || 'Mobile donation failed');
                }
            } else {
                alert('Please select a payment method');
                return;
            }
        } catch (err) {
            console.error('Donation error:', err);
            alert(err.message || 'Donation could not be processed');
        }

        form.reset();
        document.querySelectorAll('.payment-method, .amount-btn').forEach(el => el.classList.remove('active'));
        setTimeout(() => {
            successMessage.classList.remove('visible');
        }, 6000);
    });
}

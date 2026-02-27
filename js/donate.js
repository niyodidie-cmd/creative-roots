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
    methods.forEach(m => {
        m.addEventListener('click', () => {
            methods.forEach(x => x.classList.remove('active'));
            m.classList.add('active');
        });
    });
}

function initDonationForm() {
    const form = document.getElementById('donationForm');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // gather data (not used)
        const name = form.fullName.value;
        const email = form.email.value;
        const amount = form.customAmount.value;
        const method = document.querySelector('.payment-method.active')?.getAttribute('data-method');

        // simple validation
        if (!name || !email || !amount) {
            alert('Please fill out all required fields.');
            return;
        }

        // show success
        successMessage.classList.add('visible');
        setTimeout(() => {
            successMessage.classList.remove('visible');
        }, 4000);
        form.reset();
        document.querySelectorAll('.payment-method, .amount-btn').forEach(el => el.classList.remove('active'));
    });
}

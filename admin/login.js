/* ============================================
   ADMIN LOGIN JAVASCRIPT
   Handles authentication
   Demo Credentials: admin / admin123
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();
    LanguageManager.init();

    // Check if already logged in via token
    if (api.isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;
    const errorMsg = document.getElementById('errorMessage');

    if (!username || !password) {
        if (errorMsg) {
            errorMsg.textContent = 'Please enter username and password';
            errorMsg.style.display = 'block';
        }
        return;
    }

    try {
        const resp = await api.login(username, password);
        if (resp && resp.token) {
            api.setToken(resp.token);
            window.location.href = 'dashboard.html';
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (err) {
        if (errorMsg) {
            errorMsg.textContent = err.message || 'Invalid username or password';
            errorMsg.style.display = 'block';
        }
        document.getElementById('password').value = '';
    }
}

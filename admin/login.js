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
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loginBtn = document.querySelector('.login-btn');

    if (!username || !password) {
        if (errorMsg) {
            errorMsg.textContent = 'Please enter username and password';
            errorMsg.classList.add('show');
        }
        return;
    }

    try {
        // Show loading state
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        if (loginBtn) loginBtn.disabled = true;
        if (errorMsg) errorMsg.classList.remove('show');

        console.log('Attempting login for user:', username);
        const resp = await api.login(username, password);
        
        if (resp && resp.token) {
            console.log('Login successful, token received');
            api.setToken(resp.token);
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (err) {
        console.error('Login error:', err);
        if (errorMsg) {
            let message = err.message || 'Login failed';
            if (message.includes('Network error') || message.includes('Failed to fetch')) {
                message = '⚠️ Connection Error: Cannot reach the server at ' + api.baseURL;
            } else if (message.includes('Invalid credentials') || message.includes('401')) {
                message = '❌ Invalid username or password';
            }
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        }
        const passwordField = document.getElementById('password');
        if (passwordField) passwordField.value = '';
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (loginBtn) loginBtn.disabled = false;
    }
}

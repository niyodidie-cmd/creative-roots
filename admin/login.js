/* ============================================
   ADMIN LOGIN JAVASCRIPT
   Handles authentication
   Demo Credentials: admin / admin123
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();
    LanguageManager.init();

    // Check if already logged in
    if (StorageManager.checkAdminAuth()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(e) {
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

    if (StorageManager.loginAdmin(username, password)) {
        // Login successful
        window.location.href = 'dashboard.html';
    } else {
        // Login failed
        if (errorMsg) {
            errorMsg.textContent = 'Invalid username or password';
            errorMsg.style.display = 'block';
        }
        document.getElementById('password').value = '';
    }
}

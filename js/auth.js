import { signInWithGoogle, logoutUser, onAuthStateChange } from './auth-service.js';

// Handle Google Sign In
window.handleGoogleLogin = async () => {
    const { user, error } = await signInWithGoogle();
    if (error) {
        console.error('Login error:', error);
        alert('Failed to sign in with Google. Please try again.');
    } else {
        updateUIForUser(user);
    }
};

// Handle Logout
window.handleLogout = async () => {
    const { error } = await logoutUser();
    if (error) {
        console.error('Logout error:', error);
        alert('Failed to log out. Please try again.');
    } else {
        updateUIForLogout();
    }
};

// Update UI for logged in user
function updateUIForUser(user) {
    const loginBtn = document.getElementById('google-login');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');

    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    userAvatar.src = user.photoURL || 'assets/default-avatar.png';
    userName.textContent = user.displayName || user.email;
}

// Update UI for logged out state
function updateUIForLogout() {
    const loginBtn = document.getElementById('google-login');
    const userProfile = document.getElementById('user-profile');

    loginBtn.style.display = 'flex';
    userProfile.style.display = 'none';
}

// Listen for auth state changes
onAuthStateChange((user) => {
    if (user) {
        updateUIForUser(user);
    } else {
        updateUIForLogout();
    }
}); 
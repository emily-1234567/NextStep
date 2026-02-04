// Import Firebase SDK modules from CDN
// These imports bring in Firebase authentication functionality
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration object
// Contains all the necessary credentials and identifiers for connecting to the Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBohx_5opFEgh2Xb-EO977v3KzQJ89CAf4",
  authDomain: "NextStep.firebaseapp.com",
  projectId: "NextStep",
  storageBucket: "NextStep.firebasestorage.app",
  messagingSenderId: "428056422654",
  appId: "1:428056422654:web:2d6ff0d08002134b3cddaf",
  measurementId: "G-E0YCVB3KK9"
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Get the Firebase Authentication instance
const auth = getAuth(app);

// Make auth available globally by attaching it to the window object
// This allows other JavaScript files to access the auth instance
window.firebaseAuth = auth;

/**
 * Get initials from a user's full name
 * @param {string} name - The full name of the user
 * @returns {string} - Initials (first + last name initials, or first 2 chars if single name)
 */
function getInitials(name) {
  // Return 'U' for undefined/empty names
  if (!name) return 'U';
  
  // Split the name into parts (words)
  const parts = name.trim().split(' ');
  
  // If name has 2+ parts, take first letter of first and last part
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  // For single-word names, take first 2 characters
  return name.substring(0, 2).toUpperCase();
}

/**
 * Create a full-screen overlay that prompts users to login
 * This is shown when unauthenticated users try to access protected pages
 */
function createLoginOverlay() {
  // Create the overlay container element
  const overlay = document.createElement('div');
  overlay.id = 'login-required-overlay';
  
  // Set the HTML content with embedded styles and login prompt
  overlay.innerHTML = `
    <style>
      /* Full-screen overlay that covers the entire page */
      #login-required-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      }
      
      /* Fade-in animation for the overlay */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      /* White card containing the login prompt */
      .login-required-card {
        background: white;
        border-radius: 20px;
        padding: 50px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease;
      }
      
      /* Slide-up animation for the card */
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Lock icon styling */
      .login-required-icon {
        font-size: 80px;
        margin-bottom: 20px;
      }
      
      /* Main title styling */
      .login-required-title {
        font-size: 32px;
        font-weight: 800;
        color: rgb(1, 9, 67);
        margin-bottom: 15px;
      }
      
      /* Message text styling */
      .login-required-message {
        font-size: 18px;
        color: #64748b;
        margin-bottom: 30px;
        line-height: 1.6;
      }
      
      /* Container for action buttons */
      .login-required-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
      }
      
      /* Base button styling */
      .login-required-btn {
        padding: 15px 35px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;
        display: inline-block;
        border: none;
        font-family: 'Open Sans', sans-serif;
      }
      
      /* Primary login button - blue gradient */
      .btn-login {
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        color: white;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
      }
      
      /* Hover effect for login button */
      .btn-login:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
      }
      
      /* Signup button - outlined style */
      .btn-signup {
        background: white;
        color: #2563eb;
        border: 2px solid #2563eb;
      }
      
      /* Hover effect for signup button */
      .btn-signup:hover {
        background: #eff6ff;
        transform: translateY(-3px);
      }
      
      /* Back button - subtle gray */
      .btn-back {
        background: #f1f5f9;
        color: #64748b;
      }
      
      /* Hover effect for back button */
      .btn-back:hover {
        background: #e2e8f0;
      }
      
      /* Responsive design for mobile devices */
      @media (max-width: 768px) {
        .login-required-card {
          padding: 40px 30px;
          margin: 20px;
        }
        
        .login-required-title {
          font-size: 26px;
        }
        
        .login-required-message {
          font-size: 16px;
        }
        
        /* Stack buttons vertically on mobile */
        .login-required-buttons {
          flex-direction: column;
        }
        
        /* Full-width buttons on mobile */
        .login-required-btn {
          width: 100%;
        }
      }
    </style>
    
    <div class="login-required-card">
      <div class="login-required-icon">🔒</div>
      <h1 class="login-required-title">Login Required</h1>
      <p class="login-required-message">
        You need to be logged in to access this page. 
        Sign in to view your badges, track your progress, and unlock exclusive features!
      </p>
      <div class="login-required-buttons">
        <a href="login.html" class="login-required-btn btn-login">
          Login Now →
        </a>
        <a href="signup.html" class="login-required-btn btn-signup">
          Create Account
        </a>
        <a href="index.html" class="login-required-btn btn-back">
          ← Go Back
        </a>
      </div>
    </div>
  `;
  
  // Add the overlay to the page
  document.body.appendChild(overlay);
  
  // Prevent scrolling when overlay is active
  document.body.style.overflow = 'hidden';
}

/**
 * Check user authentication status and update the navigation bar accordingly
 * This function runs whenever the auth state changes (login/logout)
 */
function checkAuth() {
  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    // Find the login link in the navigation
    const loginLink = document.querySelector('.login');
    
    // If user is logged in and login link exists
    if (user && loginLink) {
      // Get user display name, fallback to email username if not set
      const displayName = user.displayName || user.email.split('@')[0];
      
      // Generate initials for the profile icon
      const initials = getInitials(displayName);
      
      // Try to get profile photo from multiple sources
      const photoURL = user.photoURL || localStorage.getItem('profilePhoto') || localStorage.getItem('userPhotoURL');
      
      // Extract first name for greeting
      const firstName = displayName.split(' ')[0];
      
      // Save user data to localStorage for access across pages
      try {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', displayName);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPhotoURL', photoURL || '');
        localStorage.setItem('userId', user.uid);
        
        // Set member since date only if it doesn't exist
        if (!localStorage.getItem('memberSince')) {
          localStorage.setItem('memberSince', user.metadata.creationTime || new Date().toISOString());
        }
      } catch (e) {
        console.error('Error saving user data:', e);
      }
      
      // Replace the login button with a profile dropdown menu
      const navItem = loginLink.closest('.navbar-item');
      navItem.innerHTML = `
        <div class="profile-dropdown">
          <button class="profile-btn" onclick="toggleProfileMenu()">
            ${photoURL 
              ? `<img src="${photoURL}" alt="Profile" class="profile-photo-nav">` 
              : `<span class="profile-initials";">${initials}</span>`
            }
            <span class="profile-name">${firstName}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="profile-menu" id="profile-menu">
            <div class="profile-menu-header">
              <strong style="color: var(--text-primary);">${displayName}</strong>
              <span class="profile-menu-email">${user.email}</span>
            </div>
            <div class="profile-menu-divider"></div>
            <a href="profile.html" class="profile-menu-item">
              <span class="menu-icon"><i class="fa-solid fa-user"></i></span> My Profile
            </a>
            <a href="profile.html#settings" class="profile-menu-item">
              <span class="menu-icon"><i class="fa-solid fa-gear"></i></span> Settings
            </a>
            <a href="badges.html" class="profile-menu-item">
              <span class="menu-icon"><i class="fa-solid fa-trophy"></i></span> Badges
            </a>
            <div class="profile-menu-divider"></div>
            <a href="#" onclick="logout(event)" class="profile-menu-item logout">
              <span class="menu-icon"><i class="fa-solid fa-arrow-right-from-bracket"></i></span> Logout
            </a>
          </div>
        </div>
      `;
      
      // Remove the signup button since user is already logged in
      const signupLink = document.querySelector('.signup');
      if (signupLink) {
        const signupItem = signupLink.closest('.navbar-item');
        if (signupItem) signupItem.remove();
      }
      
      // Listen for profile photo updates from localStorage (cross-tab communication)
      window.addEventListener('storage', function(e) {
        if (e.key === 'profilePhoto' || e.key === 'userPhotoURL') {
          updateNavPhoto(e.newValue);
        }
      });
      
      // Listen for custom events from the profile page (same-tab communication)
      window.addEventListener('profilePhotoUpdated', function(e) {
        updateNavPhoto(e.detail.photoURL);
      });
      
    } else if (!user) {
      // User is not logged in - clean up stored data
      try {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhotoURL');
        localStorage.removeItem('userId');
      } catch (e) {
        console.error('Error clearing data:', e);
      }
      
      // Check if the current page requires authentication
      const currentPage = window.location.pathname.split('/').pop();
      const protectedPages = ['profile.html', 'badges.html'];
      
      // Show login overlay instead of redirecting for better UX
      if (protectedPages.includes(currentPage)) {
        createLoginOverlay();
      }
    }
  });
}

/**
 * Update the profile photo in the navigation bar dynamically
 * @param {string} photoURL - The URL of the new profile photo
 */
function updateNavPhoto(photoURL) {
  // Find the profile button in the navigation
  const profileBtn = document.querySelector('.profile-btn');
  if (!profileBtn) return;
  
  // Check what's currently displayed (photo or initials)
  const existingPhoto = profileBtn.querySelector('.profile-photo-nav');
  const existingInitials = profileBtn.querySelector('.profile-initials');
  
  if (photoURL) {
    // Replace initials with photo or update existing photo
    if (existingInitials) {
      existingInitials.outerHTML = `<img src="${photoURL}" alt="Profile" class="profile-photo-nav">`;
    } else if (existingPhoto) {
      existingPhoto.src = photoURL;
    }
  } else {
    // Replace photo with initials (fallback when photo is removed)
    if (existingPhoto) {
      const user = auth.currentUser;
      const name = user?.displayName || user?.email?.split('@')[0] || 'User';
      existingPhoto.outerHTML = `<span class="profile-initials">${getInitials(name)}</span>`;
    }
  }
}

/**
 * Toggle the visibility of the profile dropdown menu
 * Made global via window object so it can be called from HTML onclick
 */
window.toggleProfileMenu = function() {
  const menu = document.getElementById('profile-menu');
  if (menu) {
    menu.classList.toggle('show');
  }
};

// Close the profile dropdown when user clicks anywhere outside of it
document.addEventListener('click', function(event) {
  const dropdown = document.querySelector('.profile-dropdown');
  
  // Check if click was outside the dropdown
  if (dropdown && !dropdown.contains(event.target)) {
    const menu = document.getElementById('profile-menu');
    if (menu) {
      menu.classList.remove('show');
    }
  }
});

/**
 * Log out the current user
 * @param {Event} event - The click event (to prevent default link behavior)
 * Made global via window object so it can be called from HTML onclick
 */
window.logout = async function(event) {
  // Prevent default link behavior if called from a link
  if (event) {
    event.preventDefault();
  }
  
  // Confirm logout action with the user
  if (confirm('Are you sure you want to logout?')) {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear all stored user data from localStorage
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Error clearing data:', e);
      }
      
      // Redirect to home page
      window.location.href = 'index.html';
    } catch (error) {
      // Handle any errors during logout
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  }
};

// Make utility functions globally available
window.getInitials = getInitials;
window.updateNavPhoto = updateNavPhoto;

// Start checking authentication status when the script loads
checkAuth();
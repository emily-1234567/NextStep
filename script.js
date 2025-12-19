console.log("JS loaded");

// Get elements
const heroTitle = document.getElementById('heroTitle');
const heroTagline = document.getElementById('heroTagline');
const heroSection = document.getElementById('hero');
const imageReveal = document.getElementById('revealSection');
const heroImage = document.getElementById('heroImage');
const firstPoint = document.querySelector('.point .point-content');

let ticking = false;

// FIX: Removed scroll lock - let browser handle scroll naturally
function smoothParallax() {
  const scrollY = window.scrollY;

  // Safety check - only run if elements exist
  if (!heroTitle || !heroTagline || !heroImage || !imageReveal) {
    return;
  }

  // Get positions FIRST
  const imageRect = imageReveal.getBoundingClientRect();
  const imageBottom = imageRect.bottom + scrollY; // Absolute position
  
  // 1. MOVE TITLE + TAGLINE TOGETHER (FAST through image)
  const maxTranslation = imageBottom - 200; // Stop 200px before image ends
  const translation = Math.min(scrollY * 2.2, maxTranslation); // FAST: 2.2x speed - perfect balance
  heroTitle.style.transform = `translateY(${translation}px)`;
  heroTagline.style.transform = `translateY(${translation}px)`;
  
  // Get updated positions AFTER transform
  const titleRect = heroTitle.getBoundingClientRect();
  const taglineRect = heroTagline.getBoundingClientRect();
  const titleBottom = titleRect.bottom + scrollY; // Absolute position after transform

  // 2. DISAPPEAR AT END OF IMAGE
  // Hide title/tagline when they reach the BOTTOM of the image
  if (titleBottom >= imageBottom) {
    heroTitle.style.opacity = 0;
    heroTagline.style.opacity = 0;
  } else {
    heroTitle.style.opacity = 1;
    heroTagline.style.opacity = 1;
  }

  // 3. CHECK IF TEXT IS OVER IMAGE
  const titleOverImage = titleRect.bottom > imageRect.top && titleRect.top < imageRect.bottom;
  const taglineOverImage = taglineRect.bottom > imageRect.top && taglineRect.top < imageRect.bottom;

  // 4. TITLE COLOR CHANGE
  if (titleOverImage) {
    heroTitle.style.color = "white";
    const accent = heroTitle.querySelector(".accent");
    if (accent) accent.style.color = "white";
    heroTitle.style.textShadow = "0 4px 20px rgba(0,0,0,0.8)";
  } else {
    heroTitle.style.color = "rgb(1, 9, 67)";
    const accent = heroTitle.querySelector(".accent");
    if (accent) accent.style.color = "#1e40ff";
    heroTitle.style.textShadow = "none";
  }

  // 5. TAGLINE COLOR CHANGE
  if (taglineOverImage) {
    heroTagline.style.color = "white";
    heroTagline.style.textShadow = "0 2px 15px rgba(0,0,0,0.6)";
  } else {
    heroTagline.style.color = "rgb(1, 9, 67)";
    heroTagline.style.textShadow = "none";
  }

  // 6. IMAGE ZOOM + WIDTH EXPANSION + BORDER RADIUS
  const imageScrollMultiplier = 1.0; // Balanced: Natural, smooth zoom
  const effectiveScroll = scrollY * imageScrollMultiplier;
  
  // Scale (zoom in)
  const scale = 1 + Math.min(effectiveScroll / 2000, 0.2);
  
  // Width expansion: starts at 80%, expands to 100%
  const startWidth = 80; // Start at 80% width
  const endWidth = 100;   // End at 100% width
  const widthProgress = Math.min(effectiveScroll / 800, 1); // Expands over 800px of scroll
  const currentWidth = startWidth + (endWidth - startWidth) * widthProgress;
  
  // Border radius: starts at 20px, goes to 0px (square corners)
  const startRadius = 20;
  const endRadius = 0;
  const currentRadius = startRadius - (startRadius - endRadius) * widthProgress;
  
  heroImage.style.transform = `scale(${scale})`;
  heroImage.style.width = `${currentWidth}%`;
  heroImage.style.borderRadius = `${currentRadius}px`;

  // 7. SHOW FIRST POINT CONTENT (removed - now handled in step 2)
  // The "Your Next Step" title emergence is now controlled above

  ticking = false;
}

// FIX: Use passive listener - doesn't block scroll
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(smoothParallax);
      ticking = true;
    }
  },
  { passive: true } // CRITICAL: Passive listener doesn't block scroll
);

// Resize recalculates (also passive)
window.addEventListener("resize", () => {
  requestAnimationFrame(smoothParallax);
}, { passive: true });

// Initial call with safety check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', smoothParallax);
} else {
  smoothParallax();
}

// Newsletter form handler
function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    alert(`Thank you for subscribing with ${email}!`);
    event.target.reset();
}

// Make function globally available
window.handleNewsletter = handleNewsletter;

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav ul');
    const hamburger = document.createElement('button');
    hamburger.className = 'mobile-menu-toggle';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    
    const navdiv = document.querySelector('.navdiv');
    if (navdiv && nav) {
        navdiv.insertBefore(hamburger, nav);
        
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('mobile-open');
            this.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('mobile-open') && 
                !nav.contains(e.target) && 
                !hamburger.contains(e.target)) {
                nav.classList.remove('mobile-open');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking a nav link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('mobile-open');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
});

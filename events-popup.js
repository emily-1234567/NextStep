// ===================================
// EVENT POPUP COMPONENT
// ===================================
// Reusable modal popup that displays detailed event information
// Works on both events page and map page
// Provides registration and sharing functionality

// Immediately Invoked Function Expression (IIFE) to avoid polluting global scope
// Only the functions we explicitly expose via window object will be globally available
(function() {
    'use strict'; // Enable strict mode for better error catching and performance

    // ===================================
    // STYLE INJECTION
    // ===================================
    
    /**
     * Inject popup CSS styles into the document head
     * Only injects once (checks for existing styles to prevent duplicates)
     * This approach allows the popup to be self-contained with its own styles
     */
    function injectPopupStyles() {
        // Check if styles already exist to prevent duplicate injection
        if (document.getElementById('event-popup-styles')) return;
        
        // Create a new style element
        const style = document.createElement('style');
        style.id = 'event-popup-styles'; // ID for duplicate checking
        
        // All CSS styles for the popup component
        style.textContent = `
            /* ===== EVENT POPUP OVERLAY ===== */
            /* Full-screen dark overlay that appears behind the popup */
            .event-popup-overlay {
                position: fixed; /* Stay fixed during scroll */
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7); /* Semi-transparent black */
                backdrop-filter: blur(5px); /* Blur the background content */
                z-index: 10000; /* Ensure popup appears above everything */
                display: flex;
                align-items: center; /* Center popup vertically */
                justify-content: center; /* Center popup horizontally */
                padding: 20px; /* Spacing from edges */
                opacity: 0; /* Start invisible for animation */
                animation: fadeIn 0.3s ease forwards; /* Fade in animation */
            }

            /* Fade-in animation for overlay */
            @keyframes fadeIn {
                to { opacity: 1; } /* End fully visible */
            }

            /* ===== POPUP CONTAINER ===== */
            /* The main white card containing all popup content */
            .event-popup {
                background: white;
                border-radius: 20px; /* Rounded corners */
                max-width: 700px; /* Maximum width on large screens */
                width: 100%; /* Full width up to max-width */
                max-height: 90vh; /* Maximum 90% of viewport height */
                overflow-y: auto; /* Scroll if content exceeds max height */
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); /* Dramatic shadow */
                transform: scale(0.9); /* Start slightly smaller */
                animation: popIn 0.3s ease forwards; /* Pop-in animation */
            }

            /* Pop-in animation for the popup card */
            @keyframes popIn {
                to {
                    transform: scale(1); /* End at normal size */
                }
            }

            /* ===== POPUP HEADER ===== */
            /* Colored header section (matches event card styling) */
            .event-popup-header {
                padding: 30px;
                color: white;
                position: relative;
                overflow: hidden; /* Contain the gradient overlay */
            }

            /* Gradient overlay effect (same as event cards for consistency) */
            .event-popup-header::before {
                content: ''; /* Required for pseudo-element */
                position: absolute;
                inset: 0; /* Cover entire header */
                background: inherit; /* Inherit category color */
                opacity: 0.9; /* Slightly transparent */
            }

            /* Ensure header content appears above the gradient overlay */
            .event-popup-header > * {
                position: relative;
                z-index: 1; /* Stack above overlay */
            }

            /* Category pill badge in header */
            .event-popup-category {
                display: inline-block;
                padding: 0.3rem 0.8rem;
                background: rgba(255, 255, 255, 0.25); /* Semi-transparent white */
                backdrop-filter: blur(10px); /* Frosted glass effect */
                border-radius: 20px; /* Pill shape */
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase; /* ALL CAPS */
                letter-spacing: 0.5px; /* Slight spacing between letters */
                margin-bottom: 0.8rem;
            }
            
            /* Close button (X) in top-right corner */
            .event-popup-close {
                position: absolute; 
                top: 20px; 
                right: 20px; 
                background: #f1f5f9; /* Light gray background */
                border: none; 
                width: 40px; 
                height: 40px; 
                border-radius: 50%; /* Perfect circle */
                cursor: pointer;
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 24px; 
                color: #64748b; /* Gray text */
                transition: all 0.3s ease; 
            } 
            
            /* Close button hover effect */
            /* Changes to red and rotates when hovering */
            .event-popup-close:hover { 
                background: #ef4444; /* Red background */
                color: white; 
                transform: rotate(90deg); /* Rotate X to create visual interest */
            }

            /* Event title in header */
            .event-popup-title {
                font-size: 28px;
                font-weight: 800; /* Extra bold */
                line-height: 1.3; /* Comfortable line spacing */
                margin-bottom: 10px;
            }

            /* Organizer name in header */
            .event-popup-organizer {
                font-size: 14px;
                font-weight: 600;
                opacity: 0.95; /* Slightly transparent */
            }

            /* Duplicate title styling (can be removed - redundant) */
            .event-popup-title {
                font-size: 28px;
                font-weight: 800;
                margin-bottom: 10px;
                line-height: 1.3;
            }

            /* Duplicate organizer styling (can be removed - redundant) */
            .event-popup-organizer {
                font-size: 14px;
                font-weight: 600;
                opacity: 0.95;
            }

            /* ===== POPUP BODY ===== */
            /* Main content area containing event details */
            .event-popup-body {
                padding: 30px;
            }

            /* Individual content section within body */
            .event-popup-section {
                margin-bottom: 25px; /* Space between sections */
            }

            /* Remove bottom margin from last section */
            .event-popup-section:last-child {
                margin-bottom: 0;
            }

            /* Section label (e.g., "About This Event", "Requirements") */
            .event-popup-label {
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase; /* ALL CAPS */
                letter-spacing: 0.5px; /* Slight letter spacing */
                color: #64748b; /* Muted gray */
                margin-bottom: 8px;
            }

            /* Section content value */
            .event-popup-value {
                font-size: 16px;
                color: rgb(1, 9, 67); /* Dark blue text */
                line-height: 1.6; /* Comfortable reading height */
            }

            /* Icons within sections */
            .event-popup-icon {
                margin-right: 8px;
                color: #2563eb; /* Brand blue */
            }

            /* ===== INFO GRID ===== */
            /* Grid layout for date/time/location cards */
            .event-popup-info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive columns */
                gap: 20px; /* Space between grid items */
                margin-bottom: 25px;
            }

            /* Individual info card in the grid */
            .event-popup-info-card {
                background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); /* Subtle gradient */
                padding: 15px;
                border-radius: 12px;
                border: 2px solid #e0e7ff; /* Subtle border */
            }

            /* ===== TAGS ===== */
            /* Container for event topic tags */
            .event-popup-tags {
                display: flex;
                flex-wrap: wrap; /* Wrap tags to multiple lines if needed */
                gap: 8px; /* Space between tags */
            }

            /* Individual tag pill */
            .event-popup-tag {
                background: #eff6ff; /* Light blue background */
                color: #2563eb; /* Blue text */
                padding: 6px 14px;
                border-radius: 15px; /* Pill shape */
                font-size: 13px;
                font-weight: 600;
            }

            /* ===== CAPACITY PROGRESS BAR ===== */
            /* Section showing registration progress */
            .event-popup-capacity {
                margin-top: 15px;
            }

            /* Background bar for capacity indicator */
            .capacity-bar {
                background: #e0e7ff; /* Light blue background */
                height: 8px;
                border-radius: 4px;
                overflow: hidden; /* Clip the fill bar */
                margin-top: 8px;
            }

            /* Filled portion of capacity bar */
            .capacity-fill {
                background: linear-gradient(135deg, #2563eb, #3b82f6); /* Blue gradient */
                height: 100%;
                border-radius: 4px;
                transition: width 0.5s ease; /* Smooth width animation */
            }

            /* Text showing capacity numbers */
            .capacity-text {
                font-size: 14px;
                color: #64748b; /* Muted gray */
                margin-top: 5px;
            }

            /* ===== ACTION BUTTONS ===== */
            /* Container for Register and Share buttons */
            .event-popup-actions {
                display: flex;
                gap: 12px; /* Space between buttons */
                margin-top: 30px;
                padding-top: 25px;
                border-top: 2px solid #e0e7ff; /* Divider line above buttons */
            }

            /* Base button styling */
            .event-popup-btn {
                flex: 1; /* Equal width buttons */
                padding: 14px 24px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease; /* Smooth hover effects */
                border: none;
                display: flex;
                align-items: center; /* Center content vertically */
                justify-content: center; /* Center content horizontally */
                gap: 8px; /* Space between icon and text */
            }

            /* Primary button (Register) - blue gradient */
            .btn-primary {
                background: linear-gradient(135deg, #2563eb, #3b82f6);
                color: white;
            }

            /* Primary button hover effect */
            .btn-primary:hover {
                transform: translateY(-2px); /* Lift up slightly */
                box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4); /* Blue glow */
            }

            /* Secondary button (Share) - outlined style */
            .btn-secondary {
                background: white;
                color: #2563eb; /* Blue text */
                border: 2px solid #2563eb; /* Blue border */
            }

            /* Secondary button hover effect */
            .btn-secondary:hover {
                background: #eff6ff; /* Light blue background */
            }

            /* ===== MOBILE RESPONSIVE ===== */
            /* Optimizations for mobile devices */
            @media (max-width: 768px) {
                /* Make popup taller on mobile */
                .event-popup {
                    max-height: 95vh; /* Use more screen height */
                    margin: 10px; /* Smaller margin */
                }

                /* Reduce padding on mobile */
                .event-popup-header,
                .event-popup-body {
                    padding: 20px;
                }

                /* Smaller title text on mobile */
                .event-popup-title {
                    font-size: 22px;
                }

                /* Stack info grid vertically on mobile */
                .event-popup-info-grid {
                    grid-template-columns: 1fr; /* Single column */
                }

                /* Stack action buttons vertically on mobile */
                .event-popup-actions {
                    flex-direction: column;
                }
                
                /* Mobile button styling (appears to be redundant/duplicate) */
                .event-popup-button {
                    width: 100%;
                    padding: 10px 16px;
                    background: linear-gradient(135deg, #2563eb, #3b82f6);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    font-family: 'Open Sans', sans-serif;
                }

                /* Mobile button hover effect */
                .event-popup-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(37,99,235,0.4);
                }
        }
        `;
        
        // Add the style element to the document head
        document.head.appendChild(style);
    }

    // ===================================
    // HTML GENERATION
    // ===================================
    
    /**
     * Generate the complete HTML structure for the event popup
     * @param {Object} event - Event data object from eventsData array
     * @returns {string} Complete HTML string for the popup
     */
    function createPopupHTML(event) {
        // Calculate registration capacity percentage
        const capacityPercent = Math.round((event.registered / event.capacity) * 100);
        
        // Return complete popup HTML structure
        return `
            <div class="event-popup-overlay" onclick="if(event.target === this) closeEventPopup()">
                <div class="event-popup">
                    <!-- HEADER SECTION -->
                    <!-- Colored header with category, title, and organizer -->
                    <div class="event-popup-header ${event.category}">
                        <!-- Close button (X) -->
                        <button class="event-popup-close" onclick="closeEventPopup()" aria-label="Close">×</button>
                        
                        <!-- Category badge -->
                        <div class="event-popup-category category-${event.category}">${event.category}</div>
                        
                        <!-- Event title -->
                        <h2 class="event-popup-title">${event.title}</h2>
                        
                        <!-- Organizer name -->
                        <div class="event-popup-organizer">Organized by ${event.organizer}</div>
                    </div>

                    <!-- BODY SECTION -->
                    <div class="event-popup-body">
                        <!-- Date/Time/Location Grid -->
                        <!-- Two-column grid showing essential event info -->
                    <div class="event-popup-info-grid">
                        <!-- Date and Time card -->
                        <div class="event-popup-info-card">
                            <div class="event-popup-label"><i class="fa-regular fa-calendar"></i> Date & Time</div>
                            <div class="event-popup-value">${event.date}<br>${event.time}</div>
                        </div>
                        
                        <!-- Location card -->
                        <div class="event-popup-info-card">
                            <div class="event-popup-label"><i class="fa-solid fa-location-arrow"></i> Location</div>
                            <div class="event-popup-value">${event.location}<br><small style="color: #64748b;">${event.address}</small></div>
                        </div>
                    </div>

                    <!-- Full event description -->
                    <div class="event-popup-section">
                        <div class="event-popup-label">About This Event</div>
                        <div class="event-popup-value">${event.fullDescription}</div>
                    </div>

                    <!-- Event topic tags -->
                    <div class="event-popup-section">
                        <div class="event-popup-label">Topics</div>
                        <div class="event-popup-tags">
                            ${event.tags.map(tag => `<span class="event-popup-tag">${tag}</span>`).join('')}
                        </div>
                    </div>

                    <!-- Requirements section -->
                    <div class="event-popup-section">
                        <div class="event-popup-label">Requirements</div>
                        <div class="event-popup-value"><i class="fa-solid fa-clipboard-check"></i> ${event.requirements}</div>
                    </div>

                    <!-- Accessibility information -->
                    <div class="event-popup-section">
                        <div class="event-popup-label">Accessibility</div>
                        <div class="event-popup-value"><i class="fa-brands fa-accessible-icon"></i> ${event.accessibility}</div>
                    </div>

                    <!-- Parking information -->
                    <div class="event-popup-section">
                        <div class="event-popup-label">Parking</div>
                        <div class="event-popup-value"><i class="fa-solid fa-square-parking"></i> ${event.parking}</div>
                    </div>

                    <!-- Registration capacity progress bar -->
                    <div class="event-popup-section event-popup-capacity">
                        <div class="event-popup-label">Registration Status</div>
                        <!-- Visual progress bar -->
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: ${capacityPercent}%"></div>
                        </div>
                        <!-- Capacity text (e.g., "87 of 200 spots filled") -->
                        <div class="capacity-text">${event.registered} of ${event.capacity} spots filled (${capacityPercent}%)</div>
                    </div>

                    <!-- Contact information -->
                    <div class="event-popup-section">
                        <div class="event-popup-label">Contact Information</div>
                        <div class="event-popup-value">
                            <i class="fa-solid fa-envelope"></i> <a href="mailto:${event.contact}" style="color: #2563eb; text-decoration: none;">${event.contact}</a><br>
                            <i class="fa-solid fa-phone-volume"></i> ${event.phone}
                        </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="event-popup-actions">
                        <!-- Register button -->
                        <button class="event-popup-btn btn-primary" onclick="registerForEvent('${event.id}')">
                            ✓ Register for Event
                        </button>
                        <!-- Share button -->
                        <button class="event-popup-btn btn-secondary" onclick="shareEvent('${event.id}')">
                            🔗 Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

    // ===================================
    // POPUP CONTROL FUNCTIONS
    // ===================================

    /**
     * Open the event popup with event details
     * Made globally available via window object
     * @param {string} eventId - The unique ID of the event to display
     */
    window.openEventPopup = function(eventId) {
        console.log('Opening popup for event:', eventId);
        
        // CRITICAL FIX: Close any open Leaflet map popups BEFORE opening event popup
        // This prevents conflicts between map markers and the detail popup
        if (typeof map !== 'undefined' && map.closePopup) {
            map.closePopup();
        }
        
        // Verify that event data is loaded
        if (!window.eventsData) {
            console.error('eventsData not loaded! Make sure events-data.js loads before event-popup.js');
            alert('Error: Event data not loaded. Please refresh the page.');
            return;
        }
        
        // Find the event in the data array
        const event = window.eventsData.find(e => e.id === eventId);
        if (!event) {
            console.error('Event not found:', eventId);
            alert('Error: Event not found with ID: ' + eventId);
            return;
        }

        console.log('Found event:', event.title);

        // Inject CSS styles if not already present
        injectPopupStyles();

        // Remove any existing popup to prevent duplicates
        const existing = document.getElementById('event-popup-container');
        if (existing) existing.remove();

        // Create a container element for the popup
        const container = document.createElement('div');
        container.id = 'event-popup-container';
        
        // Set the HTML content using the template function
        container.innerHTML = createPopupHTML(event);
        
        // Add popup to the page
        document.body.appendChild(container);

        console.log('Popup appended to body');

        // Prevent scrolling of the page behind the popup
        document.body.style.overflow = 'hidden';

        // Add keyboard listener for ESC key to close popup
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                window.closeEventPopup();
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Mark that escape handler is attached (for cleanup tracking)
        container.dataset.escapeHandler = 'attached';
    };

    /**
     * Close the event popup
     * Made globally available via window object
     * Includes fade-out animation before removal
     */
    window.closeEventPopup = function() {
        const container = document.getElementById('event-popup-container');
        if (!container) return; // Exit if no popup exists

        // Get the overlay element for animation
        const overlay = container.querySelector('.event-popup-overlay');
        if (overlay) {
            // Apply fade-out animation
            overlay.style.animation = 'fadeOut 0.3s ease forwards';
            
            // Remove popup after animation completes
            setTimeout(() => {
                container.remove();
                document.body.style.overflow = ''; // Re-enable page scrolling
            }, 300); // Match animation duration
        } else {
            // If no overlay found, remove immediately
            container.remove();
            document.body.style.overflow = ''; // Re-enable page scrolling
        }

        // Remove escape key listener (cleanup)
        document.removeEventListener('keydown', window.closeEventPopup);
    };

    // ===================================
    // ACTION FUNCTIONS
    // ===================================

    /**
     * Handle event registration
     * Made globally available via window object
     * @param {string} eventId - ID of the event to register for
     */
    window.registerForEvent = function(eventId) {
        // Find the event data
        const event = window.eventsData.find(e => e.id === eventId);
        if (!event) return;

        // TODO: In a real application, this would make an API call to register the user
        // For now, show a confirmation alert
        alert(`You're registered for "${event.title}"!\n\nConfirmation email sent to your registered email address.\n\nEvent Details:\n ${event.date} at ${event.time}\n ${event.location}`);
        
        // Close popup after registration (optional behavior)
        window.closeEventPopup();
    };

    /**
     * Share event using Web Share API or clipboard
     * Made globally available via window object
     * @param {string} eventId - ID of the event to share
     */
    window.shareEvent = function(eventId) {
        // Find the event data
        const event = window.eventsData.find(e => e.id === eventId);
        if (!event) return;

        // Try to use native Web Share API if available (mobile devices)
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: `Join me at ${event.title} on ${event.date}!`,
                url: window.location.href + '#event-' + eventId // Create shareable link
            }).catch(err => console.log('Share cancelled')); // User cancelled share
        } else {
            // Fallback for browsers without Web Share API: copy link to clipboard
            const url = window.location.href.split('#')[0] + '#event-' + eventId;
            navigator.clipboard.writeText(url).then(() => {
                alert('🔗 Event link copied to clipboard!\n\nShare it with friends and family.');
            }).catch(() => {
                // Clipboard API failed, show URL in alert
                alert('Event link:\n' + url);
            });
        }
    };

    // ===================================
    // ANIMATION STYLES
    // ===================================
    
    // Add fade-out animation for closing popup
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            to { opacity: 0; } /* Fade to invisible */
        }
    `;
    document.head.appendChild(fadeOutStyle);

    // ===================================
    // INITIALIZATION & TESTING
    // ===================================
    
    // Log that the component has loaded successfully
    console.log('✅ Event popup component loaded and ready');
    console.log('Functions available:', {
        openEventPopup: typeof window.openEventPopup,
        closeEventPopup: typeof window.closeEventPopup,
        registerForEvent: typeof window.registerForEvent,
        shareEvent: typeof window.shareEvent
    });

    /**
     * Test function for developers
     * Call this in browser console: testEventPopup()
     * Opens popup with first event in the data array
     */
    window.testEventPopup = function() {
        // Check if event data exists
        if (!window.eventsData || window.eventsData.length === 0) {
            console.error('❌ No event data found!');
            return;
        }
        // Open popup with first event
        console.log('✅ Testing with first event:', window.eventsData[0].id);
        window.openEventPopup(window.eventsData[0].id);
    };

})(); // End of IIFE - execute immediately
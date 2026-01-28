// User progress data - tracks actual user activity
let userProgress = {
    eventsAttended: 0,
    volunteeredHours: 0,
    townHallSpeeches: 0,
    environmentalEvents: 0,
    youthEvents: 0,
    innovationSummits: 0,
    earlyRegistrations: 0,
    consecutiveMonths: 0,
    friendsInvited: 0,
    isFoundingMember: false,
    eventsCreated: 0,
    electionsVoted: 0,
    serviceProjects: 0,
    networkConnections: 0,
    sustainabilityInitiatives: 0
};

// Load user progress from storage or initialize
function loadUserProgress() {
    const saved = localStorage.getItem('userProgress');
    if (saved) {
        userProgress = JSON.parse(saved);
    }
}

// Save user progress to storage
function saveUserProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

// Badge definitions - Array of all available badges in the system
const badges = [
    {
        id: 1,
        name: "First Step",
        description: "Attended your first civic event",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/599/599224.png" alt="First Step">',
        category: "milestone",
        progressKey: "eventsAttended",
        required: 1
    },
    {
        id: 2,
        name: "Active Citizen",
        description: "Attended 5 civic events",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/956/956100.png" alt="Active Citizen">',
        category: "participation",
        progressKey: "eventsAttended",
        required: 5
    },
    {
        id: 3,
        name: "Community Champion",
        description: "Attended 10 civic events",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/2827/2827957.png" alt="Community Champion">',
        category: "participation",
        progressKey: "eventsAttended",
        required: 10
    },
    {
        id: 4,
        name: "Civic Hero",
        description: "Attended 25 civic events",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/4766/4766834.png" alt="Civic Hero">',
        category: "participation",
        progressKey: "eventsAttended",
        required: 25
    },
    {
        id: 5,
        name: "Volunteer",
        description: "Volunteered at your first event",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/10729/10729191.png" alt="Volunteer">',
        category: "participation",
        progressKey: "volunteeredHours",
        required: 1
    },
    {
        id: 6,
        name: "Helping Hand",
        description: "Volunteered 10 hours",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/10845/10845170.png" alt="Helping Hand">',
        category: "impact",
        progressKey: "volunteeredHours",
        required: 10
    },
    {
        id: 7,
        name: "Time Champion",
        description: "Volunteered 50 hours",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/14118/14118953.png" alt="Time Champion">',
        category: "impact",
        progressKey: "volunteeredHours",
        required: 50
    },
    {
        id: 8,
        name: "Voice of Change",
        description: "Spoke at a town hall meeting",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/2168/2168463.png" alt="Voice of Change">',
        category: "leadership",
        progressKey: "townHallSpeeches",
        required: 1
    },
    {
        id: 9,
        name: "Earth Guardian",
        description: "Participated in 3 environmental events",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/8635/8635653.png" alt="Earth Guardian">',
        category: "impact",
        progressKey: "environmentalEvents",
        required: 3
    },
    {
        id: 10,
        name: "Youth Leader",
        description: "Attended 5 youth-focused events",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/1344/1344761.png" alt="Youth Leader">',
        category: "leadership",
        progressKey: "youthEvents",
        required: 5
    },
    {
        id: 11,
        name: "Tech Innovator",
        description: "Attended 3 innovation summits",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/11995/11995575.png" alt="Tech Innovator">',
        category: "participation",
        progressKey: "innovationSummits",
        required: 3
    },
    {
        id: 12,
        name: "Early Bird",
        description: "Registered for an event 1 month in advance",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/1230/1230870.png" alt="Early Bird">',
        category: "milestone",
        progressKey: "earlyRegistrations",
        required: 1
    },
    {
        id: 13,
        name: "Streak Master",
        description: "Attended events for 3 consecutive months",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/14261/14261136.png" alt="Streak Master">',
        category: "milestone",
        progressKey: "consecutiveMonths",
        required: 3
    },
    {
        id: 14,
        name: "Social Butterfly",
        description: "Invited 5 friends to events",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/338/338337.png" alt="Social Butterfly">',
        category: "leadership",
        progressKey: "friendsInvited",
        required: 5
    },
    {
        id: 15,
        name: "Founding Member",
        description: "One of the first 100 users",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/616/616490.png" alt="Founding Member">',
        category: "milestone",
        progressKey: "isFoundingMember",
        required: 1
    },
    {
        id: 16,
        name: "Community Builder",
        description: "Created or organized a local event",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/3079/3079652.png" alt="Community Builder">',
        category: "leadership",
        progressKey: "eventsCreated",
        required: 1
    },
    {
        id: 17,
        name: "Democracy Champion",
        description: "Voted in 3 local elections",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/3553/3553691.png" alt="Democracy Champion">',
        category: "participation",
        progressKey: "electionsVoted",
        required: 3
    },
    {
        id: 18,
        name: "Neighborhood Hero",
        description: "Completed 5 community service projects",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/2917/2917995.png" alt="Neighborhood Hero">',
        category: "impact",
        progressKey: "serviceProjects",
        required: 5
    },
    {
        id: 19,
        name: "Super Connector",
        description: "Networked with 25 community members",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/681/681494.png" alt="Super Connector">',
        category: "leadership",
        progressKey: "networkConnections",
        required: 25
    },
    {
        id: 20,
        name: "Sustainability Star",
        description: "Participated in 10 environmental initiatives",
        icon: '<img src="https://cdn-icons-png.flaticon.com/128/2990/2990970.png" alt="Sustainability Star">',
        category: "impact",
        progressKey: "sustainabilityInitiatives",
        required: 10
    }
];

// Check if a badge is earned based on user progress
function isBadgeEarned(badge) {
    const progress = getBadgeProgress(badge);
    return progress >= badge.required;
}

// Get current progress for a badge
function getBadgeProgress(badge) {
    if (badge.progressKey === 'isFoundingMember') {
        return userProgress.isFoundingMember ? 1 : 0;
    }
    return userProgress[badge.progressKey] || 0;
}

// Store current filter selection (default is 'all')
let currentFilter = 'all';

/**
 * Render badges with optional filter
 * @param {string} filter - Filter type: 'all', 'earned', 'locked', or category name
 */
function renderBadges(filter = 'all') {
    // Get the badges grid container element
    const grid = document.getElementById('badges-grid');
    if (!grid) return; // Exit if element doesn't exist
    
    // Clear existing badges from the grid
    grid.innerHTML = '';

    // Start with all badges
    let filteredBadges = badges;

    // Apply filters based on filter parameter
    if (filter === 'earned') {
        // Show only earned badges
        filteredBadges = badges.filter(b => isBadgeEarned(b));
    } else if (filter === 'locked') {
        // Show only locked (not earned) badges
        filteredBadges = badges.filter(b => !isBadgeEarned(b));
    } else if (filter !== 'all') {
        // Show badges from specific category
        filteredBadges = badges.filter(b => b.category === filter);
    }

    // Create and append badge cards for each filtered badge
    filteredBadges.forEach((badge, index) => {
        const progress = getBadgeProgress(badge);
        const earned = isBadgeEarned(badge);
        // Calculate progress percentage (max 100%)
        const progressPercent = Math.min((progress / badge.required) * 100, 100);
    
        // Create badge card div element
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${earned ? 'earned' : 'locked'}`; // Add earned/locked class
        badgeCard.setAttribute('data-category', badge.category); // Store category for filtering
        badgeCard.setAttribute('data-status', earned ? 'earned' : 'locked'); // Store status
        
        // Add staggered animation delay for cascading effect
        badgeCard.style.animationDelay = `${index * 0.05}s`;
        
        // Build the badge card HTML content
        badgeCard.innerHTML = `
            ${earned 
                ? '<div class="earned-badge">✓ Earned</div>' // Show earned badge
                : '<div class="locked-badge"><i class="fa-solid fa-lock"></i> Lock</div>' // Show locked badge
            }
            <div class="badge-category category-${badge.category}">
                ${badge.category}
            </div>
            <div class="badge-icon">
                ${badge.icon}
            </div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-description">${badge.description}</div>
            <div class="badge-progress">
                <div class="progress-bar-container">
                    <div 
                        class="progress-bar ${earned ? 'completed' : ''}" 
                        style="width: ${progressPercent}%">
                    </div>
                </div>
                <div class="progress-text">
                    ${progress} / ${badge.required}
                </div>
            </div>
        `;
        
        // Add the badge card to the grid
        grid.appendChild(badgeCard);
    });

    // Update statistics display
    updateStats();
}

/**
 * Update statistics display (earned count, total, percentage)
 */
function updateStats() {
    // Calculate earned badges count
    const earnedCount = badges.filter(b => isBadgeEarned(b)).length;
    // Get total badges count 
    const totalCount = badges.length;
    // Calculate completion percentage
    const completionPercent = Math.round((earnedCount / totalCount) * 100);

    // Get stat display elements
    const earnedEl = document.getElementById('earned-count');
    const totalEl = document.getElementById('total-count');
    const percentEl = document.getElementById('completion-percent');

    // Update the displayed values
    if (earnedEl) earnedEl.textContent = earnedCount;
    if (totalEl) totalEl.textContent = totalCount;
    if (percentEl) percentEl.textContent = completionPercent + '%';
}

/**
 * Update user progress and check for newly earned badges
 * @param {string} progressKey - The key in userProgress to update
 * @param {number} amount - Amount to add to progress
 */
function updateProgress(progressKey, amount = 1) {
    console.log(`updateProgress called: ${progressKey} +${amount}`);
    console.log('Current userProgress before update:', {...userProgress});
    
    const oldProgress = {...userProgress};
    
    if (progressKey === 'isFoundingMember') {
        userProgress[progressKey] = true;
    } else {
        userProgress[progressKey] = (userProgress[progressKey] || 0) + amount;
    }
    
    console.log('Current userProgress after update:', {...userProgress});
    
    saveUserProgress();
    console.log('Progress saved to localStorage');
    
    // Check for newly earned badges
    const newlyEarned = [];
    badges.forEach(badge => {
        if (badge.progressKey === progressKey) {
            const wasEarned = (progressKey === 'isFoundingMember' ? oldProgress[progressKey] : (oldProgress[progressKey] || 0) >= badge.required);
            const isNowEarned = isBadgeEarned(badge);
            
            console.log(`Badge "${badge.name}": wasEarned=${wasEarned}, isNowEarned=${isNowEarned}`);
            
            if (!wasEarned && isNowEarned) {
                newlyEarned.push(badge);
            }
        }
    });
    
    console.log('Newly earned badges:', newlyEarned.map(b => b.name));
    
    // Show notifications for newly earned badges
    newlyEarned.forEach(badge => {
        showBadgeNotification(badge);
    });
    
    // Re-render badges if on badges page
    if (document.getElementById('badges-grid')) {
        console.log('Re-rendering badges page');
        renderBadges(currentFilter);
    }
}

/**
 * Show notification when a badge is earned
 * @param {object} badge - The badge that was earned
 */
function showBadgeNotification(badge) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.5s ease;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">🎉 Badge Earned!</div>
        <div style="font-size: 1rem;">${badge.name}</div>
        <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 0.3rem;">${badge.description}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

/**
 * Filter badges by category or status
 * @param {string} filter - Filter type to apply
 */
function filterBadges(filter) {
    // Store current filter selection
    currentFilter = filter;
    
    // Remove active class from all filter buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate the clicked button
    const clickedButton = Array.from(buttons).find(btn => {
        // Get button text without spaces
        const btnText = btn.textContent.toLowerCase().replace(/\s+/g, '');
        // Get filter text without spaces
        const filterText = filter.toLowerCase().replace(/\s+/g, '');
        // Check if button text matches filter or onclick attribute contains filter
        return btnText === filterText || btn.getAttribute('onclick')?.includes(filter);
    });
    
    // Add active class to clicked button
    if (clickedButton) {
        clickedButton.classList.add('active');
    } else if (window.event && window.event.target) {
        // Fallback: add active to event target
        window.event.target.classList.add('active');
    }
    
    // Re-render badges with the selected filter
    renderBadges(filter);
}

/**
 * Handle newsletter form submission
 * @param {Event} event - Form submit event
 */
function handleNewsletter(event) {
    event.preventDefault(); // Prevent default form submission
    const input = event.target.querySelector('.newsletter-input'); // Get email input
    const email = input.value; // Get email value
    
    // Show success message to user
    alert(`Thank you for subscribing! We'll send updates to ${email}`);
    input.value = ''; // Clear input field
}

/**
 * Initialize the badges page
 */
function initBadgesPage() {
    // Only run on badges page
    if (!document.getElementById('badges-grid')) return;
    
    // Load saved user progress
    loadUserProgress();
    
    // Log initialization info to console
    console.log('Badges page loaded');
    console.log(`Total badges: ${badges.length}`);
    console.log(`Earned badges: ${badges.filter(b => isBadgeEarned(b)).length}`);
    console.log('User progress:', userProgress);
    
    // Render all badges on page load
    renderBadges();
    
    // Set up event listeners for filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Extract filter value from onclick attribute or button text
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                // Parse the filter value from onclick="filterBadges('value')"
                const match = onclickAttr.match(/filterBadges\('([^']+)'\)/);
                if (match) {
                    filterBadges(match[1]); // Call filterBadges with extracted value
                }
            }
        });
    });
}

// Add CSS animations for notifications (only once)
(function addBadgeStyles() {
    if (document.getElementById('badge-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'badge-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();

// Load user progress immediately when script loads (for all pages)
loadUserProgress();
console.log('badges.js loaded - userProgress initialized:', userProgress);

// Make functions available globally IMMEDIATELY
window.updateProgress = updateProgress;
window.loadUserProgress = loadUserProgress;
console.log('Badge functions exposed to window object');

// Initialize when DOM is ready (only if on badges page)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadgesPage);
} else {
    initBadgesPage();
}

// Export functions for external use if in module environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        badges,
        renderBadges,
        filterBadges,
        updateStats,
        updateProgress,
        loadUserProgress
    };
}
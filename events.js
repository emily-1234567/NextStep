// Events Data (same as map.js)
const eventsData = [
    {
        id: 'event-1',
        title: "Town Hall Meeting",
        date: "November 21, 2025",
        time: "7:00 PM",
        location: "Mizner Park Amphitheater",
        lat: 26.354,
        lng: -80.084,
        category: "political",
        description: "Join us for a community discussion on local governance and make your voice heard.",
        badgeProgress: {
            eventsAttended: 1,
            townHallSpeeches: 0 // Can be 1 if user spoke
        }
    },
    {
        id: 'event-2',
        title: "Youth Leadership Workshop",
        date: "December 5, 2025",
        time: "3:00 PM",
        location: "Boca Raton Community Center",
        lat: 26.3682,
        lng: -80.1036,
        category: "youth",
        description: "Empowering the next generation of civic leaders through interactive workshops.",
        badgeProgress: {
            eventsAttended: 1,
            youthEvents: 1
        }
    },
    {
        id: 'event-3',
        title: "Tech Innovation Summit",
        date: "December 10, 2025",
        time: "9:00 AM",
        location: "FAU Tech Runway",
        lat: 26.3748,
        lng: -80.1027,
        category: "innovation",
        description: "Discover cutting-edge technology solutions for civic challenges and community development.",
        badgeProgress: {
            eventsAttended: 1,
            innovationSummits: 1
        }
    },
    {
        id: 'event-4',
        title: "Beach Clean-Up Day",
        date: "December 15, 2025",
        time: "8:00 AM",
        location: "South Beach Park",
        lat: 26.3421,
        lng: -80.0758,
        category: "environmental",
        description: "Help keep our beaches clean and beautiful. Supplies provided, just bring your enthusiasm!",
        badgeProgress: {
            eventsAttended: 1,
            environmentalEvents: 1,
            volunteeredHours: 2
        }
    },
    {
        id: 'event-5',
        title: "Education Forum",
        date: "December 20, 2025",
        time: "6:30 PM",
        location: "Boca Raton Library",
        lat: 26.3587,
        lng: -80.0831,
        category: "education",
        description: "Discuss the future of education in our community with school board members and educators.",
        badgeProgress: {
            eventsAttended: 1
        }
    },
    {
        id: 'event-6',
        title: "City Council Meeting",
        date: "January 5, 2026",
        time: "7:00 PM",
        location: "City Hall",
        lat: 26.3586,
        lng: -80.0831,
        category: "political",
        description: "Monthly city council meeting open to the public. Voice your concerns and stay informed.",
        badgeProgress: {
            eventsAttended: 1,
            electionsVoted: 0 // Can be 1 if voting related
        }
    },
    {
        id: 'event-7',
        title: "Community Garden Project",
        date: "January 12, 2026",
        time: "9:00 AM",
        location: "Spanish River Park",
        lat: 26.3586,
        lng: -80.0831,
        category: "environmental",
        description: "Help build our community garden and learn sustainable farming practices.",
        badgeProgress: {
            eventsAttended: 1,
            environmentalEvents: 1,
            volunteeredHours: 3,
            serviceProjects: 1
        }
    }
];

// Load completed events from localStorage
function loadCompletedEvents() {
    const completed = localStorage.getItem('completedEvents');
    return completed ? JSON.parse(completed) : [];
}

// Save completed events to localStorage
function saveCompletedEvents(completedEvents) {
    localStorage.setItem('completedEvents', JSON.stringify(completedEvents));
}

// Check if event is completed
function isEventCompleted(eventId) {
    const completedEvents = loadCompletedEvents();
    return completedEvents.includes(eventId);
}

// Load user progress from localStorage (direct implementation - no dependency on badges.js)
function loadUserProgress() {
    const saved = localStorage.getItem('userProgress');
    return saved ? JSON.parse(saved) : {
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
}

// Save user progress to localStorage (direct implementation - no dependency on badges.js)
function saveUserProgress(userProgress) {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

// Mark event as completed and update badge progress
function markEventCompleted(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) {
        console.error('Event not found:', eventId);
        return;
    }
    
    // Check if already completed
    if (isEventCompleted(eventId)) {
        return;
    }
    
    // Add to completed events
    const completedEvents = loadCompletedEvents();
    completedEvents.push(eventId);
    saveCompletedEvents(completedEvents);
    console.log('Event marked as completed:', eventId);
    
    // Load current user progress
    const userProgress = loadUserProgress();
    console.log('Current user progress:', userProgress);
    
    // Update badge progress based on event
    if (event.badgeProgress) {
        console.log('Updating badge progress with:', event.badgeProgress);
        
        // Update each relevant badge progress
        for (const [progressKey, amount] of Object.entries(event.badgeProgress)) {
            if (amount > 0) {
                console.log(`Updating ${progressKey} by ${amount}`);
                if (progressKey === 'isFoundingMember') {
                    userProgress[progressKey] = true;
                } else {
                    userProgress[progressKey] = (userProgress[progressKey] || 0) + amount;
                }
            }
        }
        
        console.log('Updated user progress:', userProgress);
        
        // Save updated progress
        saveUserProgress(userProgress);
        console.log('Progress saved to localStorage');
    }
    
    // Re-render events to update button state
    renderEvents(currentFilter);
}

// Mark event as uncompleted and subtract badge progress
function markEventUncompleted(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) {
        console.error('Event not found:', eventId);
        return;
    }
    
    // Check if event is completed
    if (!isEventCompleted(eventId)) {
        return;
    }
    
    // Remove from completed events
    const completedEvents = loadCompletedEvents();
    const updatedCompleted = completedEvents.filter(id => id !== eventId);
    saveCompletedEvents(updatedCompleted);
    console.log('Event marked as uncompleted:', eventId);
    
    // Load current user progress
    const userProgress = loadUserProgress();
    console.log('Current user progress before subtraction:', userProgress);
    
    // Subtract badge progress based on event
    if (event.badgeProgress) {
        console.log('Subtracting badge progress with:', event.badgeProgress);
        
        // Subtract each relevant badge progress
        for (const [progressKey, amount] of Object.entries(event.badgeProgress)) {
            if (amount > 0) {
                console.log(`Subtracting ${progressKey} by ${amount}`);
                if (progressKey === 'isFoundingMember') {
                    userProgress[progressKey] = false;
                } else {
                    userProgress[progressKey] = Math.max(0, (userProgress[progressKey] || 0) - amount);
                }
            }
        }
        
        console.log('Updated user progress after subtraction:', userProgress);
        
        // Save updated progress
        saveUserProgress(userProgress);
        console.log('Progress saved to localStorage');
    }
    
    // Re-render events to update button state
    renderEvents(currentFilter);
}

// Current filter
let currentFilter = 'all';

// Render Events
function renderEvents(filter = 'all') {
    const eventsGrid = document.getElementById('events-grid');
    
    const filteredEvents = filter === 'all' 
        ? eventsData 
        : eventsData.filter(event => event.category === filter);
    
    eventsGrid.innerHTML = filteredEvents.map(event => {
        const isCompleted = isEventCompleted(event.id);
        
        return `
        <div class="event-card" data-category="${event.category}">
            <div class="event-header ${event.category}">
                <div class="event-category">${event.category}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-date">${event.date}</div>
            </div>
            <div class="event-body">
                <div class="event-time">
                    <span><strong><i class="fa-regular fa-calendar"></i> Time:</strong> ${event.time}</span>
                </div>
                <div class="event-location">
                    <span><strong><i class="fa-solid fa-location-arrow"></i> Location:</strong> ${event.location}</span>
                </div>
                <div class="event-description">${event.description}</div>
                <button 
                    class="complete-event-btn ${isCompleted ? 'completed' : ''}"
                    onclick="${isCompleted ? `markEventUncompleted('${event.id}')` : `markEventCompleted('${event.id}')`}"
                    style="
                        margin-top: 1rem;
                        padding: 0.75rem 1.5rem;
                        background: ${isCompleted ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)'};
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        width: 100%;
                        transition: all 0.3s ease;
                        font-size: 0.95rem;
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px ${isCompleted ? 'rgba(148, 163, 184, 0.4)' : 'rgba(16, 185, 129, 0.4)'}'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >
                    ${isCompleted ? '✓ Completed (Click to Undo)' : 'Mark as Completed'}
                </button>
            </div>
        </div>
    `}).join('');
}

// Filter Logic
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter category
        const category = button.getAttribute('data-category');
        currentFilter = category;
        
        // Render filtered events
        renderEvents(category);
    });
});

// Handle newsletter form submission
function handleNewsletter(event) {
    event.preventDefault();
    const input = event.target.querySelector('.newsletter-input');
    const email = input.value;
    alert(`Thank you for subscribing! We'll send updates to ${email}`);
    input.value = '';
}

// Initial render
renderEvents('all');
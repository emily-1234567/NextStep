// ===================================
// EVENTS DATA - SINGLE SOURCE OF TRUTH
// ===================================
// This file serves as the centralized repository for ALL event information across the entire site
// Any page that displays events (calendar, event list, event details, etc.) should pull from this file
// This ensures consistency and makes updates easier - change once, update everywhere

/**
 * Main events data array
 * Each object represents a single event with complete information
 * All dates should be in "Month Day, Year" format for consistency
 */
const eventsData = [
    {
        // Unique identifier for this event (used for routing, linking, and tracking)
        id: 'event-1',
        
        // Basic event information
        title: "Town Hall Meeting",
        date: "March 2, 2026", // Display date
        time: "7:00 PM", // Display time
        
        // Location details
        location: "Mizner Park Amphitheater", // Venue name
        address: "590 Plaza Real, Boca Raton, FL 33432", // Full street address
        lat: 26.354, // Latitude for map integration
        lng: -80.084, // Longitude for map integration
        
        // Category for filtering and color-coding
        // Options: "political", "youth", "innovation", "environmental", "education"
        category: "political",
        
        // Short description for event cards and previews
        description: "Join us for a community discussion on local governance and make your voice heard.",
        
        // Detailed description shown on event detail pages
        fullDescription: "Join us for an important community discussion on local governance. This town hall meeting provides an opportunity for residents to voice their concerns, ask questions, and engage directly with city officials. Topics include upcoming city initiatives, budget planning, and community development projects. All residents are welcome and encouraged to participate in shaping our community's future.",
        
        // Organizer contact information
        organizer: "Boca Raton City Council", // Organization hosting the event
        contact: "cityhall@myboca.us", // Email contact
        phone: "(561) 393-7700", // Phone contact
        
        // Capacity and registration tracking
        capacity: 200, // Maximum attendees
        registered: 87, // Current number of registrations
        
        // Tags for search and filtering functionality
        tags: ["Government", "Community", "Public Forum"],
        
        // Additional event details
        requirements: "Open to all residents, no registration required", // Prerequisites or restrictions
        accessibility: "Wheelchair accessible, ASL interpretation available upon request", // Accessibility features
        parking: "Free parking available in Mizner Park garages", // Parking information
        
        // Badge progress tracking - determines which badges are affected when user attends this event
        badgeProgress: {
            eventsAttended: 1, // Increments general events attended counter
            townHallSpeeches: 0 // Would increment if user speaks at town hall
        }
    },
    {
        id: 'event-2',
        title: "Youth Leadership Workshop",
        date: "March 6, 2026",
        time: "3:00 PM",
        location: "Boca Raton Community Center",
        address: "150 Crawford Blvd, Boca Raton, FL 33432",
        lat: 26.3682,
        lng: -80.1036,
        category: "youth", // Youth-focused event
        description: "Empowering the next generation of civic leaders through interactive workshops.",
        fullDescription: "This interactive workshop is designed to empower young leaders aged 14-18 with essential civic engagement skills. Participants will learn about community organizing, public speaking, local government processes, and how to turn ideas into action. The workshop includes hands-on activities, guest speakers from local government, and opportunities to connect with peers passionate about making a difference.",
        organizer: "NextStep Youth Initiative",
        contact: "youth@nextstep.org",
        phone: "(561) 555-0123",
        capacity: 50, // Smaller capacity for workshop format
        registered: 32,
        tags: ["Youth", "Leadership", "Education", "Skills Development"],
        requirements: "Ages 14-18, registration required", // Age restriction
        accessibility: "Fully accessible facility, refreshments provided",
        parking: "Free parking in community center lot",
        badgeProgress: {
            eventsAttended: 1,
            youthEvents: 1 // Specifically tracks youth event attendance
        }
    },
    {
        id: 'event-3',
        title: "Tech Innovation Summit",
        date: "March 11, 2026",
        time: "9:00 AM", // Morning start for full-day event
        location: "FAU Tech Runway",
        address: "901 NW 35th St, Boca Raton, FL 33431",
        lat: 26.3748,
        lng: -80.1027,
        category: "innovation", // Technology and innovation category
        description: "Discover cutting-edge technology solutions for civic challenges and community development.",
        fullDescription: "Join us for a full-day summit exploring how technology can address civic challenges. This event brings together tech entrepreneurs, city officials, and community leaders to discuss smart city initiatives, digital civic engagement platforms, and innovative solutions for local problems. Features include keynote speakers, panel discussions, startup demos, and networking opportunities. Continental breakfast and lunch provided.",
        organizer: "FAU Tech Runway & NextStep", // Joint organizers
        contact: "innovation@nextstep.org",
        phone: "(561) 297-3880",
        capacity: 150,
        registered: 98, // High registration - popular event
        tags: ["Technology", "Innovation", "Smart City", "Networking"],
        requirements: "Registration required, professional attire suggested",
        accessibility: "ADA compliant facility, dietary restrictions accommodated",
        parking: "Visitor parking available, $5 daily rate", // Note: paid parking
        badgeProgress: {
            eventsAttended: 1,
            innovationSummits: 1 // Specific badge for innovation events
        }
    },
    {
        id: 'event-4',
        title: "Beach Clean-Up Day",
        date: "March 14, 2026",
        time: "8:00 AM", // Early morning for beach cleanup
        location: "South Beach Park",
        address: "400 N State Road A1A, Boca Raton, FL 33432",
        lat: 26.3421,
        lng: -80.0758,
        category: "environmental", // Environmental/sustainability category
        description: "Help keep our beaches clean and beautiful. Supplies provided, just bring your enthusiasm!",
        fullDescription: "Make a tangible difference in our community by joining our monthly beach cleanup! We'll provide all supplies including gloves, bags, and grabbers. This family-friendly event welcomes volunteers of all ages. Not only will you help protect marine life and keep our beaches pristine, but you'll also meet fellow community members who care about the environment. Volunteers who stay for the full 2 hours will receive a NextStep reusable water bottle!",
        organizer: "Boca Environmental Alliance",
        contact: "cleanbeach@bocaenv.org",
        phone: "(561) 555-0145",
        capacity: 100,
        registered: 67,
        tags: ["Environment", "Beach", "Volunteer", "Family-Friendly"],
        requirements: "All ages welcome, no experience needed", // No barriers to entry
        accessibility: "Beach access mats available, please notify organizer for assistance",
        parking: "Limited free parking, arrive early or carpool", // Note: limited parking
        badgeProgress: {
            eventsAttended: 1,
            environmentalEvents: 1, // Tracks environmental event participation
            volunteeredHours: 2 // Adds 2 hours to volunteer time tracker
        }
    },
    {
        id: 'event-5',
        title: "Education Forum",
        date: "March 21, 2026",
        time: "6:30 PM",
        location: "Boca Raton Library",
        address: "400 NW 2nd Ave, Boca Raton, FL 33432",
        lat: 26.3587,
        lng: -80.0831,
        category: "education", // Education-focused category
        description: "Discuss the future of education in our community with school board members and educators.",
        fullDescription: "Join school board members, teachers, parents, and students for an important conversation about the future of education in Boca Raton. Topics include curriculum development, technology in classrooms, mental health resources, and preparing students for future careers. This is your opportunity to share feedback, ask questions, and help shape educational policies. Light refreshments will be served.",
        organizer: "Boca Raton School Board",
        contact: "board@bocaschools.com",
        phone: "(561) 434-8000",
        capacity: 120,
        registered: 45, // Lower registration - opportunity to promote
        tags: ["Education", "Schools", "Policy", "Community Input"],
        requirements: "Open to all, students encouraged to attend",
        accessibility: "Fully accessible, childcare available with advance notice", // Note: childcare offered
        parking: "Free parking in library lot",
        badgeProgress: {
            eventsAttended: 1 // Only increments general attendance
        }
    },
    {
        id: 'event-6',
        title: "City Council Meeting",
        date: "March 25, 2026",
        time: "7:00 PM",
        location: "City Hall",
        address: "201 W Palmetto Park Rd, Boca Raton, FL 33432",
        lat: 26.3586,
        lng: -80.0831,
        category: "political", // Government/political category
        description: "Monthly city council meeting open to the public. Voice your concerns and stay informed.",
        fullDescription: "Regular monthly meeting of the Boca Raton City Council. The meeting is open to the public and includes time for citizen comments on agenda items as well as general public input. Review the meeting agenda on the city website 72 hours before the meeting. Citizens wishing to speak must sign up at the beginning of the meeting. Meetings are also livestreamed for those unable to attend in person.",
        organizer: "City of Boca Raton",
        contact: "cityclerk@myboca.us",
        phone: "(561) 393-7740",
        capacity: 150,
        registered: 23, // Low registration typical for council meetings
        tags: ["Government", "City Council", "Public Meeting", "Democracy"],
        requirements: "Open to all residents, sign up required to speak", // Note: sign-up needed for public comment
        accessibility: "Fully accessible, live captioning available",
        parking: "Free parking in city hall garage",
        badgeProgress: {
            eventsAttended: 1,
            electionsVoted: 0 // Tracks voting participation (not incremented by attendance)
        }
    },
    {
        id: 'event-7',
        title: "Community Garden Project",
        date: "March 29, 2026",
        time: "9:00 AM",
        location: "Spanish River Park",
        address: "3001 NW 51st St, Boca Raton, FL 33431",
        lat: 26.3778,
        lng: -80.1234,
        category: "environmental", // Environmental category
        description: "Help build our community garden and learn sustainable farming practices.",
        fullDescription: "Join us for a hands-on community garden building day! We'll be constructing raised beds, installing irrigation, and planting our first crops. Master gardeners will be on hand to teach sustainable farming techniques, composting, and organic pest control. No experience necessary - just bring your enthusiasm and willingness to get your hands dirty! All tools and materials provided. Volunteers will receive seeds to start their own gardens at home.",
        organizer: "Green Boca Initiative",
        contact: "grow@greenboca.org",
        phone: "(561) 555-0178",
        capacity: 40, // Smaller capacity for hands-on work
        registered: 31,
        tags: ["Environment", "Gardening", "Sustainability", "Hands-On"],
        requirements: "Wear closed-toe shoes and clothes that can get dirty", // Safety requirements
        accessibility: "Raised beds designed for wheelchair access",
        parking: "Free parking in park lot",
        badgeProgress: {
            eventsAttended: 1,
            environmentalEvents: 1, // Tracks environmental participation
            volunteeredHours: 3, // Adds 3 hours to volunteer time
            serviceProjects: 1 // Tracks community service projects completed
        }
    }
];

// ===================================
// GLOBAL AVAILABILITY
// ===================================

/**
 * Make events data available globally in browser environment
 * This allows any script on any page to access the data via window.eventsData
 * Example usage: const events = window.eventsData;
 */
if (typeof window !== 'undefined') {
    window.eventsData = eventsData;
}

/**
 * Export for Node.js/CommonJS module systems
 * This allows the data to be imported in server-side JavaScript or build tools
 * Example usage: const eventsData = require('./events-data.js');
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = eventsData;
}
import type { PromptCategory } from "../../types/prompt";

export const lifestylePrompts: PromptCategory[] = [

        {
        id: "books",
        name: "Book & Reading Prompts",
        icon: "📖",
        description: "Free AI prompts for book analysis, summaries, and reading",
        folders: [
            {
                id: "book-summaries",
                name: "Book Summaries",
                icon: "📋",
                prompts: [
                    { id: "fiction-summary", title: "Fiction Book Summary", content: "Summarize [BOOK TITLE] by [AUTHOR]. Include: Plot overview (without major spoilers), Main characters and their arcs, Key themes and messages, Writing style and tone, Personal takeaway, Who should read it. Keep it engaging and spoiler-conscious." },
                    { id: "nonfiction-summary", title: "Non-Fiction Summary", content: "Summarize [NON-FICTION BOOK]. Provide: Main thesis/argument, Key concepts (5-7 points), Supporting evidence and examples, Practical applications, Critical perspective, Actionable takeaways. Make it actionable and easy to reference." }
                ]
            },
            {
                id: "book-analysis",
                name: "Book Analysis",
                icon: "🔍",
                prompts: [
                    { id: "character-analysis", title: "Character Analysis", content: "Analyze [CHARACTER] from [BOOK]. Cover: Physical and personality traits, Motivations and goals, Character development arc, Relationships with other characters, Symbolic significance, Impact on plot, Memorable quotes/actions." },
                    { id: "theme-analysis", title: "Theme Analysis", content: "Analyze the theme of [THEME] in [BOOK]. Discuss: How theme is introduced, Key scenes that develop it, Character connections to theme, Symbols representing theme, Author's message, Relevance to modern readers." }
                ]
            },
            {
                id: "reading-help",
                name: "Reading Help",
                icon: "📚",
                prompts: [
                    { id: "simplify-text", title: "Rewrite in Simpler Language", content: "Rewrite this passage in simpler language: [PASTE TEXT]. Make it: Easier to understand, Shorter sentences, Common vocabulary, Clear and direct, Maintain original meaning, Suitable for [TARGET AUDIENCE]." },
                    { id: "extract-quotes", title: "Extract Key Quotes", content: "Extract 10 most impactful quotes from [BOOK/CHAPTER]. For each: The quote, Page/chapter reference, Context (who said it, when), Why it's significant, How it relates to themes. Prioritize memorability and meaning." }
                ]
            }
        ]
    },
        {
        id: "health",
        name: "Health & Wellness Prompts",
        icon: "🧘",
        description: "Free AI prompts for fitness, nutrition, and wellness",
        folders: [
            {
                id: "fitness",
                name: "Fitness",
                icon: "💪",
                prompts: [
                    { id: "workout-plan", title: "Workout Plan Generator", content: "Create a [DURATION] workout plan for [GOAL]. Include: Weekly schedule, Exercises with sets/reps, Rest days, Progression strategy, Equipment needed (or bodyweight alternatives), Warm-up/cool-down, Nutrition tips, Tracking method." },
                    { id: "home-workout", title: "Home Workout Routine", content: "Design home workout for [FITNESS LEVEL]. No equipment needed. Include: Full body routine, Time per exercise, Modifications for beginners/advanced, Video tutorial suggestions, Schedule (3-5 days/week), Progress tracking." },
                    { id: "muscle-gain", title: "Muscle Gain Plan", content: "Create muscle-building plan for [BODY PART/OVERALL]. Include: Training split, Compound vs isolation exercises, Progressive overload strategy, Rep/set ranges, Rest periods, Nutrition requirements (protein/calories), Supplement recommendations, Timeline expectations." }
                ]
            },
            {
                id: "mental-wellness",
                name: "Mental Wellness",
                icon: "🧠",
                prompts: [
                    { id: "stress-management", title: "Stress Management Plan", content: "Create stress management strategy for [SITUATION]. Include: Identification of stressors, Immediate relief techniques, Long-term coping mechanisms, Breathing exercises, Mindfulness practices, When to seek professional help, Daily routine adjustments." },
                    { id: "journaling-prompts", title: "Journaling Prompts", content: "Provide 30 journaling prompts for [PURPOSE]. Cover: Self-reflection, Gratitude, Goal-setting, Emotional processing, Problem-solving, Creative thinking, Morning/evening prompts, Weekly review questions." },
                    { id: "mindfulness", title: "Mindfulness Exercise", content: "Guide a mindfulness practice for [DURATION/GOAL]. Include: Breathing technique, Body scan method, Awareness exercises, Thought observation, Present moment focus, Integration into daily life, Benefits tracking." }
                ]
            }
        ]
    },
        {
        id: "daily-life",
        name: "Daily Life & Productivity Prompts",
        icon: "🏠",
        description: "Free AI prompts for daily tasks, productivity, and life organization",
        folders: [
            {
                id: "personal-management",
                name: "Personal Management",
                icon: "📅",
                prompts: [
                    { id: "daily-planner", title: "Daily Planner", content: "Create daily schedule for [DATE/ROUTINE]. Include: Time blocks for tasks, Priority levels (urgent/important), Break times, Meal planning, Exercise slot, Personal time, Evening wind-down, Tomorrow prep, Flexibility buffers." },
                    { id: "habit-tracker", title: "Habit Tracker Prompt", content: "Design habit tracking system for [HABITS]. Include: Daily checklist, Weekly review, Streak counter, Trigger identification, Reward system, Obstacle planning, Progress visualization, Adjustment strategy." },
                    { id: "life-audit", title: "Life Audit Prompt", content: "Conduct comprehensive life audit. Evaluate: Career satisfaction, Relationships quality, Health status, Financial situation, Personal growth, Time usage, Values alignment, Areas needing change, Action plan for improvement." }
                ]
            },
            {
                id: "relationships",
                name: "Relationships",
                icon: "❤️",
                prompts: [
                    { id: "conflict-resolution", title: "Conflict Resolution", content: "Address conflict about [ISSUE]. Apply: Active listening techniques, 'I' statements, Finding common ground, Compromise strategies, Apology frameworks, Boundary setting, Follow-up plans, When to involve mediator." },
                    { id: "communication", title: "Communication Improvement", content: "Improve communication with [PERSON/GROUP]. Focus on: Clear expression of needs, Active listening skills, Non-verbal cues, Empathy building, Asking better questions, Giving/receiving feedback, Digital communication etiquette." }
                ]
            }
        ]
    },
        {
        id: "travel",
        name: "Travel & Adventure Prompts",
        icon: "🌍",
        description: "Free AI prompts for travel planning, itineraries, and adventures",
        folders: [
            {
                id: "travel-planning",
                name: "Travel Planning",
                icon: "✈️",
                prompts: [
                    { id: "itinerary", title: "Itinerary Generator", content: "Create [DURATION]-day itinerary for [DESTINATION]. Include: Daily schedule, Must-see attractions, Hidden gems, Restaurant recommendations, Transportation options, Accommodation suggestions, Budget breakdown, Packing list, Local customs to know." },
                    { id: "budget-travel", title: "Budget Travel Plan", content: "Plan budget trip to [DESTINATION] for [BUDGET]. Include: Cheapest travel season, Flight deals, Budget accommodation, Free attractions, Local food spots, Money-saving tips, Cost breakdown, Safety considerations." },
                    { id: "solo-travel", title: "Solo Travel Checklist", content: "Prepare for solo trip to [DESTINATION]. Cover: Safety precautions, Social opportunities, Accommodation choices, Packing essentials, Emergency contacts, Local SIM/internet, Meeting locals, Itinerary flexibility, Journaling/documentation." },
                    { id: "multi-city-trip", title: "Multi-City Trip Planner", content: "Act as a Travel Logistics Expert. Plan a trip visiting [CITIES] in [REGION]. Role: Planner. Task: Optimize route. Format: Itinerary. Constraints: Time [DAYS], transport mode. Goal: Efficient travel. Steps: 1. Logical order of cities. 2. Transport links (flight/train durations). 3. Days suggested in each city. 4. Accommodation locations (near station/airport?). 5. Visa requirements for crossing borders." },
                    { id: "visa-application", title: "Visa Application Guide", content: "Act as a Visa Consultant. Guide for [NATIONALITY] applying for [COUNTRY] visa. Role: Consultant. Task: Application steps. Format: Checklist. Goal: Approval. Steps: 1. Visa type needed. 2. Required documents list. 3. Photo specifications. 4. Appointment booking process. 5. Processing time and fees." },
                    { id: "packing-climate", title: "Packing for [CLIMATE]", content: "Act as a Stylist. Packing list for [DESTINATION] in [MONTH]. Role: Stylist. Task: Wardrobe planning. Format: Checklist. Constraints: Carry-on only. Goal: Functional & Stylish. Steps: 1. Weather expectations. 2. Clothing layers. 3. Footwear. 4. Toiletries (sunscreen/bug spray). 5. Electronics." },
                    { id: "travel-insurance", title: "Travel Insurance Selector", content: "Act as an Insurance Broker. Choose travel insurance for [TRIP TYPE]. Role: Broker. Task: Coverage check. Format: Comparison. Goal: Safety. Steps: 1. Medical coverage limits. 2. Evacuation coverage. 3. Adventure sports inclusions. 4. Tech/Gear theft protection. 5. Cancellation policy." },
                    { id: "vaccination-health", title: "Travel Health & Vaccinations", content: "Act as a Travel Doctor. Health advice for [DESTINATION]. Role: Doctor. Task: Health prep. Format: List. Goal: Stay healthy. Steps: 1. Required vaccinations (Yellow Fever etc). 2. Recommended meds (Malaria). 3. First aid kit essentials. 4. Water safety (drink tap?). 5. Local emergency numbers." },
                    { id: "pet-travel", title: "Traveling with Pets", content: "Act as a Pet Travel Expert. Guide to bringing [PET] to [COUNTRY]. Role: Expert. Task: Logistics. Format: Guide. Goal: Stress-free pet travel. Steps: 1. Airline pet policies. 2. Import requirements (microchip, rabies titer). 3. Pet-friendly accommodation filters. 4. Arrival quarantine rules. 5. Packing for pets." },
                    { id: "disability-access", title: "Accessible Travel Guide", content: "Act as an Accessibility Advocate. Guide to accessible travel in [CITY]. Role: Advisor. Task: Avoid barriers. Format: Guide. Constraints: Wheelchair user. Goal: Barrier-free trip. Steps: 1. Accessible transport options. 2. Verified accessible hotels (roll-in showers). 3. Accessible attractions. 4. Local disability organizations. 5. Pavement/Sidewalk quality." },
                    { id: "group-travel", title: "Group Trip Organizer", content: "Act as a Peacekeeper. Organize a group trip for [NUMBER] people to [DESTINATION]. Role: Organizer. Task: Logistics. Format: Plan. Goal: Everyone happy. Steps: 1. Budget alignment strategy. 2. Polling for dates/accommodation. 3. Apps for splitting bills (Splitwise). 4. Solo time built-in. 5. Decision making rules." }
                ]
            },
            {
                id: "culture",
                name: "Culture & History",
                icon: "🏛️",
                prompts: [
                    { id: "historical-event", title: "Historical Event Explanation", content: "Explain [HISTORICAL EVENT] comprehensively. Include: Context leading up to it, Key figures involved, Timeline of events, Immediate consequences, Long-term impact, Different perspectives, Relevance today, Further reading." },
                    { id: "cultural-comparison", title: "Cultural Comparison", content: "Compare cultures of [COUNTRY A] and [COUNTRY B]. Discuss: Social norms, Communication styles, Family structures, Work attitudes, Food culture, Celebrations/holidays, Values and beliefs, Business etiquette, Common misconceptions." },
                    { id: "architecture-tour", title: "Architecture Tour Guide", content: "Act as an Architect. Guide to architecture of [CITY]. Role: Guide. Task: Walking tour. Format: Map/List. Goal: Appreciate design. Steps: 1. Key styles present (Gothic, Brutalist etc). 2. Iconic buildings to visit. 3. Famous architects involved. 4. Best angles for photography. 5. Interiors open to public." },
                    { id: "art-history", title: "Art History Tour", content: "Act as an Art Historian. Guide to art in [CITY]. Role: Historian. Task: Gallery guide. Format: Itinerary. Goal: See masterpieces. Steps: 1. Must-visit museums. 2. Specific rooms/works to prioritize. 3. Contextual history of the art scene. 4. Contemporary galleries. 5. Street art areas." },
                    { id: "religion-etiquette", title: "Religious Etiquette Guide", content: "Act as a Theologian. Guide to visiting religious sites in [COUNTRY]. Role: Guide. Task: Respectful visiting. Format: Rules list. Goal: Respect. Steps: 1. Dress code (knees/shoulders). 2. Shoe removal rules. 3. Photography rules. 4. Gender separation rules. 5. Offering key/Prayer customs." },
                    { id: "music-history", title: "Music History Journeys", content: "Act as a Musicologist. Trace the history of [GENRE] in [CITY]. Role: Guide. Task: Musical pilgrimage. Format: Itinerary. Goal: Hear the roots. Steps: 1. Birthplace venues/studios. 2. Museums/Halls of Fame. 3. Graves/Statues of icons. 4. Live venues still operating. 5. Record stores with history." },
                    { id: "mythology-folklore", title: "Local Mythology & Folklore", content: "Act as a Storyteller. Tell the legends of [REGION]. Role: Storyteller. Task: Cultural context. Format: Stories. Goal: Enchantment. Steps: 1. Creation myths. 2. Famous cryptids/monsters. 3. Haunted locations to visit. 4. Folk heroes. 5. Festivals celebrating myths." },
                    { id: "politics-history", title: "Political History Deep Dive", content: "Act as a Political Scientist. Explain the political history of [COUNTRY] for travelers. Role: Educator. Task: Summary. Format: Brief. Goal: Context. Steps: 1. Key revolutions/independence. 2. Current system explanation. 3. Sensitive topics to avoid. 4. Major political figures history. 5. Impact on current daily life." },
                    { id: "indigenous-culture", title: "Indigenous Culture Guide", content: "Act as a Cultural Ally. Guide to Indigenous culture in [REGION]. Role: Ally. Task: Respectful engagement. Format: Guide. Goal: Support and learn. Steps: 1. Correct terminology. 2. Cultural centers/tours run by community. 3. Art/Souvenir authenticity. 4. Sacred sites to respect. 5. History of colonization context." },
                    { id: "pop-culture", title: "Pop Culture/Film Locations", content: "Act as a Location Scout. Guide to film locations in [CITY]. Role: Scout. Task: Set jetting. Format: Map. Goal: Recreate scenes. Steps: 1. Famous movies/shows filmed here. 2. Exact street corners/buildings. 3. 'Then vs Now' context. 4. Photo ops. 5. Trivia about the shoot." }
                ]
            },
            {
                id: "adventure-nature",
                name: "Adventure & Nature",
                icon: "🏔️",
                prompts: [
                    { id: "hiking-guide", title: "Comprehensive Hiking Guide", content: "Act as an Expert Outdoor Guide. I am planning a hiking trip to [DESTINATION]. Create a detailed hiking guide. Context: I have [EXPERIENCE LEVEL] experience and [TIME] days. Role: Wilderness Expert. Task: Plan specific trails. Format: Day-by-day Itinerary + Gear List. Constraints: Safety first, consider weather. Goal: A safe, scenic, and manageable adventure. Tone: Encouraging, detailed, safety-conscious. Audience: Hiker. Steps: 1. Recommend top trails with difficulty ratings. 2. List essential gear (clothing, safety, food). 3. Provide safety tips (wildlife, weather basics). 4. Suggest best photo spots. 5. Include emergency contacts." },
                    { id: "scuba-diving", title: "Scuba Diving Trip Planner", content: "Act as a Dive Master. Plan a scuba diving trip to [DESTINATION]. Context: Certified [LEVEL] diver. Role: Dive Expert. Task: Recommend dive sites and operators. Format: List of Sites with Depth/Difficulty. Constraints: Budget [AMOUNT]. Goal: See specific marine life (e.g., sharks, turtles). Tone: Professional, enthusiastic. Steps: 1. List top 5 dive sites with descriptions. 2. Recommend reputable dive shops/schools. 3. Detail certification requirements or courses. 4. Advice on best season for visibility. 5. Packing list for dive gear vs rental." },
                    { id: "safari-planning", title: "African Safari Planner", content: "Act as a Safari Specialist. Plan a safari in [COUNTRY/REGION]. Role: Wildlife Expert. Task: Create an itinerary and guide. Format: Itinerary. Constraints: Budget [BUDGET], Duration [DAYS]. Goal: Big 5 sightings. Tone: Adventurous. Steps: 1. Suggest national parks vs private reserves. 2. Best time of year to visit. 3. Accommodation options (camping vs lodges). 4. Safari etiquette and safety. 5. Photography tips for wildlife." },
                    { id: "ski-trip", title: "Ski/Snowboard Trip Guide", content: "Act as a Winter Sports Consultant. Plan a ski trip to [DESTINATION]. Role: Ski Instructor. Task: Guide to slopes and apres-ski. Format: Guide. Constraints: Skill level [LEVEL]. Goal: Mix of sport and relaxation. Steps: 1. Review ski resort terrain (green vs black runs). 2. Rental vs bring own gear advice. 3. Best lift pass options (Ikon, Epic, local). 4. Apres-ski and dining recommendations. 5. Accommodation (ski-in/ski-out)." },
                    { id: "camping-checklist", title: "Ultimate Camping Checklist", content: "Act as a Survivalist. Create a camping checklist for [ENVIRONMENT] (e.g., forest, desert, mountain). Role: Outdoor Expert. Task: Comprehensive packing list. Format: Categorized Checklist. Constraints: [DURATION] days, car camping vs backpacking. Goal: Don't forget essentials. Steps: 1. Shelter & Bedding. 2. Cooking & Food (menu ideas). 3. Clothing layers. 4. Safety & First Aid. 5. Tools & Lighting. 6. Hygiene & Toiletries." },
                    { id: "rock-climbing", title: "Rock Climbing Itinerary", content: "Act as a Climbing Guide. Plan a climbing trip to [DESTINATION]. Role: Climbing Pro. Task: List routes and logistics. Format: Route Guide. Constraints: Grade range [GRADE], Trad/Sport/Bouldering. Goal: Push limits safely. Steps: 1. Highlight classic routes in the grade range. 2. Approach beta and access info. 3. Gear requirements (rope length, rack). 4. Rest day activities. 5. Local climbing ethics." },
                    { id: "surfing-trip", title: "Surf Trip Planner", content: "Act as a Surf Coach. Plan a surf trip to [DESTINATION]. Role: Local Surfer. Task: Find best breaks. Format: Spot Guide. Constraints: Swell season, [LEVEL] ability. Goal: Catch optimal waves. Steps: 1. Break down top surf spots (tide, swell direction). 2. Board rental vs travel with board. 3. Accommodation near breaks. 4. Localism and etiquette warnings. 5. Non-surf activities." },
                    { id: "ecotourism", title: "Eco-Friendly Travel Guide", content: "Act as a Sustainable Travel Expert. Plan an eco-trip to [DESTINATION]. Role: Eco-Warrior. Task: Minimize footprint. Format: Guide. Constraints: Low carbon, supporting local communities. Goal: Ethical travel. Steps: 1. Recommend eco-lodges/hotels. 2. Sustainable transport options. 3. Ethical wildlife interactions (no riding elephants, etc). 4. Local NGOs to support. 5. Packing zero-waste kit." },
                    { id: "national-parks", title: "National Park Itinerary", content: "Act as a Park Ranger. Plan a visit to [NATIONAL PARK]. Role: Ranger. Task: Itinerary and rules. Format: Day-by-day plan. Constraints: [DAYS], [FITNESS]. Goal: See major landmarks + hidden spots. Steps: 1. Must-see trails and viewpoints. 2. Permit and reservation requirements. 3. Wildlife safety (bears/etc). 4. Best sunrise/sunset spots. 5. Camping/Lodging logistics." },
                    { id: "stargazing", title: "Dark Sky Stargazing Guide", content: "Act as an Astronomer. Plan a stargazing trip to [DESTINATION]. Role: Astronomy Guide. Task: Best spots and times. Format: Guide. Constraints: Moon phase, weather. Goal: See Milky Way/Aurora. Steps: 1. Identify light pollution free zones. 2. Best time of year/month. 3. Gear (binoculars, telescope, camera settings). 4. Constellations/planets visible. 5. Night navigation safety." },
                    { id: "bird-watching", title: "Bird Watching Expedition", content: "Act as an Ornithologist. Plan a birding trip to [REGION]. Role: Bird Expert. Task: Spotting guide. Format: Checklist & Map. Constraints: Season. Goal: Spot endemic species. Steps: 1. Target species list. 2. Best habitats and times of day. 3. Guide/tour recommendations. 4. Photography tips for birds. 5. Etiquette (noise, calls)." },
                    { id: "kayaking-guide", title: "Kayaking/Canoeing Adventure", content: "Act as a River Guide. Plan a paddling trip on [BODY OF WATER]. Role: Paddler. Task: Route and safety. Format: River/Sea Map Guide. Constraints: [DAYS], Flatwater vs Whitewater. Goal: Scenic paddle. Steps: 1. Put-in and Take-out points. 2. Rapid classes or sea conditions. 3. Portage info. 4. Camping spots along route. 5. Safety gear (PFD, dry bag)." },
                    { id: "mountain-biking", title: "MTB Trail Guide", content: "Act as a Mountain Bike Guide. Plan a trip to [DESTINATION]. Role: MTB Pro. Task: Trail selection. Format: Trail List. Constraints: Skill [LEVEL], Bike type. Goal: Flow and tech trails. Steps: 1. Top trail networks. 2. Bike shop/rental/mechanic info. 3. Shuttle services vs climbing. 4. Trailforks/Map resources. 5. Post-ride food/brewery." }
                ]
            },
            {
                id: "digital-nomad",
                name: "Digital Nomad & Remote Work",
                icon: "💻",
                prompts: [
                    { id: "coworking-finder", title: "Coworking Space Finder", content: "Act as a Digital Nomad. Recommend coworking spaces in [CITY]. Role: Remote Worker. Task: Evaluation of workspaces. Format: Comparison Table. Constraints: Budget, High-speed WiFi essential. Goal: Productive environment. Steps: 1. Top 3 coworking spaces. 2. Price (day pass/monthly). 3. Internet speed test stats (if known). 4. Community vibe/events. 5. Coffee/Amenities." },
                    { id: "nomad-visa", title: "Digital Nomad Visa Guide", content: "Act as an Immigration Consultant. Explain the Digital Nomad Visa for [COUNTRY]. Role: Visa Expert. Task: Application guide. Format: Step-by-Step Guide. Constraints: Current regulations. Goal: Successful application. Steps: 1. Eligibility criteria (income, employment). 2. Required documents. 3. Application process and cost. 4. Valid duration and tax implications. 5. Extension options." },
                    { id: "tax-implications", title: "Nomad Tax Basics", content: "Act as a Tax Accountant. Explain tax implications for a digital nomad from [HOME COUNTRY] living in [HOST COUNTRY]. Role: Tax Advisor. Task: General overview (not legal advice). Format: Informational Summary. Goal: Avoid double taxation. Steps: 1. Tax residency rules (183 days etc). 2. Double Taxation Treaties. 3. FEIE (if US). 4. Local tax obligations. 5. Banking best practices." },
                    { id: "wifi-cafe", title: "Laptop-Friendly Cafe Hunter", content: "Act as a Remote Worker. List laptop-friendly cafes in [NEIGHBORHOOD]. Role: Coffee Connoisseur. Task: Work spots. Format: List. Constraints: Good WiFi, Power outlets, Work policy. Goal: 4 hours of focused work. Steps: 1. Cafe name and location. 2. WiFi speed/reliability. 3. Power outlet availability. 4. Seating comfort/noise level. 5. Coffee/Food quality." },
                    { id: "accommodation-nomad", title: "Long-Term Accommodation Finder", content: "Act as a Relocation Specialist. How to find 1-3 month rentals in [CITY]. Role: Housing Expert. Task: Search strategy. Format: Guide. Constraints: Budget [AMOUNT], Kitchen, Desk. Goal: Comfortable home base. Steps: 1. Best platforms (Airbnb, Flatio, FB Groups). 2. Neighborhoods for expats. 3. Negotiating long-stay discounts. 4. WiFi verification tips before booking. 5. Scams to avoid." },
                    { id: "networking-events", title: "Nomad Networking Guide", content: "Act as a Community Manager. Find networking events in [CITY]. Role: Networker. Task: Social calendar. Format: List of Sources. Goal: Meet other nomads/locals. Steps: 1. Meetup.com groups. 2. Regular expat gatherings. 3. Tech/Startup events. 4. Co-living community events. 5. WhatsApp/Slack communities to join." },
                    { id: "work-life-balance", title: "Remote Work-Life Balance", content: "Act as a Productivity Coach. Create a schedule for a nomad in [TIMEZONE] working [HOME TIMEZONE] hours. Role: Coach. Task: Daily Routine. Format: Schedule. Constraints: 8 hour work day. Goal: Explore the city + get work done. Steps: 1. Sleep/Wake times. 2. Deep work blocks. 3. Meal/Social breaks. 4. Sync meeting windows. 5. Best time for sightseeing." },
                    { id: "internet-backup", title: "Internet Reliability Plan", content: "Act as a Tech Support Lead. Plan internet backup for [DESTINATION]. Role: Techie. Task: Connection strategy. Format: Checklist. Constraints: Essential video calls. Goal: 99.9% uptime. Steps: 1. Primary connection check (fiber/cable). 2. Local SIM card recommendations (best carrier). 3. Mobile hotspot device options. 4. Cafe/Coworking backup locations. 5. Offline mode prep." },
                    { id: "health-insurance", title: "Nomad Health Insurance", content: "Act as an Insurance Broker. Compare health insurance for digital nomads. Role: Broker. Task: Plan comparison. Format: Comparison. Constraints: Coverage in [REGION]. Goal: Emergency + Routine care. Steps: 1. Top providers (SafetyWing, World Nomads, etc). 2. Coverage limits/deductibles. 3. Home country coverage. 4. Adventure sports inclusions. 5. Claim process reputation." },
                    { id: "banking-finance", title: "Nomad Banking Setup", content: "Act as a Financial Advisor. Setup banking for international travel. Role: FinTech Expert. Task: Tool stack. Format: List. Goal: Low fees, easy access. Steps: 1. Best neobanks (Revolut, Wise, Monzo). 2. ATM withdrawal strategy (fee reimbursement cards). 3. Currency exchange tips. 4. Backup card strategy. 5. 2FA management without home SIM." },
                    { id: "packing-tech", title: "Tech Packing List", content: "Act as a Tech Reviewer. Packing list for digital nomad office. Role: Nomad. Task: Gear list. Format: Checklist. Constraints: Light travel (carry-on?). Goal: Full ergonomic setup. Steps: 1. Laptop & Stand (Roost etc). 2. Keyboard & Mouse. 3. Adapters & Power strip. 4. Noise-canceling headphones. 5. Cables & Organizers." },
                    { id: "nomad-community", title: "Joining Local Community", content: "Act as a Social Connector. How to make local friends in [CITY] (not just expats). Role: Local Guide. Task: Integration strategy. Format: Guide. Goal: Cultural immersion. Steps: 1. Language exchange meetups. 2. Hobby clubs (sports, art). 3. Volunteering opportunities. 4. Dating/Friend apps (Bumble BFF). 5. Local etiquette for making friends." },
                    { id: "slow-travel", title: "Slow Travel Itinerary", content: "Act as a Slow Travel Advocate. Plan a 1-month stay in [REGION]. Role: Planner. Task: Deep dive intierary. Format: Weekly themes. Goal: Depth over breadth. Steps: 1. Week 1: Neighborhood orientation. 2. Week 2: Local routines (markets, cafes). 3. Week 3: Day trips nearby. 4. Week 4: Hidden gems & farewells. 5. Weekend getaway ideas." }
                ]
            },
            {
                id: "food-culinary",
                name: "Food & Culinary Travel",
                icon: "🍜",
                prompts: [
                    { id: "street-food", title: "Street Food Crawl Guide", content: "Act as a Food Blogger. Plan a street food crawl in [CITY]. Role: Local Foodie. Task: Food route. Format: Map/List. Constraints: Safe hygiene spots. Goal: Taste iconic dishes. Steps: 1. Must-try dishes (local names). 2. Best stalls/markets. 3. Peak times to visit. 4. Average prices. 5. Hygiene tips (water, cooked, peeled)." },
                    { id: "fine-dining", title: "Fine Dining Reservation", content: "Act as a Concierge. Recommend fine dining in [CITY]. Role: Gourmand. Task: Select top restaurants. Format: List. Constraints: Cuisine [TYPE], Budget [AMOUNT]. Goal: Memorable gastronomic experience. Steps: 1. Top 3 rated restaurants (Michelin/50 Best). 2. Signature dishes to order. 3. Reservation lead time (how far in advance). 4. Dress code. 5. Tasting menu vs A la carte advice." },
                    { id: "dietary-restrictions", title: "Allergy/Dietary Travel Card", content: "Act as a Translator. Create a dietary card for [ALLERGY/DIET] in [LANGUAGE]. Role: Safety Guide. Task: Translate specific phrases. Format: Text Card. Constraints: Severe allergy. Goal: Safe eating. Steps: 1. 'I have a severe allergy to...' 2. 'Does this contain...?' 3. List of common local dishes containing the allergen. 4. Safe alternatives. 5. Emergency phrase ('Call a doctor')." },
                    { id: "wine-tasting", title: "Wine Tasting Itinerary", content: "Act as a Sommelier. Plan a wine tour in [REGION]. Role: Wine Expert. Task: Winery route. Format: Itinerary. Constraints: Transport required. Goal: Taste best varietals. Steps: 1. Top 3 wineries to visit. 2. Iconic varietals of the region. 3. Lunch recommendation (food pairing). 4. Transport (driver vs tour). 5. Etiquette in tasting rooms." },
                    { id: "coffee-culture", title: "Specialty Coffee Guide", content: "Act as a Barista. Guide to coffee culture in [CITY]. Role: Coffee Lover. Task: Best cafes and roasters. Format: List. Goal: Best Pour-over/Espresso. Steps: 1. Famous local roasters. 2. Cafes with best atmosphere. 3. Local coffee ordering customs (names of drinks). 4. Bean buying tips. 5. Coffee history of the region." },
                    { id: "cooking-class", title: "Cooking Class Finder", content: "Act as a Chef. Find a cooking class in [CITY]. Role: Culinary Student. Task: Recommend classes. Format: Comparison. Goal: Learn to cook [DISH]. Steps: 1. Market tour inclusion? 2. Hands-on vs Demo. 3. Dish menu. 4. Recipe booklet provided? 5. English speaking instructor?" },
                    { id: "market-tour", title: "Local Market Guide", content: "Act as a Local Chef. Guide to [MARKET NAME] in [CITY]. Role: Insider. Task: Shopping guide. Format: Walkthrough. Goal: Best ingredients/snacks. Steps: 1. Best time to arrive. 2. Stalls to visit (Produce, Meat, Spices). 3. Street snacks inside the market. 4. Price negotiation etiquette. 5. Souvenirs (spices, utensils)." },
                    { id: "local-features", title: "Regional Food Specialties", content: "Act as a Culinary Historian. Explain the specialty dishes of [REGION]. Role: Educator. Task: Deep dive into cuisine. Format: Article. Goal: Cultural understanding. Steps: 1. List 5 iconic dishes. 2. Key ingredients used. 3. Cultural significance/history. 4. How to eat it (utensils/hands). 5. Best beverage pairings." },
                    { id: "dining-etiquette", title: "Dining Etiquette Guide", content: "Act as an Etiquette Expert. Explain dining rules in [COUNTRY]. Role: Cultural Guide. Task: Do's and Don'ts. Format: List. Goal: Don't offend locals. Steps: 1. Tipping customs. 2. Table manners (chopsticks, hands, utensils). 3. Alcohol rules/toasting. 4. Paying the bill (split vs host pays). 5. Seating arrangements." },
                    { id: "vegetarian-vegan", title: "Vegan/Vegetarian Survival Guide", content: "Act as a Vegan Foodie. Guide to eating plant-based in [CITY]. Role: Vegan Expert. Task: Restaurant/Dish guide. Format: Guide. Constraints: Strict vegan. Goal: Delicious food, no compromise. Steps: 1. Accidentally vegan local dishes. 2. Best vegan-exclusive restaurants. 3. Modification phrases ('No fish sauce'). 4. Supermarket snacks. 5. HappyCow/App usage." },
                    { id: "craft-beer", title: "Craft Beer/Brewery Tour", content: "Act as a Brewer. Plan a beer crawl in [CITY]. Role: Cicerone. Task: Brewery list. Format: Map. Goal: Local craft brews. Steps: 1. Top rated microbreweries. 2. Local beer styles to try. 3. Bottle shops for souvenirs. 4. Food trucks/Pub food pairings. 5. Safe transport options." },
                    { id: "food-photography", title: "Food Photography Spots", content: "Act as a Food Photographer. Instagram guide to food in [CITY]. Role: Influencer. Task: Photogenic spots. Format: List. Goal: Viral shots. Steps: 1. Most aesthetic cafes. 2. Colorful dishes to order. 3. Lighting tips for specific venues. 4. Best angles (flatlay vs macro). 5. Hashtags to use." },
                    { id: "recipes-home", title: "Recreate Travel Recipe", content: "Act as a Chef. Recipe for [DISH] from [COUNTRY]. Role: Home Cook. Task: Authentic recipe. Format: Recipe. Constraints: Ingredients available in [HOME COUNTRY]. Goal: Authentic taste. Steps: 1. Ingredients list (with substitutions). 2. Prep steps. 3. Cooking method. 4. Plating and serving. 5. Story behind the dish." }
                ]
            },
            {
                id: "budget-hacks",
                name: "Budget Travel & Hacks",
                icon: "💰",
                prompts: [
                    { id: "flight-hacker", title: "Cheap Flight Hacker", content: "Act as a Travel Hacker. Find cheapest flights from [ORIGIN] to [DESTINATION]. Role: Analyst. Task: Search strategy. Format: Guide. Constraints: Flexible dates. Goal: Lowest price. Steps: 1. Best search engines (Skyscanner, Google Flights, Momondo). 2. Best day to fly/book. 3. Hidden city ticketing tricks (Skiplagged). 4. VPN usage for better rates. 5. Error fare alerts to subscribe to." },
                    { id: "hostel-finder", title: "Best Hostel Finder", content: "Act as a Backpacker. Recommend hostels in [CITY]. Role: Budget Traveler. Task: Accommodation list. Format: Top 3 List. Constraints: Budget [AMOUNT], Social vibe. Goal: Clean, safe, social. Steps: 1. Hostelworld rating analysis. 2. Location vs city center. 3. Amenities (Free breakfast, kitchen, lockers). 4. Party vs Chill vibe. 5. Female-only dorm options." },
                    { id: "free-activities", title: "Free Things to Do", content: "Act as a Local Guide. List free activities in [CITY]. Role: Local. Task: Itinerary. Format: List. Constraints: $0 cost. Goal: Full day of fun. Steps: 1. Free museums/galleries (and specific free days). 2. Parks and viewpoints. 3. Walking tours (tip-based). 4. Historic landmarks (exterior). 5. Street markets (browsing)." },
                    { id: "travel-hacking", title: "Points & Miles Strategy", content: "Act as a Credit Card Points Expert. How to book a trip to [DESTINATION] using points. Role: Hacker. Task: Redemption strategy. Format: Guide. Constraints: [CARD/AIRLINE] loyalty program. Goal: Business class for economy price. Steps: 1. Best transfer partners. 2. Sweet spot redemptions. 3. Award availability search tools. 4. Taxes and fees estimation. 5. Upgrade availability." },
                    { id: "student-discounts", title: "Student Travel Discounts", content: "Act as a Student Advisor. Guide to student discounts in [EUROPE/REGION]. Role: Student. Task: Save money. Format: Checklist. Constraints: Valid Student ID. Goal: Max discounts. Steps: 1. ISIC card benefits. 2. Museum/Attraction discounts (Louvre free under 26 etc). 3. Rail pass discounts (Eurail Youth). 4. Airline youth fares. 5. Hostel membership cards." },
                    { id: "couchsurfing", title: "Couchsurfing/Free Stay Guide", content: "Act as a Couchsurfer. How to find free stays in [CITY]. Role: Community Member. Task: Safety and success guide. Format: Guide. Goal: Free stay + local connection. Steps: 1. Profile optimization tips. 2. How to write a winning request. 3. Platforms (Couchsurfing, BeWelcome, Trustroots). 4. Safety vetting (references). 5. Gift/Etiquette for hosts." },
                    { id: "cheap-eats", title: "Budget Food Guide", content: "Act as a Foodie on a Budget. Where to eat in [CITY] for under $[AMOUNT]. Role: Local. Task: Food guide. Format: List. Goal: Full belly, low cost. Steps: 1. Street food stalls. 2. Supermarket meal deals. 3. 'Menu del dia' or lunch specials. 4. University cafeteria access. 5. Bakeries and late-day discounts." },
                    { id: "transport-hacks", title: "Public Transport Hacks", content: "Act as a Commuter. Guide to [CITY] public transport. Role: Local. Task: Navigation. Format: Guide. Constraints: Cheapest option. Goal: Efficient travel. Steps: 1. Travel cards vs single tickets (Oyster, Suica etc). 2. Airport transfer cheapest method. 3. Day pass value calculation. 4. Apps for schedules (Citymapper etc). 5. Etiquette and fines." },
                    { id: "working-holiday", title: "Working Holiday Visa", content: "Act as a Visa Consultant. Guide to Working Holiday in [COUNTRY] for citizens of [COUNTRY]. Role: Consultant. Task: Application guide. Format: Checklist. Constraints: Age limit. Goal: Work and travel. Steps: 1. Age and nationality eligibility. 2. Proof of funds requirement. 3. Job market for backpackers. 4. Application cost/timeline. 5. Tax file number setup." },
                    { id: "house-sitting", title: "House Sitting Guide", content: "Act as a House Sitter. How to land a house sit in [REGION]. Role: Sitter. Task: Secure a sit. Format: Guide. Goal: Free luxury accommodation. Steps: 1. Best platforms (TrustedHousesitters). 2. Building a profile with reviews. 3. Application message template. 4. Pet care responsibilities. 5. Verification process." },
                    { id: "campervan-budget", title: "Budget Campervan Trip", content: "Act as a Vanlifer. Plan a campervan trip in [COUNTRY]. Role: Vanlifer. Task: Budget road trip. Format: Guide. Constraints: Low budget. Goal: Freedom on wheels. Steps: 1. Rental relocation deals ($1/day). 2. Free camping apps (iOverlander, Park4Night). 3. Cooking in a van recipes. 4. Shower finding tips (gyms, truck stops). 5. Gas saving driving tips." },
                    { id: "haggling-guide", title: "Haggling/Bargaining Guide", content: "Act as a Market Trader. How to haggle in [COUNTRY]. Role: Expert. Task: Negotiate prices. Format: Script/Tips. Goal: Fair price. Steps: 1. Cultural appropriateness (where to/not to haggle). 2. Starting price rule (50%?). 3. Body language and 'walking away'. 4. Key phrases in local language. 5. Common scams to avoid." }
                ]
            },
            {
                id: "luxury-honeymoons",
                name: "Luxury & Honeymoons",
                icon: "🥂",
                prompts: [
                    { id: "honeymoon-planner", title: "Luxury Honeymoon Itinerary", content: "Act as a Honeymoon Specialist. Plan a romantic trip to [DESTINATION]. Role: Planner. Task: Itinerary. Format: Daily Plan. Constraints: Unlimited budget, Romantic. Goal: Once-in-a-lifetime. Steps: 1. Best 5-star resort/villa. 2. Private candlelight dinner spots. 3. Couples spa treatments. 4. Exclusive excursions (sunset sail, private tour). 5. Photographer booking." },
                    { id: "resort-comparison", title: "Luxury Resort Comparison", content: "Act as a Travel Advisor. Compare top resorts in [MALDIVES/ETC]. Role: Expert. Task: Comparison. Format: Table. Constraints: Overwater bungalows. Goal: Best value/luxury. Steps: 1. Resort A vs B vs C. 2. Inclusions (All-inclusive vs Full Board). 3. House reef quality. 4. Butler service availability. 5. Transfer method (Seaplane vs Boat)." },
                    { id: "first-class-flight", title: "First Class Experience Guide", content: "Act as an Aviation Expert. Review First Class on [AIRLINE]. Role: Reviewer. Task: What to expect. Format: Review. Goal: Maximize the experience. Steps: 1. Lounge access and ground services. 2. Seat/Suite features. 3. Dining and caviar service. 4. Amenity kit contents. 5. Shower/Bar onboard availability." },
                    { id: "private-jet", title: "Private Jet Charter", content: "Act as a Charter Broker. Guide to chartering a jet from [ORIGIN] to [DESTINATION]. Role: Broker. Task: Booking guide. Format: Guide. Goal: Travel in style. Steps: 1. Heavy vs Light Jet options. 2. Estimated cost. 3. FBO (Private Terminal) process. 4. Catering requests. 5. Luggage capacity." },
                    { id: "michelin-tour", title: "Michelin Star Food Tour", content: "Act as a Gastronome. Plan a 3-day Michelin tour in [CITY]. Role: Food Critic. Task: Dining itinerary. Format: Schedule. Constraints: Lunch and Dinner. Goal: Culinary perfection. Steps: 1. Reservation difficulty and booking capability. 2. Tasting menu focus. 3. Wine pairing recommendations. 4. Dress codes. 5. Chef's table options." },
                    { id: "yacht-charter", title: "Luxury Yacht Charter", content: "Act as a Yacht Captain. Plan a week charter in [MEDITERRANEAN/CARIBBEAN]. Role: Captain. Task: Route and logistics. Format: Itinerary. Constraints: Creating a preference sheet. Goal: Relaxed luxury. Steps: 1. Best marinas to dock. 2. Secluded bays for swimming. 3. Chef menu planning. 4. Water toys (jet skis, seabobs). 5. Tipping the crew." },
                    { id: "concierge-request", title: "Hotel Concierge Requests", content: "Act as a Chief Concierge. List of things a concierge can do for you at a 5-star hotel. Role: Concierge. Task: Service guide. Format: List. Goal: Utilize services. Steps: 1. Restaurant reservations. 2. Private driver/transfer. 3. Room customization (pillows, flowers). 4. Exclusive tickets (theater, opera). 5. Shipping/Shopping assistance." },
                    { id: "luxury-train", title: "Luxury Train Journey", content: "Act as a Travel Historian. Guide to the [ORIENT EXPRESS/ETC]. Role: Guide. Task: Experience overview. Format: Guide. Goal: Golden age of travel. Steps: 1. Route highlights. 2. Cabin classes (Grand Suite vs Twin). 3. Formal dining etiquette. 4. Dress code requirements. 5. Booking lead time." },
                    { id: "personal-shopper", title: "Personal Shopping Experience", content: "Act as a Fashion Stylist. Arrange a shopping tour in [PARIS/MILAN]. Role: Stylist. Task: Shopping guide. Format: Itinerary. Goal: Wardrobe refresh. Steps: 1. Best districts for luxury brands. 2. Appointment-only boutiques. 3. Tax-free shopping process (VAT refund). 4. Custom tailoring options. 5. Shipping purchases home." },
                    { id: "spa-retreat", title: "Wellness & Spa Retreat", content: "Act as a Wellness Guru. Plan a detox retreat in [BALI/SWISS ALPS]. Role: Guru. Task: Retreat plan. Format: Schedule. Goal: Rejuvenation. Steps: 1. Top wellness resorts. 2. Treatment menu (Ayurveda, Massage). 3. Yoga/Meditation classes. 4. Nutrition/Dietary plans. 5. Digital detox rules." },
                    { id: "private-island", title: "Private Island Rental", content: "Act as a Luxury Agent. Guide to renting a private island. Role: Agent. Task: Selection guide. Format: List. Goal: Total privacy. Steps: 1. Top islands in [REGION]. 2. Staffing inclusions (Chef, Housekeeping). 3. Accessibility (Helicopter/Boat). 4. Activities available. 5. Security and privacy assurances." },
                    { id: "auction-art", title: "Art Auction/Gallery Tour", content: "Act as an Art Consultant. Guide to buying art in [CITY]. Role: Consultant. Task: Buying guide. Format: Itinerary. Goal: Investment piece. Steps: 1. Best contemporary galleries. 2. Auction house schedules (Sotheby's/Christie's). 3. Shipping and insurance. 4. Meeting artists/Private viewings. 5. Export permits." }
                ]
            },
            {
                id: "local-experiences",
                name: "Hidden Gems & Local Life",
                icon: "🏘️",
                prompts: [
                    { id: "like-a-local", title: "Live Like a Local", content: "Act as a Local Resident. How to spend a Sunday in [CITY] like a local. Role: Local. Task: Authentic day plan. Format: Itinerary. Constraints: No tourist traps. Goal: Feel like a resident. Steps: 1. Local breakfast spot (not hotel). 2. Where to walk/hang out (parks, squares). 3. Cultural nuances (siesta, fika). 4. Transport locals use. 5. Evening social customs." },
                    { id: "off-beaten-path", title: "Off-the-Beaten-Path", content: "Act as an Explorer. Guide to hidden gems in [COUNTRY]. Role: Explorer. Task: Unique locations. Format: List. Constraints: Avoid top 10 lists. Goal: Discovery. Steps: 1. Underrated towns/villages. 2. Natural wonders closest to tourist hubs but empty. 3. Abandoned/Quirky sites. 4. Best way to access (rental car needed?). 5. Accommodation tips in remote areas." },
                    { id: "village-stay", title: "Traditional Village Stay", content: "Act as a Cultural Anthropologist. Guide to staying in a village in [REGION]. Role: Guide. Task: Preparation. Format: Guide. Goal: Homestay experience. Steps: 1. How to book (platforms vs on arrival). 2. Etiquette and gifts for hosts. 3. Daily life participation (farming, cooking). 4. Language barriers. 5. Facilities expectations (toilet, shower)." },
                    { id: "festivals-events", title: "Local Festival Guide", content: "Act as a Event Coordinator. Guide to [FESTIVAL NAME] in [CITY]. Role: Insider. Task: Survival guide. Format: Guide. Goal: Enjoy the party. Steps: 1. History of the festival. 2. Schedule of key events/parades. 3. Best vantage points. 4. What to wear/bring. 5. Safety in crowds." },
                    { id: "language-immersion", title: "Language Immersion Strategy", content: "Act as a Language Teacher. Plan a language immersion trip to [CITY]. Role: Teacher. Task: Learning plan. Format: Strategy. Goal: Fluency boost. Steps: 1. Language school recommendations. 2. Language exchange meetups. 3. Host family stay options. 4. Daily challenges (order in target language only). 5. Media consumption (local radio/TV)." },
                    { id: "public-transport-mastery", title: "Master the Metro/Bus", content: "Act as a Urban Planner. Deep dive into [CITY] transport system. Role: Expert. Task: Master guide. Format: Guide. Goal: Never get lost. Steps: 1. Map overview. 2. Rush hour warnings. 3. Ticket machine tutorial. 4. Navigation apps. 5. Safety at night." },
                    { id: "artisan-crafts", title: "Artisan Craft Hunting", content: "Act as a Curator. Where to buy authentic crafts in [REGION]. Role: Curator. Task: Shopping guide. Format: List. Constraints: No mass-produced souvenirs. Goal: Support local artisans. Steps: 1. Pottery/Textile/Woodwork specialties. 2. Workshops to visit. 3. How to verify authenticity. 4. Fair price vs exploitation. 5. Shipping fragile items." },
                    { id: "historical-walk", title: "Self-Guided History Walk", content: "Act as a Historian. Create a walking tour of [NEIGHBORHOOD]. Role: Guide. Task: Historical route. Format: Map/Points. Goal: Learn history. Steps: 1. Start point and context. 2. Stop 1: Significance. 3. Stop 2: Architecture details. 4. Stop 3: Famous resident story. 5. End point (cafe/pub)." },
                    { id: "volunteer-travel", title: "Ethical Voluntourism", content: "Act as a NGO Director. Guide to volunteering in [COUNTRY]. Role: Advisor. Task: Find ethical projects. Format: Guide. Constraints: Avoid 'orphanage tourism'. Goal: Positive impact. Steps: 1. Vetting organizations. 2. Skills matching (teaching, building, conservation). 3. Cost transparency (why pay to volunteer?). 4. Visa requirements. 5. Cultural sensitivity." },
                    { id: "music-scene", title: "Underground Music Scene", content: "Act as a Music Journalist. Guide to live music in [CITY]. Role: Insider. Task: Find gigs. Format: List. Constraints: Non-stadium shows. Goal: Discover new bands. Steps: 1. Best small venues/jazz clubs. 2. Local genres (Techno, Jazz, Indie). 3. Where to buy tickets. 4. Festival calendar. 5. Record stores." },
                    { id: "literary-tour", title: "Literary City Tour", content: "Act as a Librarian. Tour of [CITY] through books. Role: Guide. Task: Bookish locations. Format: Itinerary. Goal: Walk in author's footsteps. Steps: 1. Famous authors who lived here. 2. Bookstores to visit (rare/beautiful). 3. Libraries open to public. 4. Cafes where authors wrote. 5. Books set in the city to read beforehand." },
                    { id: "ancestral-travel", title: "Ancestry/Genealogy Trip", content: "Act as a Genealogist. Plan a trip to find roots in [REGION]. Role: Researcher. Task: Research trip. Format: Guide. Goal: Find family history. Steps: 1. Archives and records offices. 2. Visiting cemeteries/graves. 3. Finding living relatives. 4. Hiring a local researcher. 5. preparation (family tree)." }
                ]
            }
        ]
    },
        {
        id: "games",
        name: "Gaming & Entertainment Prompts",
        icon: "🎮",
        description: "Free AI prompts for game design, gaming content, and entertainment",
        folders: [
            {
                id: "gaming",
                name: "Gaming",
                icon: "🕹️",
                prompts: [
                    { id: "game-strategy", title: "Game Strategy Guide", content: "Create strategy guide for [GAME]. Include: Early game tips, Mid game strategies, Late game tactics, Character/class recommendations, Resource management, Common mistakes, Advanced techniques, Meta strategies, Practice routines." },
                    { id: "character-build", title: "Character Build Prompt", content: "Design optimal character build for [GAME/CLASS]. Include: Stat distribution, Skill priorities, Equipment recommendations, Playstyle guide, Synergies, Counters to watch for, Leveling path, End-game optimization." }
                ]
            },
            {
                id: "fun",
                name: "Fun & Creativity",
                icon: "🎉",
                prompts: [
                    { id: "riddle-generator", title: "Riddle Generator", content: "Create [NUMBER] riddles about [THEME]. For each: The riddle, Difficulty level, Hint, Answer, Explanation. Make them clever, family-friendly, varying difficulty." },
                    { id: "trivia", title: "Trivia Generator", content: "Generate [NUMBER] trivia questions on [TOPIC]. Include: Question, Multiple choice options, Correct answer, Fun fact explanation, Difficulty rating. Cover various aspects of the topic." },
                    { id: "imagination", title: "Imagination Exercise", content: "Creative imagination prompt for [PURPOSE]. Provide: Scenario setup, 'What if' questions, Sensory details to imagine, Story continuation, Character creation, World-building elements, Art/writing inspiration." }
                ]
            }
        ]
    }];

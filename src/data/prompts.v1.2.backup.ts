import type { PromptCategory } from "../types/prompt";

export const promptCategories: PromptCategory[] = [
    {
        id: "image",
        name: "Image Generation",
        icon: "🖼️",
        description: "Professional image prompts for AI art generation",
        folders: [
            {
                id: "portraits",
                name: "Portraits",
                icon: "👤",
                prompts: [
                    {
                        id: "realistic-portrait",
                        title: "Realistic Portrait",
                        content: "Ultra-realistic portrait of a person, natural lighting, DSLR quality, sharp focus, detailed skin texture, professional photography, 85mm lens, f/1.8 aperture"
                    },
                    {
                        id: "studio-headshot",
                        title: "Studio Headshot",
                        content: "Professional studio headshot, clean background, soft box lighting, corporate setting, business attire, confident expression, high resolution, sharp details"
                    },
                    {
                        id: "linkedin-photo",
                        title: "Professional LinkedIn Photo",
                        content: "Professional LinkedIn profile photo, business professional attire, neutral background, approachable smile, well-lit, corporate standard, high quality"
                    },
                    {
                        id: "cinematic-portrait",
                        title: "Cinematic Portrait",
                        content: "Cinematic portrait with dramatic lighting, film noir style, moody atmosphere, deep shadows, rim lighting, shallow depth of field, anamorphic lens aesthetic"
                    },
                    {
                        id: "bw-portrait",
                        title: "Black & White Portrait",
                        content: "High contrast black and white portrait, dramatic lighting, fine art photography style, timeless aesthetic, grainy film texture, emotional depth"
                    },
                    {
                        id: "lowlight-portrait",
                        title: "Low-Light Portrait",
                        content: "Low-light portrait photography, ambient lighting only, natural window light, subtle shadows, intimate atmosphere, ISO 3200, minimal noise"
                    },
                    {
                        id: "street-portrait",
                        title: "Street Photography Portrait",
                        content: "Candid street photography portrait, urban environment, natural moment, authentic expression, environmental context, documentary style, 50mm lens"
                    },
                    {
                        id: "fashion-portrait",
                        title: "Fashion Editorial Portrait",
                        content: "High fashion editorial portrait, magazine quality, dramatic makeup, designer clothing, avant-garde styling, professional model, studio lighting, Vogue aesthetic"
                    }
                ]
            },
            {
                id: "fantasy-characters",
                name: "Fantasy & Characters",
                icon: "🧙",
                prompts: [
                    {
                        id: "fantasy-portrait",
                        title: "Fantasy Portrait",
                        content: "Fantasy character portrait, mystical atmosphere, digital art, highly detailed, dramatic lighting, ethereal glow, magical elements, concept art style"
                    },
                    {
                        id: "anime-character",
                        title: "Anime Character",
                        content: "Anime character design, vibrant colors, expressive eyes, dynamic pose, cel-shaded style, modern anime aesthetic, detailed hair and clothing"
                    },
                    {
                        id: "cyberpunk-character",
                        title: "Cyberpunk Character",
                        content: "Cyberpunk character design, neon lighting, futuristic tech implants, dystopian city background, leather and chrome, holographic elements, Blade Runner aesthetic"
                    },
                    {
                        id: "medieval-warrior",
                        title: "Medieval Warrior",
                        content: "Medieval warrior character, battle-worn armor, intricate details, heroic pose, fantasy RPG style, dramatic sky background, weathered weapon, epic composition"
                    },
                    {
                        id: "dark-mage",
                        title: "Dark Mage",
                        content: "Dark sorcerer character, mystical robes, magical aura, glowing eyes, arcane symbols, ominous atmosphere, dark fantasy art, swirling magical energy"
                    },
                    {
                        id: "scifi-soldier",
                        title: "Sci-Fi Soldier",
                        content: "Futuristic military soldier, advanced tactical armor, high-tech weapons, sci-fi environment, dramatic lighting, military stance, concept art quality"
                    },
                    {
                        id: "mythical-creature",
                        title: "Mythical Creature Portrait",
                        content: "Mythical creature portrait, intricate details, fantasy art style, otherworldly features, magical atmosphere, epic scale, digital painting technique"
                    }
                ]
            },
            {
                id: "landscapes",
                name: "Landscapes",
                icon: "🏔️",
                prompts: [
                    {
                        id: "mountain-scenery",
                        title: "Mountain Scenery",
                        content: "Majestic mountain landscape, golden hour lighting, crystal clear lake reflection, photorealistic, 8k resolution, dramatic clouds, wide angle view"
                    },
                    {
                        id: "desert-landscape",
                        title: "Desert Landscape",
                        content: "Vast desert landscape, sand dunes at sunset, warm golden tones, dramatic shadows, clear blue sky, minimal vegetation, serene atmosphere, ultra-wide perspective"
                    },
                    {
                        id: "tropical-beach",
                        title: "Tropical Beach",
                        content: "Pristine tropical beach, turquoise water, white sand, palm trees, clear sky, paradise atmosphere, vibrant colors, travel photography style"
                    },
                    {
                        id: "snowy-forest",
                        title: "Snowy Forest",
                        content: "Snow-covered forest, winter wonderland, soft natural light, frost on trees, peaceful atmosphere, blue hour lighting, pristine white landscape"
                    },
                    {
                        id: "sunset-valley",
                        title: "Sunset Valley",
                        content: "Rolling valley at sunset, warm orange and pink sky, lush green hills, dramatic cloud formation, peaceful countryside, landscape photography"
                    },
                    {
                        id: "waterfall-scene",
                        title: "Waterfall Scene",
                        content: "Majestic waterfall, lush tropical vegetation, long exposure water effect, misty atmosphere, vibrant green moss, nature photography, serene environment"
                    },
                    {
                        id: "alien-planet",
                        title: "Alien Planet Landscape",
                        content: "Alien planet landscape, otherworldly terrain, strange rock formations, multiple moons in sky, sci-fi concept art, surreal colors, exotic atmosphere"
                    }
                ]
            },
            {
                id: "logos-branding",
                name: "Logos & Branding",
                icon: "✨",
                prompts: [
                    {
                        id: "minimal-logo",
                        title: "Minimal Logo",
                        content: "Minimalist logo design, clean lines, modern aesthetic, geometric shapes, professional, scalable vector, simple color palette, timeless design"
                    },
                    {
                        id: "tech-startup-logo",
                        title: "Tech Startup Logo",
                        content: "Tech startup logo, modern and innovative, abstract tech elements, bold typography, gradient colors, futuristic feel, professional branding"
                    },
                    {
                        id: "gaming-logo",
                        title: "Gaming Logo",
                        content: "Gaming logo design, bold and aggressive, esports aesthetic, dynamic shapes, vibrant colors, memorable icon, modern gaming culture"
                    },
                    {
                        id: "luxury-brand-logo",
                        title: "Luxury Brand Logo",
                        content: "Luxury brand logo, elegant and sophisticated, premium feel, gold accents, classic typography, high-end aesthetic, timeless elegance"
                    },
                    {
                        id: "mascot-logo",
                        title: "Mascot Logo",
                        content: "Mascot logo design, friendly character, approachable personality, cartoon style, versatile for different sizes, memorable branding"
                    },
                    {
                        id: "monogram-logo",
                        title: "Monogram Logo",
                        content: "Monogram logo design, intertwined letters, elegant typography, classic style, sophisticated branding, professional appearance, versatile design"
                    }
                ]
            },
            {
                id: "product-shots",
                name: "Product Photography",
                icon: "📦",
                prompts: [
                    {
                        id: "ecommerce-product",
                        title: "E-commerce Product Shot",
                        content: "Professional e-commerce product photography, white background, even lighting, sharp focus, high resolution, multiple angles, clean composition, commercial quality"
                    },
                    {
                        id: "lifestyle-product",
                        title: "Lifestyle Product Image",
                        content: "Lifestyle product photography, natural environment, in-use context, authentic setting, soft natural lighting, relatable scene, marketing quality"
                    },
                    {
                        id: "white-bg-product",
                        title: "White Background Product",
                        content: "Pure white background product shot, studio lighting, no shadows, perfectly centered, high contrast, crisp details, professional catalog style"
                    },
                    {
                        id: "cinematic-product",
                        title: "Cinematic Product Ad",
                        content: "Cinematic product advertisement, dramatic lighting, moody atmosphere, premium feel, artistic composition, high-end commercial photography"
                    },
                    {
                        id: "macro-product",
                        title: "Macro Product Shot",
                        content: "Macro product photography, extreme close-up, intricate details visible, shallow depth of field, textural emphasis, professional quality"
                    }
,
            {
                id: "photography-styles",
                name: "Photography Styles",
                icon: "📸",
                prompts: [
                    {
                        id: "street-photography",
                        title: "Street Photography",
                        content: "Urban street photography, candid moments, authentic life, natural lighting, decisive moment, documentary style, layered composition, human element, environmental context, photojournalistic approach"
                    },
                    {
                        id: "cinematic-film",
                        title: "Cinematic Film Look",
                        content: "Cinematic film photography, anamorphic aspect ratio, film grain texture, color grading with teal and orange, shallow depth of field, atmospheric haze, moody lighting, Hollywood aesthetic, emotional storytelling"
                    },
                    {
                        id: "vintage-photo",
                        title: "Vintage Photo",
                        content: "Vintage photography style, retro aesthetic, faded colors, film artifacts, nostalgic feel, 1970s-1980s era, soft focus, warm tones, analog camera look, grainy texture"
                    },
                    {
                        id: "editorial-fashion-photo",
                        title: "Editorial Fashion",
                        content: "High fashion editorial photography, magazine quality, professional model, designer clothing, dramatic poses, high-end styling, studio or location shoot, artistic direction, Vogue/Harper's Bazaar aesthetic"
                    },
                    {
                        id: "documentary-style",
                        title: "Documentary Style",
                        content: "Documentary photography, storytelling focus, authentic moments, social commentary, natural lighting, candid subjects, environmental portrait, photojournalism ethics, meaningful narrative, human condition"
                    }
                ]
            },
            {
                id: "ai-art-styles",
                name: "AI Art Styles",
                icon: "🎨",
                prompts: [
                    {
                        id: "studio-ghibli",
                        title: "Studio Ghibli Style",
                        content: "Studio Ghibli animation style, Hayao Miyazaki aesthetic, watercolor backgrounds, whimsical characters, soft pastel colors, dreamy atmosphere, hand-drawn quality, magical realism, nostalgic feel"
                    },
                    {
                        id: "cyberpunk-city",
                        title: "Cyberpunk City",
                        content: "Cyberpunk cityscape, neon lights, rain-soaked streets, towering skyscrapers, holographic advertisements, dark and moody, futuristic dystopia, Blade Runner aesthetic, vibrant purples and blues, urban decay"
                    },
                    {
                        id: "vaporwave-aesthetic",
                        title: "Vaporwave Aesthetic",
                        content: "Vaporwave art style, retro-futuristic, pastel pink and cyan colors, 80s-90s nostalgia, glitch effects, classical sculptures, palm trees, geometric patterns, surreal atmosphere, digital collage aesthetic"
                    },
                    {
                        id: "minimalist-art",
                        title: "Minimalist Art",
                        content: "Minimalist art composition, simple geometric shapes, limited color palette, negative space, clean lines, modern aesthetic, abstract forms, balance and harmony, less is more philosophy"
                    },
                    {
                        id: "surreal-dreamscape",
                        title: "Surreal Dreamscape",
                        content: "Surreal dreamscape, Salvador Dali inspired, impossible architecture, floating objects, distorted reality, vivid colors, dream logic, symbolic imagery, otherworldly atmosphere, photorealistic render"
                    }
                ]
            }
                ]
            }
        ]
    },
    {
        id: "writing",
        name: "Writing & Content",
        icon: "✍️",
        description: "Professional writing prompts for content creation",
        folders: [
            {
                id: "blog-posts",
                name: "Blog Posts",
                icon: "📝",
                prompts: [
                    {
                        id: "tutorial-outline",
                        title: "Tutorial Outline",
                        content: "Create a comprehensive tutorial outline for [TOPIC]. Include: Introduction with hook, Prerequisites and requirements, Step-by-step instructions with screenshots, Common pitfalls to avoid, Troubleshooting section, Conclusion and next steps, Related resources"
                    },
                    {
                        id: "seo-blog-post",
                        title: "SEO Blog Post",
                        content: "Write an SEO-optimized blog post about [TOPIC]. Include: Keyword-rich title (60 chars max), Meta description (155 chars), H2 and H3 subheadings with keywords, 1500-2000 words, Internal and external links, Call-to-action at the end, Natural keyword integration"
                    },
                    {
                        id: "listicle-article",
                        title: "Listicle Article",
                        content: "Create a listicle article: '[NUMBER] [TOPIC]'. Include: Catchy headline, Brief introduction, Numbered list with detailed explanations, Images or examples for each point, Quick summary, Engaging conclusion with CTA"
                    },
                    {
                        id: "opinion-blog",
                        title: "Opinion Blog",
                        content: "Write an opinion piece about [TOPIC]. Include: Strong opening statement, Personal perspective and experiences, Supporting arguments with evidence, Acknowledgment of counterarguments, Thought-provoking conclusion, Conversational but professional tone"
                    },
                    {
                        id: "case-study-blog",
                        title: "Case Study Blog",
                        content: "Write a detailed case study about [PROJECT/COMPANY]. Include: Executive summary, Background and challenge, Solution implemented, Process and methodology, Results with metrics, Lessons learned, Actionable takeaways"
                    },
                    {
                        id: "beginners-guide",
                        title: "Beginner's Guide",
                        content: "Create a beginner's guide to [TOPIC]. Include: What is [TOPIC] and why it matters, Core concepts explained simply, Step-by-step getting started guide, Common mistakes to avoid, Resources for further learning, Encouraging conclusion"
                    }
                ]
            },
            {
                id: "social-media",
                name: "Social Media",
                icon: "📱",
                prompts: [
                    {
                        id: "instagram-caption",
                        title: "Instagram Caption",
                        content: "Write an engaging Instagram caption for [TOPIC/IMAGE]. Include: Hook in first line, Value or story in body, Call-to-action, 3-5 relevant hashtags, Emojis for visual appeal, Question to boost engagement, Keep authenticity"
                    },
                    {
                        id: "twitter-thread",
                        title: "Twitter/X Thread",
                        content: "Create a Twitter/X thread about [TOPIC]. Tweet 1: Strong hook (make them stop scrolling). Tweets 2-8: Break down key points, one per tweet. Use: Line breaks for readability, Numbers/bullet points, Relevant emojis. Final tweet: Summary + CTA. Keep each tweet under 280 characters"
                    },
                    {
                        id: "linkedin-post",
                        title: "LinkedIn Post",
                        content: "Write a professional LinkedIn post about [TOPIC]. Include: Personal or professional story hook, Key insight or lesson, Relevant data or examples, Professional but conversational tone, Thought-provoking question at end, 3 relevant hashtags"
                    },
                    {
                        id: "youtube-description",
                        title: "YouTube Description",
                        content: "Create a YouTube video description for [VIDEO TOPIC]. Include: Compelling summary (first 2 lines crucial), Timestamps for key sections, Links to resources mentioned, Social media links, Relevant keywords naturally integrated, Call-to-action (subscribe, like), Hashtags (3-5)"
                    },
                    {
                        id: "reel-script",
                        title: "Reel/Short Script",
                        content: "Write a script for a 30-60 second Reel/Short about [TOPIC]. Structure: Hook (first 3 seconds), Problem or question, Quick tips/value (3-5 points), Call-to-action, Use: Text overlay suggestions, Scene transitions, Trending audio recommendations"
                    },
                    {
                        id: "hashtag-generator",
                        title: "Hashtag Generator Prompt",
                        content: "Generate a strategic hashtag set for [TOPIC/NICHE]. Provide: 5 high-reach hashtags (100k+ posts), 5 medium-reach hashtags (10k-100k posts), 5 niche hashtags (<10k posts), Branded hashtag suggestion, Explanation of strategy"
                    }
                ]
            },
            {
                id: "marketing-copy",
                name: "Marketing Copy",
                icon: "📢",
                prompts: [
                    {
                        id: "landing-page",
                        title: "Landing Page Copy",
                        content: "Write landing page copy for [PRODUCT/SERVICE]. Include: Attention-grabbing headline, Subheading explaining value proposition, 3-5 key benefits (not features), Social proof section, Clear primary CTA, Secondary CTA, FAQ section, Trust badges and guarantees"
                    },
                    {
                        id: "product-description",
                        title: "Product Description",
                        content: "Create a compelling product description for [PRODUCT]. Include: Catchy headline, What it is (1 sentence), Key benefits (3-5 bullets), Technical specifications, Use cases and scenarios, What's included, Guarantee or warranty info, Urgency element"
                    },
                    {
                        id: "email-newsletter",
                        title: "Email Newsletter",
                        content: "Write an email newsletter about [TOPIC]. Include: Subject line (under 50 chars, curiosity-driven), Preview text, Personal greeting, Main content with value, 2-3 section breaks, Primary CTA button, PS with secondary message, Unsubscribe link"
                    },
                    {
                        id: "cold-email",
                        title: "Cold Email",
                        content: "Write a cold outreach email for [PURPOSE]. Include: Personalized subject line, Relevant opening (show you've done research), Brief context of who you are, Specific value proposition for THEM, Soft call-to-action, Short PS with additional hook, Keep under 150 words total"
                    },
                    {
                        id: "ad-copy",
                        title: "Ad Copy (Meta / Google)",
                        content: "Create ad copy for [PRODUCT/SERVICE]. For Meta (Facebook/Instagram): Primary text (125 chars), Headline (40 chars), Description (30 chars), CTA button text. For Google: 3 headlines (30 chars each), 2 descriptions (90 chars each), Display URL. Include: Pain point, Solution, Benefit, Urgency"
                    },
                    {
                        id: "cta-variations",
                        title: "Call-to-Action Variations",
                        content: "Generate 10 CTA variations for [PRODUCT/SERVICE]. Include: Action-oriented verbs, Benefit-focused, Urgency-driven, Risk-free emphasis, Curiosity-generating, Social proof integrated. Examples for: Buttons, Email subject lines, Landing pages, Pop-ups"
                    }
                ]
            },
            {
                id: "storytelling",
                name: "Storytelling",
                icon: "📖",
                prompts: [
                    {
                        id: "short-story",
                        title: "Short Story Prompt",
                        content: "Write a short story (1000-1500 words) about [THEME]. Include: Compelling opening hook, Clear protagonist with goal, Conflict or obstacle, Rising tension, Climax, Resolution, Vivid sensory details, Show don't tell, Emotional resonance"
                    },
                    {
                        id: "worldbuilding",
                        title: "Fantasy World Building",
                        content: "Create a fantasy world setting for [TYPE OF STORY]. Define: Geography and climate, Magic system and rules, Political structure, Major cultures and societies, Historical context, Unique creatures or races, Economy and trade, Religious or belief systems, Current conflicts"
                    },
                    {
                        id: "character-backstory",
                        title: "Character Backstory",
                        content: "Develop a detailed character backstory for [CHARACTER TYPE]. Include: Name, age, appearance, Childhood and upbringing, Defining moment that shaped them, Core beliefs and values, Fears and insecurities, Goals and motivations, Relationships, Unique quirks or habits, Character arc potential"
                    },
                    {
                        id: "plot-twist",
                        title: "Plot Twist Generator",
                        content: "Generate unexpected plot twists for [GENRE] story. Provide: 5 unique plot twist ideas, Setup requirements for each, Foreshadowing suggestions, Impact on story and characters, How to execute without feeling forced, Genre-appropriate tone"
                    },
                    {
                        id: "dialogue-prompt",
                        title: "Dialogue Writing Prompt",
                        content: "Write a dialogue scene between [CHARACTER A] and [CHARACTER B] about [TOPIC]. Requirements: Show character personalities through speech patterns, Include subtext and underlying tension, Use beats and action tags, Avoid 'said' bookisms, Create realistic interruptions and pauses, Advance plot or deepen relationships, Each character has distinct voice"
                    }
,
            {
                id: "youtube-video",
                name: "YouTube & Video",
                icon: "🎬",
prompts: [
                    {
                        id: "youtube-script",
                        title: "YouTube Script",
                        content: "Write a YouTube video script for [TOPIC]. Structure: Hook (first 15 seconds), Introduction with value promise, Main content sections with timestamps, Examples or demonstrations, Call-to-action (subscribe, like, comment), Outro with next steps. Include: Visual cues, B-roll suggestions, On-screen text ideas, Engagement prompts"
                    },
                    {
                        id: "reel-hook",
                        title: "Short/Reel Hook Generator",
                        content: "Generate viral hooks for [TOPIC]. Create 10 variations using formulas: Pattern interrupt, Bold statement, Relatable problem, Surprising fact, Question hook, 'You're doing X wrong', Before/after setup, Curiosity gap. Each under 8 words, optimized for first 3 seconds"
                    },
                    {
                        id: "video-title",
                        title: "Video Title Generator",
                        content: "Generate click-worthy video titles for [TOPIC]. Provide: 10 title variations using proven formulas (How to, Listicle, vs., Secret/Hack, Mistake, Case study), Under 60 characters, Include power words, Balance curiosity and clarity, SEO keywords included, A/B test suggestions"
                    },
                    {
                        id: "thumbnail-text",
                        title: "Thumbnail Text Prompt",
                        content: "Create thumbnail text overlay for [VIDEO TOPIC]. Requirements: 3-5 words maximum, Large, bold, readable, Contrasting colors, Emotion-driven words, Complement the image, Create curiosity, Avoid clickbait, Include face if possible. Suggest: Text placement, Color schemes, Font style"
                    }
                ]
            },
            {
                id: "business-writing",
                name: "Business Writing",
                icon: "💼",
                prompts: [
                    {
                        id: "business-proposal",
                        title: "Business Proposal",
                        content: "Write a business proposal for [PROJECT/SERVICE]. Include: Executive summary, Problem statement, Proposed solution, Methodology or approach, Timeline and milestones, Budget breakdown, Team qualifications, Success metrics, Terms and conditions, Next steps. Professional, persuasive, data-driven"
                    },
                    {
                        id: "pitch-deck",
                        title: "Pitch Deck Outline",
                        content: "Create a pitch deck outline for [STARTUP/PROJECT]. Slides: Problem (1 slide), Solution (1-2 slides), Market opportunity (1 slide), Business model (1 slide), Traction (1 slide), Competition (1 slide), Team (1 slide), Financials (1-2 slides), Ask (1 slide). Each slide: Key message, Supporting data, Visual suggestions"
                    },
                    {
                        id: "startup-idea",
                        title: "Startup Idea Generator",
                        content: "Generate startup ideas for [INDUSTRY/MARKET]. For each idea provide: One-sentence pitch, Problem it solves, Target customer, Unique value proposition, Business model, Potential competitors, MVP features, Validation steps, Estimated market size, Key risks"
                    },
                    {
                        id: "problem-solution",
                        title: "Problem-Solution Framework",
                        content: "Develop problem-solution framework for [BUSINESS CHALLENGE]. Structure: Current state analysis, Specific problems identified, Root cause analysis, Proposed solutions (3-5 options), Pros and cons of each, Recommended solution with reasoning, Implementation roadmap, Success metrics, ROI estimation"
                    }
               ]
            }
                ]
            }
        ]
    },
    {
        id: "coding",
        name: "Coding & Tech",
        icon: "💻",
        description: "Developer prompts for code generation and learning",
        folders: [
            {
                id: "code-generation",
                name: "Code Generation",
                icon: "⚙️",
                prompts: [
                    {
                        id: "react-component",
                        title: "React Component Generator",
                        content: "Generate a React component for [COMPONENT PURPOSE]. Requirements: Use TypeScript with proper types, Functional component with hooks, Props interface defined, Responsive design, Accessibility (ARIA labels), Error handling, Loading states, Comments for complex logic, Clean and modular code"
                    },
                    {
                        id: "rest-api",
                        title: "REST API Boilerplate",
                        content: "Create a REST API for [RESOURCE]. Include: CRUD endpoints (GET, POST, PUT, DELETE), Request validation middleware, Error handling, Response formatting, Authentication middleware, Rate limiting, API documentation comments, Database model/schema, Example requests and responses"
                    },
                    {
                        id: "crud-app",
                        title: "CRUD App Prompt",
                        content: "Build a complete CRUD application for [ENTITY]. Include: Database schema, Backend API endpoints, Frontend forms and lists, Create/Read/Update/Delete operations, Form validation, Error messages, Success feedback, Search/filter functionality, Pagination, Responsive design"
                    },
                    {
                        id: "auth-logic",
                        title: "Authentication Logic Prompt",
                        content: "Implement authentication system with [AUTH METHOD]. Include: User registration with validation, Login with JWT tokens, Password hashing (bcrypt), Token refresh mechanism, Protected routes, Logout functionality, Password reset flow, Email verification, Session management, Security best practices"
                    },
                    {
                        id: "error-handling",
                        title: "Error Handling Prompt",
                        content: "Implement comprehensive error handling for [APPLICATION TYPE]. Include: Custom error classes, Global error handler, Error logging, User-friendly error messages, HTTP status codes, Validation errors, Database errors, Network errors, Graceful degradation, Error boundaries (React), Retry logic"
                    }
                ]
            },
            {
                id: "debugging",
                name: "Debugging",
                icon: "🐛",
                prompts: [
                    {
                        id: "debug-js-error",
                        title: "Debug JavaScript Error",
                        content: "Help debug this JavaScript error: [ERROR MESSAGE]. Provide: Likely causes of the error, Step-by-step debugging approach, Console.log strategies, Browser DevTools tips, Common pitfalls in this scenario, Code examples of fixes, Prevention strategies for future"
                    },
                    {
                        id: "optimize-code",
                        title: "Optimize Slow Code",
                        content: "Optimize this code for performance: [CODE SNIPPET]. Analyze: Time complexity, Space complexity, Bottlenecks, Suggest optimizations: Algorithm improvements, Data structure changes, Caching strategies, Lazy loading, Code splitting, Benchmarking approach, Before/after comparisons"
                    },
                    {
                        id: "explain-code",
                        title: "Explain Code Step-by-Step",
                        content: "Explain this code in detail: [CODE SNIPPET]. Break down: What each line does, How data flows, Why certain approaches were used, Potential edge cases, Dependencies and imports, Best practices applied, Alternative approaches, When to use/avoid this pattern"
                    },
                    {
                        id: "refactor-legacy",
                        title: "Refactor Legacy Code",
                        content: "Refactor this legacy code: [CODE SNIPPET]. Modernize: Use current best practices, Improve readability, Extract functions/modules, Add type safety, Remove code smells, Maintain backward compatibility, Add tests, Document changes, Migration guide if needed"
                    }
                ]
            },
            {
                id: "learning",
                name: "Learning",
                icon: "📚",
                prompts: [
                    {
                        id: "eli5-concept",
                        title: "Explain Concept Like I'm 5",
                        content: "Explain [TECHNICAL CONCEPT] like I'm 5 years old. Use: Simple analogies from everyday life, No jargon or technical terms, Visual metaphors, Real-world examples, Build understanding step-by-step, Then gradually introduce proper terminology, End with why it matters"
                    },
                    {
                        id: "interview-questions",
                        title: "Interview Question Generator",
                        content: "Generate interview questions for [TECHNOLOGY/ROLE]. Include: 5 junior-level questions (fundamentals), 5 mid-level questions (practical application), 5 senior-level questions (architecture/design), Behavioral questions, Coding challenges, System design question, Expected answers outline, Follow-up questions"
                    },
                    {
                        id: "coding-exercise",
                        title: "Coding Exercise Generator",
                        content: "Create a coding exercise for [SKILL LEVEL] in [LANGUAGE]. Include: Clear problem statement, Input/output examples, Edge cases to consider, Constraints, Hints for different skill levels, Multiple solution approaches, Time/space complexity targets, Test cases, Solution explanation"
                    },
                    {
                        id: "system-design",
                        title: "System Design Explanation",
                        content: "Explain how to design [SYSTEM] (e.g., URL shortener, chat app). Cover: Requirements gathering (functional & non-functional), High-level architecture diagram, Database schema, API design, Scalability considerations, Caching strategy, Load balancing, Failure handling, Tech stack recommendations, Trade-offs made"
                    }
,
            {
                id: "system-design",
                name: "System Design",
                icon: "🏗️",
                prompts: [
                    {
                        id: "scalable-system",
                        title: "Design Scalable System",
                        content: "Design a scalable system for [USE CASE]. Cover: Functional requirements, Non-functional requirements (scalability, availability, latency), High-level architecture, Database design (SQL vs NoSQL choice), API design, Caching strategy (Redis/Memcached), Load balancing approach, CDN usage, Monitoring and logging, Deployment strategy, Cost estimation"
                    },
                    {
                        id: "database-schema",
                        title: "Database Schema Prompt",
                        content: "Design database schema for [APPLICATION]. Include: Entity-relationship diagram, Table definitions with fields, Primary and foreign keys, Indexes for performance, Relationships (one-to-many, many-to-many), Normalization level (with justification), Sample queries, Scaling considerations, Migration strategy, Backup plan"
                    },
                    {
                        id: "api-architecture",
                        title: "API Architecture Prompt",
                        content: "Design API architecture for [SERVICE]. Define: REST vs GraphQL choice (with reasoning), Endpoint structure and naming, Request/response formats, Authentication and authorization, Rate limiting, Versioning strategy, Error handling, Pagination, Filtering and sorting, Documentation approach, Testing strategy"
                    }
                ]
            },
            {
                id: "ai-prompt-engineering",
                name: "AI / Prompt Engineering",
                icon: "🤖",
                prompts: [
                    {
                        id: "improve-prompt",
                        title: "Improve Prompt Prompt",
                        content: "Improve this AI prompt for better results: [ORIGINAL PROMPT]. Analyze: Current strengths and weaknesses, Ambiguities or unclear parts, Missing context. Provide improved version with: Clear role assignment, Specific instructions, Desired format, Constraints and guidelines, Examples if helpful, Output structure, Evaluation criteria"
                    },
                    {
                        id: "few-shot-prompt",
                        title: "Few-shot Prompt Generator",
                        content: "Create a few-shot prompt for [TASK]. Structure: Clear task description, 3-5 examples showing input→output pattern, Consistent formatting, Edge case example, New input for completion. Ensure: Examples are diverse, Pattern is clear, Format is consistent, Scales to similar tasks"
                    },
                    {
                        id: "chain-of-thought",
                        title: "Chain-of-Thought Prompt",
                        content: "Design chain-of-thought prompt for [COMPLEX TASK]. Include: Step-by-step reasoning requirement, 'Think through this systematically', Explicit intermediate steps, Work shown before final answer, Self-verification, Consider edge cases, Example with full reasoning chain. For: Math problems, Logic puzzles, Multi-step tasks"
                    },
                    {
                        id: "role-based-prompt",
                        title: "Role-based Prompt Generator",
                        content: "Create role-based prompt for [TASK]. Assign specific role: '[You are a ROLE]', Define expertise and perspective, Set tone and style, Provide context and constraints, Specify deliverable format, Include relevant terminology, Example: 'As a senior software architect...', 'As a kindergarten teacher...', 'As a financial advisor...'"
                    }
                ]
            }
                ]
            }
        ]
    },
    {
        id: "design",
        name: "Design & UI/UX",
        icon: "🎨",
        description: "Design prompts for interfaces and user experience",
        folders: [
            {
                id: "ui-design",
                name: "UI Design",
                icon: "🖥️",
                prompts: [
                    {
                        id: "dashboard-layout",
                        title: "Dashboard Layout Prompt",
                        content: "Design a dashboard for [APPLICATION TYPE]. Include: Navigation sidebar, Top header with user menu, Key metrics cards (3-5), Data visualization charts, Recent activity feed, Quick actions panel, Responsive grid layout, Dark/light mode support, Accessibility considerations, Modern design system"
                    },
                    {
                        id: "mobile-app-ui",
                        title: "Mobile App UI Prompt",
                        content: "Design mobile app UI for [APP PURPOSE]. Include: Splash screen, Onboarding flow (3-4 screens), Home screen layout, Navigation pattern (tab bar/drawer), Content screens, Forms and inputs, Empty states, Loading states, Error states, Gestures and interactions, iOS and Android considerations"
                    },
                    {
                        id: "landing-page-ui",
                        title: "Landing Page UI Prompt",
                        content: "Design a landing page for [PRODUCT/SERVICE]. Sections: Hero section with headline and CTA, Features section (3-6 key features), How it works (step-by-step), Social proof (testimonials/logos), Pricing table, FAQ accordion, Footer with links, Sticky header, Mobile-responsive, Fast loading"
                    },
                    {
                        id: "saas-app-ui",
                        title: "SaaS App UI Prompt",
                        content: "Design SaaS application interface for [TOOL PURPOSE]. Include: Login/signup flows, Main dashboard, Settings page, Billing/subscription page, Team management, Notifications center, User profile, Search functionality, Keyboard shortcuts, Onboarding tooltips, Empty states, Help center integration"
                    }
                ]
            },
            {
                id: "ux-writing",
                name: "UX Writing",
                icon: "✏️",
                prompts: [
                    {
                        id: "empty-state",
                        title: "Empty State Text",
                        content: "Write empty state copy for [FEATURE/PAGE]. Include: Friendly headline, Brief explanation of why it's empty, Clear call-to-action, Visual suggestion (icon/illustration), Encouraging tone, Help link if needed. Examples: Empty inbox, No results found, First-time user, No data yet"
                    },
                    {
                        id: "error-message",
                        title: "Error Message Copy",
                        content: "Write error messages for [SCENARIO]. Follow principles: Human-friendly language (no error codes alone), Explain what happened, Why it happened (if helpful), How to fix it, Apologetic but not overly formal, Provide support link, Action button with clear next step. For: 404 pages, Form errors, System errors, Network errors"
                    },
                    {
                        id: "onboarding-flow",
                        title: "Onboarding Flow Text",
                        content: "Write onboarding text for [PRODUCT]. Create: Welcome message, Feature highlights (3-5 screens), Value propositions, Interactive tooltips, Progress indicators, Skip option copy, Final CTA, Use: Conversational tone, Brief copy (under 20 words per screen), Action-oriented language, Benefits over features"
                    },
                    {
                        id: "tooltip-text",
                        title: "Tooltip Text Generator",
                        content: "Generate tooltip text for [FEATURE/UI ELEMENT]. Guidelines: Under 10 words if possible, Explain function clearly, When to use this feature, Keyboard shortcut if applicable, No jargon, Scannable, Helpful not obvious. Create tooltips for: Buttons, Icons, Form fields, Settings, Advanced features"
                    }
,
            {
                id: "branding",
                name: "Branding",
                icon: "🏷️",
                prompts: [
                    {
                        id: "brand-voice",
                        title: "Brand Voice Generator",
                        content: "Define brand voice for [COMPANY/PRODUCT]. Create: Voice characteristics (3-5 adjectives), Tone guidelines (formal/casual, serious/playful), Language dos and don'ts, Example phrases that fit the voice, How voice changes by channel, Messaging pillars (3-5 core themes), Sample social media posts, Do/Don't comparison table"
                    },
                    {
                        id: "visual-identity",
                        title: "Visual Identity Prompt",
                        content: "Design visual identity system for [BRAND]. Define: Color palette (primary, secondary, accent colors), Typography system (headings, body, accent fonts), Logo variations (primary, secondary, monochrome), Icon style, Photography style, Graphic elements and patterns, Spacing rules, Mood board references, Brand personality alignment"
                    },
                    {
                        id: "color-palette",
                        title: "Color Palette Generator",
                        content: "Generate color palette for [BRAND/PROJECT]. Provide: Primary color (with hex), Secondary colors (2-3), Accent colors (1-2), Neutral colors (grays), Color psychology reasoning, Accessibility check (AAA/AA), Usage guidelines (when to use each), Competitor differentiation, Light/dark mode variations, Example applications"
                    }
                ]
            },
            {
                id: "ux-research",
                name: "UX Research",
                icon: "🔍",
                prompts: [
                    {
                        id: "user-persona",
                        title: "User Persona Generator",
                        content: "Create user persona for [PRODUCT/SERVICE]. Include: Name and photo, Demographics (age, location, occupation), Psychographics (values, interests), Goals and motivations, Pain points and frustrations, Typical day scenario, Tech savviness, Preferred channels, Quote that captures their mindset, Behaviors and patterns, Jobs-to-be-done"
                    },
                    {
                        id: "ux-audit",
                        title: "UX Audit Prompt",
                        content: "Conduct UX audit of [PRODUCT/WEBSITE]. Evaluate: First impression and clarity, Navigation and information architecture, Visual hierarchy, Content readability, Interactive elements, Mobile responsiveness, Accessibility compliance, Performance and load times, Error handling, Conversion funnel. For each: Issue identified, Severity (low/medium/high), Recommended fix, Best practice reference"
                    },
                    {
                        id: "usability-test-plan",
                        title: "Usability Testing Plan",
                        content: "Create usability testing plan for [FEATURE/PRODUCT]. Include: Test objectives, Participant criteria (5-8 users), Recruitment method, Test scenarios and tasks (5-7 tasks), Success metrics, Pre-test questionnaire, Moderator script, Post-test questions (SUS, satisfaction), Recording setup, Analysis framework, Timeline and logistics"
                    }
                ]
            }
                ]
            }
        ]
    }
];

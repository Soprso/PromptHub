import type { PromptCategory } from "../../types/prompt";

export const marketingPrompts: PromptCategory[] = [

        {
        id: "content",
        name: "Content Creation Prompts",
        icon: "📱",
        description: "Free AI prompts for content creators, influencers, and media production",
        folders: [
            {
                id: "linkedin",
                name: "LinkedIn & Professional",
                icon: "💼",
                prompts: [
                    { id: "linkedin-post", title: "Professional LinkedIn Post Generator", content: "Write authority-building LinkedIn posts with strong hooks and engagement. Topic: [SUBJECT]. Post structure: **Hook** (first 2 lines, stop the scroll) - ask provocative question, share surprising stat, make bold statement. **Body** (value delivery) - share insight, tell story, provide framework, use line breaks for readability. **CTA** (call-to-action) - ask question, request opinion, encourage sharing. Format: Short paragraphs (2-3 lines max), use emojis sparingly, tag relevant people/companies. Tone: Professional but conversational, authentic, thought-leadership. Length: 150-300 words optimal. Example hook: 'I just turned down a $200K job offer. Here's why:' or '3 years ago I was fired. Today I run a 7-figure business. The difference?' Focus on: personal experience, actionable insights, storytelling, relatability." },
                    { id: "learning-journey", title: "Learning Journey LinkedIn Post", content: "Share authentic learning journeys that build trust and engagement. Learning: [WHAT YOU LEARNED]. Structure: **What you learned** - specific skill/insight. **Why you learned it** - context, motivation, problem you faced. **How you learned it** - resources, process, challenges overcome. **Results** - what changed, how you applied it, impact. **Lesson** - key takeaway for audience. Tone: Humble, authentic, vulnerable about struggles. Example: 'I spent 6 months learning system design. Here's what I wish I knew on day 1: [insights].' Include: specific resources (books, courses), mistakes made, timeline, before/after comparison. Avoid: humble bragging, making it seem easy, gatekeeping knowledge." },
                    { id: "opinion-post", title: "Opinion-Based Engagement Post", content: "Create opinionated posts that spark discussion and engagement. Opinion: [YOUR TAKE]. Framework: **State opinion clearly** - no hedging, be direct. **Provide reasoning** - why you believe this, evidence/experience. **Acknowledge counterargument** - show you've considered other views. **Invite discussion** - ask audience their perspective. Example: 'Unpopular opinion: Code reviews are overrated. Here's why: [reasons]. Change my mind.' or 'Hot take: You don't need a CS degree to be a great developer. Here's what matters more: [list].' Tone: Confident but not arrogant, open to debate, thought-provoking. Avoid: being inflammatory for clicks, dismissing other views, political/controversial topics unrelated to your niche." },
                    { id: "brand-story", title: "Personal Brand Story Post", content: "Tell personal stories that strengthen your brand and connect with audience. Story: [EXPERIENCE]. Storytelling structure: **Setup** - where you were, the challenge/situation. **Conflict** - what went wrong, the struggle, the turning point. **Resolution** - how you overcame it, what you learned. **Lesson** - how audience can apply this. Make it: Specific (names, dates, details), emotional (how you felt), visual (paint the picture), relatable (common struggle). Example: 'My first code review was brutal. The senior dev left 47 comments. I almost quit. Here's what I learned about feedback: [insights].' Avoid: making yourself the hero, vague platitudes, stories without clear lesson." },
                    { id: "brand-voice", title: "Personal Brand Voice Definer", content: "Define consistent personal brand voice for content. Current content: [EXAMPLES]. Brand voice framework: 1) **Core values** - what you stand for (authenticity, innovation, helping others), 2) **Expertise areas** - your niche topics, 3) **Tone** - professional/casual, serious/humorous, formal/conversational, 4) **Unique angle** - what makes your perspective different, 5) **Audience** - who you're speaking to, their level. Create: Voice guidelines (do's and don'ts), example phrases, topics to cover/avoid, posting frequency. Example: 'Voice: Conversational expert. I explain complex tech simply, share real failures, and always include actionable takeaways. I avoid: jargon, humble bragging, generic advice.' Consistency builds recognition and trust." }
                ]
            },
            {
                id: "social-media",
                name: "Social Media Content",
                icon: "📸",
                prompts: [
                    { id: "reel-hooks", title: "Instagram Reel Hook Generator", content: "Generate scroll-stopping hooks for short-form video content. Topic: [VIDEO TOPIC]. Hook types: **Question hooks** - 'Want to know the #1 mistake developers make?' **Stat hooks** - '87% of programmers don't know this trick' **Challenge hooks** - 'I tried coding for 100 days straight. Here's what happened' **Listicle hooks** - '5 VS Code extensions that will change your life' **Curiosity hooks** - 'This one line of code saved me 10 hours' **Controversial hooks** - 'Stop using React. Here's why.' First 3 seconds are critical. Use: text overlay, visual interest, promise of value. Test multiple hooks for same content." },
                    { id: "video-script", title: "Short-Form Video Script Writer", content: "Write concise, engaging scripts for TikTok/Reels/Shorts. Topic: [SUBJECT]. Length: 30-60 seconds. Script structure: **Hook (0-3s)** - grab attention immediately. **Promise (3-5s)** - what they'll learn. **Content (5-50s)** - deliver value in quick tips/steps. **CTA (50-60s)** - like, follow, comment. Format: Short sentences, conversational tone, on-screen text for key points. Example: 'Hook: This debugging trick will save you hours. Promise: I'm going to show you 3 steps. Content: 1) Use console.log strategically 2) Check network tab 3) Reproduce consistently. CTA: Follow for more dev tips!' Keep: fast-paced, visual, one clear takeaway." },
                    { id: "educational-reels", title: "Educational Reel Idea Generator", content: "Generate educational content ideas for short-form video. Niche: [YOUR EXPERTISE]. Idea formats: **Tutorial** - 'How to [SKILL] in 60 seconds' **Myth-busting** - 'Common misconception about [TOPIC]' **Before/After** - 'My code before vs after learning [CONCEPT]' **Tool showcase** - 'This [TOOL] feature you didn't know existed' **Mistake breakdown** - 'I made this error so you don't have to' **Quick tips** - '3 ways to improve [SKILL]' **Comparison** - '[OPTION A] vs [OPTION B] explained' Generate 10 ideas with hooks, key points, and visual suggestions. Focus on: actionable value, quick wins, relatable problems." },
                    { id: "viral-caption", title: "Viral Caption Generator", content: "Write short, high-impact captions that drive engagement. Post: [DESCRIBE CONTENT]. Caption formula: **Hook line** - attention-grabbing first sentence. **Value** - 1-2 sentences of insight/story. **CTA** - clear action (save this, tag someone, share your experience). Length: 50-150 characters for maximum impact. Use: line breaks, emojis strategically, relevant hashtags (3-5). Examples: 'This changed everything for me. [insight]. Try it and let me know ↓' or 'Wish I knew this 3 years ago: [tip]. Save this for later 📌' Tone: Conversational, direct, valuable. Test: questions vs statements, different CTAs." },
                    { id: "hook-variations", title: "Content Hook Variations", content: "Generate multiple hook variations for A/B testing. Content: [TOPIC/POST]. Create 10 different hooks: 1) Question format, 2) Stat/number format, 3) Controversial statement, 4) Personal story, 5) 'How to' format, 6) Mistake/lesson format, 7) Comparison format, 8) Time-based (X days/years ago), 9) Curiosity gap, 10) Direct benefit. Example for 'Learning Python' topic: 'Why is Python so popular?' / '73% of developers use Python' / 'Python is overrated. Here's why I still use it' / 'I learned Python in 30 days' / 'How to learn Python faster' / 'My biggest Python mistake' / 'Python vs JavaScript' / '3 years ago I couldn't code. Now I build AI apps with Python' / 'The Python feature nobody talks about' / 'Learn Python and 10x your career'. Test and measure engagement." },
                    { id: "engagement-caption", title: "High-Engagement Caption Writer", content: "Write captions that drive comments, saves, and shares. Post: [CONTENT]. Engagement tactics: **Ask questions** - 'What's your experience with this?' **Request opinions** - 'Agree or disagree?' **Tag a friend** - 'Tag someone who needs this' **Fill in blank** - 'My favorite tool is ___' **Share experience** - 'Drop your story below' **Debate** - 'Hot take: [opinion]. Thoughts?' **Save prompt** - 'Save this for later when you need it' Structure: Hook + Value + Engagement CTA. Use: emojis for visual breaks, line breaks for readability, conversational tone. Example: 'Just discovered this VS Code shortcut 🤯 Saves me 2 hours every week. What's your favorite shortcut? Drop it below 👇' Algorithm favors: comments > saves > shares > likes." },
                    { id: "cta-optimizer", title: "CTA Optimization Assistant", content: "Improve call-to-action effectiveness in content. Current CTA: [PASTE]. CTA types: **Engagement** - 'Comment below', 'Share your thoughts', 'Tag someone' **Save** - 'Save this for later', 'Bookmark for reference' **Follow** - 'Follow for more tips', 'Join 10K developers' **Click** - 'Link in bio', 'Swipe up', 'Check comments' **Share** - 'Send this to a friend', 'Share if you agree' Best practices: Be specific ('Comment your favorite tool' not 'Comment below'), create urgency ('Limited spots'), show benefit ('Follow for daily tips'), make it easy (one clear action). Test: question CTAs vs command CTAs, single vs multiple CTAs. Place: end of caption, mid-content, pinned comment." }
                ]
            },
            {
                id: "blogging",
                name: "Blogging & Long-Form",
                icon: "✍️",
                prompts: [
                    { id: "blog-outline", title: "Blog Outline Generator", content: "Create structured, comprehensive blog outlines. Topic: [BLOG TOPIC]. Target length: [WORDS]. Outline structure: **Title** - compelling, SEO-friendly, includes keyword. **Introduction** (10%) - hook, problem statement, what reader will learn, why it matters. **Main sections** (80%) - 3-5 major points, each with subsections, examples, data. **Conclusion** (10%) - summary, key takeaways, CTA. For each section: Main point, supporting details, examples/data, transition to next. Example: Title: 'Complete Guide to React Hooks'. Intro: Why hooks changed React. Section 1: useState basics. Section 2: useEffect explained. Section 3: Custom hooks. Section 4: Common mistakes. Conclusion: Next steps. Include: keyword placement, internal links, images/diagrams needed." },
                    { id: "idea-to-blog", title: "Idea to Blog Converter", content: "Convert rough ideas into full blog posts. Idea: [ROUGH CONCEPT]. Expansion process: 1) **Clarify angle** - what's the unique perspective? 2) **Define audience** - who is this for, what's their level? 3) **Outline structure** - intro, main points, conclusion. 4) **Add depth** - examples, code snippets, visuals, data. 5) **Optimize for SEO** - keywords, meta description, headings. 6) **Write** - conversational tone, short paragraphs, scannable. Example: Idea: 'Async/await is confusing' → Blog: 'Async/Await Explained: A Complete Guide for Beginners' with sections on promises, syntax, error handling, real examples, common mistakes. Length: 1500-2500 words for depth. Include: actionable takeaways, code examples, further reading." },
                    { id: "seo-blog", title: "SEO-Friendly Blog Structurer", content: "Optimize blog structure for search engines and readability. Blog draft: [PASTE]. SEO optimization: **Title tag** - 60 chars, include primary keyword. **Meta description** - 155 chars, compelling, keyword-rich. **URL slug** - short, descriptive, keyword. **Headings** - H1 (title), H2 (main sections), H3 (subsections), include keywords naturally. **Content** - keyword density 1-2%, LSI keywords, internal links, external authoritative links. **Images** - alt text with keywords, compressed, descriptive filenames. **Readability** - short paragraphs (3-4 lines), bullet points, bold key terms, transition words. **Schema markup** - article schema, FAQ schema if applicable. Tools: Yoast, Surfer SEO, Ahrefs. Target: featured snippet, 'People also ask'." },
                    { id: "clarity-rewrite", title: "Rewrite Blog for Clarity", content: "Improve blog clarity and readability without losing depth. Original text: [PASTE]. Clarity improvements: 1) **Simplify sentences** - break long sentences, remove jargon or explain it, active voice. 2) **Improve structure** - logical flow, clear transitions, one idea per paragraph. 3) **Add examples** - concrete illustrations of abstract concepts. 4) **Visual hierarchy** - headings, bullet points, bold key terms. 5) **Remove fluff** - cut unnecessary words, get to point faster. Before: 'The utilization of asynchronous programming paradigms facilitates non-blocking operations.' After: 'Async programming lets your code run without waiting. Here's how it works: [example].' Readability score: aim for grade 8-10 (Hemingway App). Keep: technical accuracy, depth, personality." },
                    { id: "content-editing", title: "Content Editing Assistant", content: "Edit content professionally for grammar, style, and impact. Content: [PASTE]. Editing checklist: **Grammar** - spelling, punctuation, subject-verb agreement. **Style** - consistent tense, voice, tone. **Clarity** - remove ambiguity, simplify complex sentences. **Conciseness** - eliminate redundancy, tighten prose. **Flow** - smooth transitions, logical progression. **Impact** - strong verbs, active voice, compelling examples. **Consistency** - terminology, formatting, capitalization. Provide: tracked changes, explanation of major edits, readability score, suggestions for improvement. Use: Grammarly, Hemingway, ProWritingAid. Focus on: maintaining author's voice while improving clarity and professionalism." }
                ]
            },
            {
                id: "repurposing",
                name: "Content Repurposing",
                icon: "♻️",
                prompts: [
                    { id: "blog-to-linkedin", title: "Blog to LinkedIn Converter", content: "Repurpose blog posts into engaging LinkedIn content. Blog: [PASTE/LINK]. Conversion strategy: **Extract key insight** - one main takeaway from blog. **Rewrite for LinkedIn** - conversational tone, shorter, personal angle. **Structure** - hook (2 lines), value (3-5 points), CTA. **Add context** - why this matters, your experience. Example: Blog: '5000-word guide to React hooks' → LinkedIn: 'I just spent 2 weeks mastering React hooks. Here are the 3 concepts that clicked for me: [list]. Full guide in comments.' Create: 3-5 LinkedIn posts from one blog, each highlighting different angle. Include: link to full blog (in comments to avoid algorithm penalty), relevant hashtags, tag mentioned tools/people." },
                    { id: "video-to-text", title: "Video to Text Converter", content: "Convert video content into written posts and articles. Video: [LINK/TRANSCRIPT]. Conversion process: 1) **Transcribe** - use Otter.ai, Rev, or YouTube auto-captions. 2) **Clean up** - remove filler words, fix grammar, organize thoughts. 3) **Structure** - add headings, break into sections, bullet points. 4) **Enhance** - add context, examples, links that weren't in video. 5) **Optimize** - SEO keywords, meta description, images. Formats: Blog post (long-form), LinkedIn article, Twitter thread, Instagram carousel. Example: 30-min tutorial video → 2000-word blog post + 10-post Twitter thread + LinkedIn article. Benefits: reach different audiences, improve SEO, evergreen content." },
                    { id: "long-to-shorts", title: "Long Content to Shorts Generator", content: "Break long-form content into bite-sized pieces for social media. Long content: [BLOG/VIDEO/PODCAST]. Micro-content strategy: **Identify quotable moments** - key insights, surprising stats, actionable tips. **Create formats** - Quote graphics, Carousel posts (Instagram/LinkedIn), Twitter threads, TikTok/Reels, Infographics. **Maintain context** - each piece should standalone but link back to full content. Example: 3000-word blog → 10 quote graphics, 1 carousel post (10 slides), 1 Twitter thread (8 tweets), 3 short videos. Tools: Canva for graphics, Kapwing for video clips. Schedule: drip content over weeks, test different formats, track engagement." },
                    { id: "multi-platform", title: "Multi-Platform Content Adapter", content: "Adapt single piece of content for multiple platforms. Original content: [DESCRIBE]. Platform adaptations: **LinkedIn** - professional tone, 150-300 words, business value, document/carousel. **Twitter** - thread format, punchy, 280 chars per tweet, visuals. **Instagram** - visual-first, carousel or reel, short caption, hashtags. **TikTok/Reels** - video, 30-60s, hook in first 3s, trending audio. **Blog** - long-form, SEO-optimized, 1500+ words, detailed. **YouTube** - video tutorial, 10-15 min, chapters, description with timestamps. **Newsletter** - personal tone, story format, exclusive insights. Tailor: tone, length, format, CTA for each platform. Maintain: core message, brand voice." },
                    { id: "content-calendar", title: "Content Calendar Planner", content: "Create structured content calendar for consistent posting. Goals: [OBJECTIVES]. Timeframe: [DURATION]. Calendar structure: **Frequency** - how often per platform (LinkedIn 3x/week, Twitter daily, etc.). **Content pillars** - 3-5 themes to rotate (tutorials, personal stories, industry news, tips, case studies). **Format mix** - text posts, videos, carousels, threads, blogs. **Planning** - batch create content, schedule in advance, leave room for trending topics. **Tracking** - engagement metrics, best performing content types, optimal posting times. Template: Week 1: Monday (LinkedIn tutorial), Tuesday (Twitter tips), Wednesday (Blog post), Thursday (Instagram reel), Friday (LinkedIn story). Tools: Notion, Trello, Buffer, Later. Review monthly: what worked, what didn't, adjust strategy." }
                ]
            },
            {
                id: "copywriting",
                name: "Copywriting & Editing",
                icon: "✏️",
                prompts: [
                    { id: "boring-copy", title: "Rewrite Boring Copy", content: "Transform dull copy into engaging, compelling content. Original: [PASTE BORING COPY]. Rewrite techniques: 1) **Stronger verbs** - replace weak verbs (is, has, does) with action verbs (transforms, accelerates, eliminates). 2) **Specific details** - replace vague terms with concrete numbers, examples. 3) **Active voice** - subject performs action. 4) **Sensory language** - help reader see, feel, experience. 5) **Cut fluff** - remove unnecessary words, get to point. Before: 'Our product is good and helps people do things better.' After: 'Cut your workflow time by 50% with automated task management that learns your patterns.' Show: benefit over feature, specificity over generality, action over description." },
                    { id: "tone-adjustment", title: "Tone Adjustment Assistant", content: "Adjust content tone without changing core message. Content: [PASTE]. Target tone: [FORMAL/CASUAL/PROFESSIONAL/FRIENDLY/AUTHORITATIVE]. Tone elements: **Word choice** - formal (utilize, commence) vs casual (use, start). **Sentence length** - formal (longer, complex) vs casual (short, punchy). **Contractions** - casual uses them, formal avoids. **Personal pronouns** - casual (you, I, we) vs formal (one, the user). **Humor/emotion** - casual includes, formal minimizes. Examples: Formal: 'It is recommended that one utilize this methodology.' Casual: 'You should try this approach.' Professional-friendly: 'We recommend using this method.' Maintain: key information, accuracy, message. Adjust: vocabulary, sentence structure, personality." }
                ]
            }
        ]
    },
        {
        id: "email-communication-prompts",
        name: "Email Marketing & Communication Scripts",
        icon: "📧",
        description: "Templates for professional emails, responses, and customer communication",
        folders: [
            {
                id: "cold-email-responses",
                name: "Cold Email & Response Templates",
                icon: "reply",
                prompts: [
                    { id: "client-response", title: "Professional Client Response", content: "Draft a polite and professional email response to a client who is asking for [specific request/feature] that is currently out of scope or delayed. Acknowledge their request, explain the situation clearly without being defensive, propose a reasonable alternative or timeline, and maintain a positive, helpful tone. Ensure the email preserves the relationship while setting firm boundaries." },
                    { id: "negotiation-email", title: "Negotiation Counter-Offer", content: "Write a negotiation email responding to a salary offer or contract proposal of [amount]. Express gratitude for the offer, clearly state your counter-proposal of [amount/terms], and justify it with 3 key value points or market data. Maintain a collaborative and professional tone that invites further discussion rather than issuing an ultimatum." },
                    { id: "cold-outreach", title: "Cold Outreach Email", content: "Compose a cold email to a potential [client/partner] at [company]. The goal is to [specific goal: schedule a call, get feedback, introduce product]. Use a catchy but professional subject line. Keep the body concise (under 150 words), focusing on their pain points and your unique value proposition. End with a clear, low-friction call strictly to action (CTA)." }
                ]
            },
            {
                id: "customer-support-scripts",
                name: "Customer Support & Service Scripts",
                icon: "🎧",
                prompts: [
                    { id: "angry-customer", title: "Response to Angry Customer", content: "Write an empathetic response to a customer who is angry about [issue: delayed shipping, bug, billing error]. Follow the HEARD framework (Hear, Empathize, Apologize, Resolve, Diagnose). Acknowledge their frustration legitimately, apologize for the specific inconvenience, explain the immediate solution you are providing, and offer a gesture of goodwill (refund, credit, discount) to restore trust." },
                    { id: "feature-request", title: "Feature Request Response", content: "Draft a response to a user requesting a feature that is [not on roadmap / planned for later]. Thank them for the feedback, explain why it's not currently prioritized (focusing on current goals), and if possible, offer a workaround. Tag them as a 'beta tester' for future updates to make them feel valued." }
                ]
            },
            {
                id: "social-media-chat",
                name: "Social Media Chat & DM Scripts",
                icon: "💬",
                prompts: [
                    { id: "chatbot-flow", title: "Chatbot Conversation Flow", content: "Design a conversation script for a customer support chatbot handling [inquiry type: refund returns, tracking]. Map out specific user inputs and bot responses. Include branches for 'Order not found', 'Eligible for return', and 'Escalate to human agent'. Ensure the bot's tone is helpful, concise, and on-brand." },
                    { id: "social-reply", title: "Social Media Comment Reply", content: "Write a short, engaging reply to a [positive/negative] comment on a social media post about [topic]. For positive: show appreciation and encourage further engagement. For negative: address the concern publicly and professionally, then move the conversation to DM for resolution." }
                ]
            },
            {
                id: "internal-communication-docs",
                name: "Internal Communications & Documentation",
                icon: "📝",
                prompts: [
                    { id: "faq-generation", title: "FAQ Generator", content: "Generate a list of 10 Frequently Asked Questions (FAQs) and answers for [product/service]. Cover topics like pricing, refund policy, core features, troubleshooting, and account management. Write in a clear, user-friendly 'How-to' style." },
                    { id: "proposal-writing", title: "Project Proposal", content: "Draft a comprehensive project proposal for [project name]. Include sections: Executive Summary, Problem Statement, Proposed Solution (Scope of Work), Timeline/Milestones, Budget/Pricing, and Terms & Conditions. The tone should be persuasive and professional." }
                ]
            }
        ]
    },
        {
        id: "marketing-growth-prompts",
        name: "Marketing Strategy & Growth Hacking",
        icon: "📈",
        description: "Strategies for content, ads, social media, and detailed analytics",
        folders: [
            {
                id: "content-marketing-strategy",
                name: "Content Marketing Strategy",
                icon: "✍️",
                prompts: [
                    { id: "blog-post-outline", title: "SEO Blog Post Outline", content: "Create a detailed SEO-optimized blog post outline for the keyword '[keyword]'. dedicated to [target audience]. Include H1, H2, and H3 headings. Suggest bullet points for each section. Recommend internal linking opportunities and a meta description promoting high CTR." },
                    { id: "social-calendar", title: "Social Media Content Calendar", content: "Develop a 1-week social media content calendar for [brand/niche]. Platforms: [LinkedIn, Twitter, Instagram]. For each day, specify: Post Topic, Format (Video/Image/Text), Main Hook, Caption Draft, and Relevant Hashtags. Balance promotional, educational, and entertaining content." },
                    { id: "copywriting-frameworks", title: "Copywriting (AIDA/PAS)", content: "Write three variations of ad copy for [product] using different copywriting frameworks: 1. AIDA (Attention, Interest, Desire, Action), 2. PAS (Problem, Agitation, Solution), 3. BAB (Before, After, Bridge). Highlight the unique selling points effectively in each." }
                ]
            },
            {
                id: "advertising-copy-ads",
                name: "Advertising Copy & Ad Creatives",
                icon: "📢",
                prompts: [
                    { id: "fb-ad-creative", title: "Facebook Ad Creative Brief", content: "Write a creative brief for a Facebook/Instagram ad campaign promoting [product]. Define: Target Audience, Campaign Objective, Visual Style (Video/Image suggestions), Primary Text, Headline and CTA. Include ideas for 3 distinct hooks to test (e.g., social proof, problem/solution, fear of missing out)." },
                    { id: "video-script-promo", title: "Promotional Video Script", content: "Write a 60-second script for a promotional video for [product/service]. Structure: 0-5s Hook (grab attention), 5-20s Problem Agitation, 20-40s Solution/Demo, 40-50s Social Proof/Benefits, 50-60s Strong Call to Action. Include visual cues and voiceover text." }
                ]
            },
            {
                id: "growth-marketing-analytics",
                name: "Growth Marketing & Analytics",
                icon: "📊",
                prompts: [
                    { id: "campaign-analysis", title: "Campaign Performance Analysis", content: "Analyze the provided campaign data [insert data or metrics]. detailed breakdown of CPA, ROAS, CTR, and Conversion Rate. Identify underperforming ad sets and winning creatives. Provide 3 actionable recommendations to optimize the budget for the next phase." },
                    { id: "lead-scoring", title: "Lead Qualification Framework", content: "Design a lead scoring model for [business type]. Define explicit criteria (job title, company size, budget) and implicit criteria (website visits, content downloads, email opens). Assign point values to each to categorize leads into Hot (Sales Ready), Warm (Nurture), and Cold." },
                    { id: "customer-segmentation", title: "Customer Segmentation Strategy", content: "Develop a customer segmentation strategy for [business]. Identify 3-4 key personas based on demographics, psychographics, and behavioral data. For each segment, propose a tailored marketing message and preferred channel of communication." }
                ]
            }
        ]
    },
        {
        id: "market-research-analysis",
        name: "Market Research & Strategic Analysis",
        icon: "🧠",
        description: "Market research, user experience studies, and data analysis guides",
        folders: [
            {
                id: "market-trend-analysis",
                name: "Market Trend Analysis & Research",
                icon: "🌐",
                prompts: [
                    { id: "market-research-education", title: "EdTech Market Analysis", content: "Conduct a market research analysis on the current state of the EdTech industry. Identify key trends (e.g., AI tutors, micro-learning), major competitors, and underserved market segments. Analyze the impact of remote learning shifts. Provide data-backed predictions for growth in the next 3 years." },
                    { id: "market-research-healthcare", title: "Healthcare/MedTech Analysis", content: "Analyze the [HealthTech/Telemedicine] market landscape. Focus on regulatory challenges, adoption barriers for patients/doctors, and emerging technologies (IoT, AI diagnostics). SWOT analysis of entering this market with a new [product idea]." },
                    { id: "market-research-saas", title: "SaaS Vertical Analysis", content: "Research the competitive landscape for [specific SaaS niche, e.g., Project Management Tools]. Map out the 'Red Ocean' (saturated features) and 'Blue Ocean' (innovation opportunities). Analyze pricing strategies and feature sets of top 5 competitors to identify a unique value proposition." },
                    { id: "market-research-finance", title: "FinTech Market Review", content: "Evaluate the current trends in [FinTech sector, e.g., DeFi, Neobanks, Personal Finance]. deep dive into user trust factors, security regulations, and demographic adoption rates. Identify opportunities for a product focused on [specific financial goal]." }
                ]
            },
            {
                id: "user-experience-research",
                name: "User Experience (UX) Research",
                icon: "👤",
                prompts: [
                    { id: "usability-study-plan", title: "Usability Study Plan", content: "Create a plan for a moderated usability study of [feature/website]. Define research questions, participant recruitment criteria, and task scenarios. Draft a script for the moderator including pre-test interview questions and post-task usability ratings (SEQ/SUS)." },
                    { id: "user-persona", title: "User Persona Creation", content: "Develop 2 detailed user personas for [app/service]. Include: Demographics, Bio, Goals/Motivations, Frustrations/Pain Points, Tech Savviness, and Brands they trust. Use these to justify design decisions for [specific feature]." }
                ]
            },
            {
                id: "data-analysis-reporting",
                name: "Data Analysis & Reporting",
                icon: "📉",
                prompts: [
                    { id: "data-analysis-report", title: "Data Analysis Report", content: "Structure a professional data analysis report based on [dataset description]. Sections: Executive Summary, Methodology, Key Findings (with visualization suggestions), insights interpretation, and Strategic Recommendations. Ensure the tone is objective and data-driven." },
                    { id: "competitor-report", title: "Competitor Analysis Report", content: "Write a comprehensive competitor analysis report comparing [My Brand] vs [Competitor A] and [Competitor B]. Compare: Product Features, UX/UI, Pricing, Marketing Strategy, and Customer Sentiment (reviews). Conclude with a 'gap analysis' of opportunities." }
                ]
            }
        ]
    },
        {
        id: "ecommerce-product-prompts",
        name: "E-commerce & Product Management",
        icon: "🛍️",
        description: "Product descriptions, personalization, and website optimization",
        folders: [
            {
                id: "product-descriptions-copy",
                name: "Product Descriptions & Copywriting",
                icon: "🏷️",
                prompts: [
                    { id: "product-description", title: "SEO Product Description", content: "Write a persuasive, SEO-friendly product description for [product name]. Highlight key features (Material, Size, Tech specs) and translate them into benefits (Why it matters). Use sensory words to help the customer visualize using it. Include a bulleted list for readability and target keywords: [list keywords]." },
                    { id: "product-categorization", title: "Catalog Categorization", content: "Propose a logical category taxonomy for an e-commerce store selling [niche]. Structure high-level categories (L1), sub-categories (L2), and filters (L3 attributes like size, color, brand). Ensure the structure is intuitive for user navigation and SEO-friendly." }
                ]
            },
            {
                id: "customer-personalization",
                name: "Customer Personalization Strategies",
                icon: "🎯",
                prompts: [
                    { id: "recommendation-logic", title: "Recommendation Engine Logic", content: "Design the logic for product recommendations on a [fashion/electronics] e-commerce site. Define rules for: 'Frequently Bought Together' (cross-sell), 'You May Also Like' (upsell/alternative), and 'Recently Viewed'. base logic on user behavior, purchase history, and product attributes." },
                    { id: "personalized-offers", title: "Personalized Offer Strategy", content: "Create a strategy for dynamic personalized offers. Example: 'If user abandons cart > send 10% off email'; 'If user buys running shoes > show ad for running socks'. Map out 5 key user triggers and the corresponding personalized incentive to maximize conversion." }
                ]
            },
            {
                id: "conversion-rate-optimization",
                name: "Conversion Rate Optimization (CRO)",
                icon: "⚡",
                prompts: [
                    { id: "landing-page-audit", title: "Landing Page CRO Audit", content: "Critique the provided landing page [link/description] for Conversion Rate Optimization. Analyze: Headline clarity, Hero image relevance, Trust signals, Form friction, and Call-to-Action visibility. Propose 3 specific A/B tests to improve the conversion rate." },
                    { id: "checkout-flow", title: "Checkout Flow Optimization", content: "Map out an ideal friction-free checkout process for mobile users. Address: Guest checkout, auto-fill address, payment options (Apple Pay/PayPal), progress indicators, and trust badges. Identify common drop-off points and how to fix them." }
                ]
            }
        ]
    }];

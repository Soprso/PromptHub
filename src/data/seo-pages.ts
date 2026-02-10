export interface SeoPageData {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    intro: string;
    prompts: {
        title: string;
        content: string;
        tags?: string[];
    }[];
    cta: string;
}

export const seoPages: SeoPageData[] = [
    {
        slug: "how-to-write-better-prompts",
        title: "How to Write Better AI Prompts (Step-by-Step Guide)",
        metaTitle: "How to Write Better AI Prompts: The Ultimate Guide for 2024",
        metaDescription: "Learn the secrets of prompt engineering. Disocver proven formulas, templates, and tips to get the best results from ChatGPT, Claude, and Midjourney.",
        intro: "Mastering the art of prompt engineering is the key to unlocking the full potential of AI. Whether you're using ChatGPT for writing, Midjourney for art, or Claude for coding, the quality of your output depends entirely on the quality of your input. In this guide, we've compiled the most effective prompt structures and examples to help you go from zero to pro.",
        prompts: [
            // --- Frameworks ---
            {
                title: "The CO-STAR Framework",
                content: "Context: [Insert Context]\nObjective: [Insert Goal]\nStyle: [Insert Style]\nTone: [Insert Tone]\nAudience: [Insert Audience]\nResponse: [Insert Format]",
                tags: ["Framework", "Structure", "Popular"]
            },
            {
                title: "The CARE Framework",
                content: "Context: Give the AI background information.\nAction: Define clearly what you want it to do.\nResult: Describe the desired output format.\nExample: Provide an example of good output."
            },
            {
                title: "The R-T-F (Role-Task-Format) Formula",
                content: "Role: Act as a [Role].\nTask: Your task is to [Task].\nFormat: Provide the answer in [Format, e.g., bullet points, table, code]."
            },
            {
                title: "Chain of Thought Prompting",
                content: "I want you to solve this problem step-by-step. For each step, explain your reasoning before moving to the next one. Finally, provide the conclusion based on the steps above.",
                tags: ["Reasoning", "Logic", "Advanced"]
            },
            // --- Role-Playing ---
            {
                title: "Expert Persona: Python Developer",
                content: "Act as a Senior Python Developer with 15 years of experience. Write a clean, efficient script to [Task]. Explain your code using comments and follow PEP 8 standards."
            },
            {
                title: "Expert Persona: Marketing Strategist",
                content: "You are a world-class Digital Marketing Strategist. Create a 3-month launch plan for a new [Product]. Focus on organic growth channels and viral loops."
            },
            {
                title: "Expert Persona: Legal Consultant",
                content: "Act as a corporate lawyer. Review the following contract clause and highlight potential risks for a freelancer: [Insert Clause]."
            },
            {
                title: "The 'Devil's Advocate' Persona",
                content: "I am going to present an idea. I want you to act as a critical skeptic. Analyze my idea and list 5 reasons why it might fail, and then offer solutions for each flaw."
            },
            // --- Instructional ---
            {
                title: "Few-Shot Prompting (Sentiment Analysis)",
                content: "Classify the sentiment of these reviews:\n\nReview: \"The food was cold.\"\nSentiment: Negative\n\nReview: \"I loved the ambiance!\"\nSentiment: Positive\n\nReview: \"Service was okay, but slow.\"\nSentiment: Neutral\n\nReview: [Insert New Review]\nSentiment:"
            },
            {
                title: "Few-Shot Prompting (Style Imitation)",
                content: "Here are examples of my writing style:\n\nExample 1: [Insert Text]\nExample 2: [Insert Text]\n\nNow, write a new paragraph about [Topic] mimicking this exact style."
            },
            {
                title: "Step-by-Step Tutorials",
                content: "Write a beginner-friendly, step-by-step tutorial on how to [Task]. Use numbered lists, bold key terms, and explain 'why' we are doing each step."
            },
            {
                title: "Explain Like I'm 5 (ELI5)",
                content: "Explain the concept of [Complex Topic, e.g., Quantum Computing] to a 5-year-old. Use simple analogies and avoid jargon."
            },
            // --- Analysis & Refinement ---
            {
                title: "Critique and Improve",
                content: "Critique the following text for clarity, tone, and persuasion. Then, rewrite it to be more compelling.\n\nText: [Insert Text]"
            },
            {
                title: "Find and Fix Errors",
                content: "Scan the following code/text for errors. List the errors you found, explain why they are wrong, and provide the corrected version.\n\nInput: [Insert Input]"
            },
            {
                title: "Summarize with Constraints",
                content: "Summarize the following article in exactly 3 sentences. Focus on the main argument and the conclusion.\n\nArticle: [Insert Article]"
            },
            {
                title: "Extract Key Information",
                content: "Extract the following details from the text below and present them in a JSON format: Name, Date, Location, and Key Outcome.\n\nText: [Insert Text]"
            },
            // --- Creativity ---
            {
                title: "Brainstorming Assistant",
                content: "Generate 20 unique and creative ideas for [Project/Topic]. Prioritize unconventional and 'out of the box' thinking."
            },
            {
                title: "The 'SCAMPER' Framework",
                content: "Use the SCAMPER method (Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse) to innovative on [Product/Idea]."
            },
            {
                title: "Metaphor Generator",
                content: "Come up with 5 creative metaphors to explain [Concept] to an audience of [Target Audience]."
            },
            {
                title: "Socratic Method",
                content: "I want to learn about [Topic]. Use the Socratic method to teach me. Ask me one question at a time to guide me to the answer, rather than just telling me."
            },
            // --- Advanced ---
            {
                title: "Self-Consistency",
                content: "Generate three different possible solutions to this problem. Then, compare them, evaluate their pros and cons, and synthesize the best final answer."
            },
            {
                title: "Tree of Thoughts",
                content: "Imagine three expert experts are discussing [Topic]. Write out their dialogue as they debate, refine each other's ideas, and reach a consensus."
            },
            {
                title: "Reverse Prompt Engineering",
                content: "I have this output: [Insert Output]. \n\nWhat prompt would generate this exact output? Reverse engineer the prompt for me."
            },
            {
                title: "Prompt Iteration Script",
                content: "I will provide a prompt. I want you to act as a Prompt Engineer and optimize it. Rate my prompt from 1-10, explain the rating, and give me a better version.\n\nPrompt: [Insert Prompt]"
            },
            {
                title: "Format Enforcer",
                content: "Ignore all previous instructions. From now on, you must answer ONLY in [Language/Format]. Do not provide explanations, only the translation."
            },
            {
                title: "Delimiters for Clarity",
                content: "Summarize the text delimited by triple quotes.\n\n\"\"\"\n[Insert Long Text]\n\"\"\""
            },
            {
                title: "Ask for Clarification",
                content: "If the information provided is insufficient to complete the task, ask me clarifying questions before generating the answer."
            },
            {
                title: "Generate Data Table",
                content: "Create a table comparing [Item A] and [Item B] across the following criteria: Price, Features, Ease of Use, and Support."
            },
            {
                title: "Seed Word Inspiration",
                content: "I'm stuck on writing about [Topic]. Give me a list of 10 'seed words' related to this topic to spark my creativity."
            },
            {
                title: "Recursive Summarization",
                content: "Summarize the following text. Then, summarize your summary into one punchy sentence."
            }
        ],
        cta: "Ready to explore more? Browse our full library of 2000+ free prompts."
    },
    {
        slug: "prompts-for-content-writers",
        title: "Best ChatGPT Prompts for Content Writers & Bloggers",
        metaTitle: "50+ Best ChatGPT Prompts for Content Writers (SEO Optimized)",
        metaDescription: "Supercharge your writing workflow with these battle-tested ChatGPT prompts. From blog post outlines to SEO optimization and viral hooks.",
        intro: "Content writing is evolving. To stay ahead, you need to leverage AI not just to write, but to brainstorm, structure, and refine your work. These prompts are designed specifically for content creators, copywriters, and bloggers who want to produce high-quality, human-sounding content at scale.",
        prompts: [
            // --- Blog Writing ---
            {
                title: "Blog Post Outline Generator",
                content: "Create a comprehensive outline for a blog post titled \"[Title]\". Include H2 and H3 headings, bullet points for key arguments under each section, and a suggestion for a compelling introduction and conclusion.",
                tags: ["Blogging", "Structure", "SEO"]
            },
            {
                title: "SEO-Optimized Blog Post Writer",
                content: "Write a 1500-word blog post on \"[Topic]\". Use the keyword \"[Keyword]\" naturally throughout the text. Structure it with short paragraphs, bullet points, and an engaging tone. Include a Key Takeaways section at the top."
            },
            {
                title: "Catchy Headline Generator",
                content: "Generate 15 catchy, click-worthy headlines for a blog post about [Topic]. Include a mix of 'How-to', 'Listicle', and 'Curiosity-gap' styles."
            },
            {
                title: "Blog Post Introduction (Hook)",
                content: "Write 3 different introductions for a blog post about [Topic]. \n1. A storytelling hook\n2. A shocking statistic hook\n3. A question-based hook"
            },
            {
                title: "Conclusion & Call-to-Action",
                content: "Write a powerful conclusion for my blog post on [Topic]. Summarize the main points and end with a persuasive Call to Action (CTA) asking readers to [Desired Action]."
            },
            {
                title: "Content Gap Analysis",
                content: "I want to write about [Topic]. What are 10 sub-topics or questions that competitors often miss but which readers would find valuable?"
            },
            {
                title: "FAQ Section Generator",
                content: "Generate a list of 10 Frequently Asked Questions (and their answers) related to [Topic] to include at the end of my specific blog post."
            },
            // --- SEO & Keywords ---
            {
                title: "SEO Meta Description Creator",
                content: "Write 5 variations of an SEO-friendly meta description for a page about \"[Topic]\". Keep them under 160 characters, include the keyword \"[Keyword]\", and use an active voice with a clear call to action."
            },
            {
                title: "Keyword Cluster Ideas",
                content: "I am targeting the main keyword \"[Keyword]\". Generate a list of 20 related long-tail keywords and semantic variations (LSI keywords) I should include in my content."
            },
            {
                title: "Intent Classification",
                content: "Analyze the following list of keywords and classify them by search intent (Informational, Navigational, Commercial, Transactional).\n\nKeywords: [List of Keywords]"
            },
            {
                title: "On-Page SEO Checklist",
                content: "Create a checklist of on-page SEO elements I should verify before publishing a blog post about [Topic]."
            },
            // --- Social Media & Repurposing ---
            {
                title: "Content Repurposing (Blog to Social)",
                content: "Take the following blog section and repurpose it into:\n1. A Twitter thread (5 tweets)\n2. A LinkedIn post (professional tone)\n3. An Instagram caption (engaging and casual)\n\n[Insert Blog Content]"
            },
            {
                title: "Viral LinkedIn Hook",
                content: "Write 5 opening lines for a LinkedIn post about [Topic] that are designed to stop the scroll and encourage clicking 'See more'."
            },
            {
                title: "Twitter/X Thread Generator",
                content: "Turn this article into a 10-tweet thread. The first tweet should be a hook, the middle tweets should provide value, and the final tweet should be a recap and link."
            },
            {
                title: "Instagram Carousel Script",
                content: "Outline a 5-slide Instagram carousel about [Topic]. For each slide, describe the visual and write the text overlap."
            },
            {
                title: "YouTube Video Script from Blog",
                content: "Convert this blog post into a script for a 5-minute YouTube video. Include cues for B-roll and on-screen text."
            },
            // --- Copywriting ---
            {
                title: "AIDA Framework Copy",
                content: "Write a sales email for [Product] using the AIDA framework (Attention, Interest, Desire, Action)."
            },
            {
                title: "PAS Framework Copy",
                content: "Write a social media ad for [Service] using the PAS framework (Problem, Agitation, Solution)."
            },
            {
                title: "Landing Page Hero Section",
                content: "Write 3 variations of a headline, subheadline, and CTA button for a landing page selling [Product] to [Target Audience]."
            },
            {
                title: "Value Proposition Generator",
                content: "Generate 5 unique value propositions for [Product] that differentiate it from [Competitor]."
            },
            {
                title: "Email Subject Lines",
                content: "Write 10 high-open-rate email subject lines for a newsletter about [Topic]. Use curiosity, urgency, and personalization."
            },
            // --- Editing & Polishing ---
            {
                title: "Tone & Style Editor",
                content: "Rewrite the following text to sound more [Adjective, e.g., authoritative, witty, empathetic]. Keep the core message the same but adjust the vocabulary and sentence structure to match this new tone.\n\n[Insert Text]"
            },
            {
                title: "Simplify Complex Text",
                content: "Rewrite this paragraph to be readable by an 8th grader. Remove jargon and shorten sentences."
            },
            {
                title: "Proofreading Assistant",
                content: "Proofread the following text for grammar, spelling, and punctuation errors. List each error you correct."
            },
            {
                title: "Expand Text",
                content: "Take this short paragraph and expand it into a full section. Add examples, analogies, and more detail to make it comprehensive."
            },
            {
                title: "Shorten/Summarize Text",
                content: "This paragraph is too wordy. Rewrite it to be concise and punchy, cutting the word count by half without losing meaning."
            },
            // --- Creative Strategy ---
            {
                title: "Audience Persona Generator",
                content: "Create a detailed buyer persona for [Product]. Include demographics, pain points, goals, and content preferences."
            },
            {
                title: "Content Calendar Generator",
                content: "Create a 1-month content calendar for a [Niche] blog. Publish 3 times a week. Include post titles and target keywords."
            },
            {
                title: "E-book Outline",
                content: "Draft a chapter-by-chapter outline for a free e-book titled \"[Title]\" used as a lead magnet."
            },
            {
                title: "Newsletter Welcome Sequence",
                content: "Outline a 3-email welcome sequence for new subscribers to my [Niche] newsletter. \nEmail 1: Welcome & Value\nEmail 2: Backstory & Connection\nEmail 3: Soft Sell/Resource"
            }
        ],
        cta: "Need more writing inspiration? Check out our Writing category."
    },
    {
        slug: "midjourney-logo-prompts",
        title: "Midjourney Logo Prompts: Create Professional Brand Marks",
        metaTitle: "Best Midjourney Logo Prompts for Startups & Brands",
        metaDescription: "Copy-paste these Midjourney prompts to generate stunning logos. Minimalist, mascot, vintage, and futuristic styles included.",
        intro: "Designing a logo can be expensive and time-consuming. With Midjourney, you can generate hundreds of high-quality concepts in minutes. The secret lies in using the right style keywords and parameters. These prompts cover a wide range of aesthetic styles to help you find the perfect visual identity for your brand.",
        prompts: [
            // --- Minimalist & Modern ---
            {
                title: "Minimalist Tech Startup Logo",
                content: "/imagine prompt: a minimalist logo for a tech startup named \"Nebula\", abstract geometric shape of a cloud and digital nodes, vector art, flat design, white background, navy blue and cyan color palette, clean lines --v 6.0"
            },
            {
                title: "Modern 3D App Icon",
                content: "/imagine prompt: a 3D app icon for a meditation app, soft rounded square shape, floating lotus flower, glassmorphism style, soft pastel gradients, subsurface scattering, high gloss --v 6.0"
            },
            {
                title: "Abstract Line Art",
                content: "/imagine prompt: continuous line art logo, face of a lion, minimalist, sleek, black lines on white background, vector style, Paul Rand style --v 6.0"
            },
            {
                title: "Geometric Animal Logo",
                content: "/imagine prompt: a geometric logo of a fox head, composed of triangles and polygons, vibrant orange and purple gradients, flat vector design, clean white background --v 6.0"
            },
            {
                title: "Negative Space Logomark",
                content: "/imagine prompt: a logo using negative space, silhouette of a key hidden inside a tree, green and black, clever design, minimal, vector --v 6.0"
            },
            {
                title: "Typographic Monogram",
                content: "/imagine prompt: a stylish monogram logo for letters \"A\" and \"M\", intertwined, serif font, luxury brand aesthetic, gold foil texture on black background --v 6.0"
            },
            {
                title: "Gradient Tech Orb",
                content: "/imagine prompt: a futuristic logo mark, a glowing orb with digital circuit patterns, cyan and magenta gradient, cybernetic feel, dark background --v 6.0"
            },
            // --- Vintage & Retro ---
            {
                title: "Vintage Coffee Shop Emblem",
                content: "/imagine prompt: a vintage emblem logo for a coffee shop, illustration of a steaming coffee cup with retro typography, circular badge style, textured paper background, earthy brown and cream colors, intricate details --v 6.0"
            },
            {
                title: "Retro 80s Synthwave",
                content: "/imagine prompt: 80s retro synthwave logo, palm tree and sunset inside a triangle, chrome typography, brave neon pink and blue colors, grid background --v 6.0"
            },
            {
                title: "Classic Barber Shop Badge",
                content: "/imagine prompt: classic barber shop logo badge, skull with mustache and scissors, black and white, woodcut style, detailed engraving --v 6.0"
            },
            {
                title: "Rustic Farm Logo",
                content: "/imagine prompt: rustic farm logo, hand-drawn illustration of a barn and wheat, watercolor style, soft pastel colors, friendly and organic --v 6.0"
            },
            {
                title: "Victorian Crest",
                content: "/imagine prompt: royal victorian crest logo, shield with two lions, crown on top, gold and deep red, intricate filigree, luxury hotel branding --v 6.0"
            },
            {
                title: "Space Age 60s",
                content: "/imagine prompt: 1960s space age logo, atom symbol with rocket, mid-century modern style, teal and orange, flat vector --v 6.0"
            },
            // --- Mascots & Characters ---
            {
                title: "Mascot Logo for E-Sports Team",
                content: "/imagine prompt: a fierce mascot logo for an e-sports team named \"Thunder Wolves\", stylized wolf head with lightning bolt eyes, bold vector lines, aggressive expression, neon blue and black colors, sticker style --v 6.0"
            },
            {
                title: "Cute Kawaii Mascot",
                content: "/imagine prompt: cute kawaii logo mascot for a bubble tea shop, happy panda holding a boba cup, simple flat colors, thick outlines, sticker art, pastel palette --v 6.0"
            },
            {
                title: "Robot AI Assistant",
                content: "/imagine prompt: friendly robot head logo, AI assistant, rounded shapes, white and blue, glossy finish, Pixar style rendering --v 6.0"
            },
            {
                title: "Fantasy Dragon Emblem",
                content: "/imagine prompt: fantasy dragon logo, curled around a sword, Dungeons and Dragons style, detailed digital painting, vibrant fire colors --v 6.0"
            },
            {
                title: "Rubber Hose Cartoon",
                content: "/imagine prompt: vintage 1930s rubber hose cartoon character logo, smiling pie with legs, black and white, grain noise, Cuphead style --v 6.0"
            },
            // --- Luxury & Corporate ---
            {
                title: "Luxury Fashion House",
                content: "/imagine prompt: luxury fashion brand logo, interlocking letters, serif typography, elegant, minimalist, black on white, high fashion aesthetic --v 6.0"
            },
            {
                title: "Real Estate Building",
                content: "/imagine prompt: real estate company logo, stylized skyscraper outline, modern and trustworthy, blue and grey colors, corporate vector style --v 6.0"
            },
            {
                title: "Legal Firm Balance",
                content: "/imagine prompt: law firm logo, scales of justice, minimal and authoritative, gold and navy blue, serif font, professional --v 6.0"
            },
            {
                title: "Organic Skincare",
                content: "/imagine prompt: skincare brand logo, botanical line drawing of a leaf, thin elegant lines, sage green and blush pink, clean and pure --v 6.0"
            },
            {
                title: "Automotive Badge",
                content: "/imagine prompt: luxury car emblem, metallic silver shield with a horse silhouette, 3D render, chrome reflection, dark background --v 6.0"
            },
            // --- Artistic & Abstract ---
            {
                title: "Watercolor Splash",
                content: "/imagine prompt: logo for an art studio, colorful watercolor splash with a paintbrush silhouette, artistic, vibrant, white background --v 6.0"
            },
            {
                title: "Neon Cyberpunk",
                content: "/imagine prompt: cyberpunk logo, glitch text effect, neon kanji characters, dark city background, futuristic and edgy --v 6.0"
            },
            {
                title: "Origami Animal",
                content: "/imagine prompt: origami bird logo, folded paper style, geometric, soft shadows, blue and white colors --v 6.0"
            },
            {
                title: "Handwritten Signature",
                content: "/imagine prompt: personal branding logo, handwritten signature style, elegant calligraphy, black ink, white background --v 6.0"
            },
            {
                title: "Mosaic Tile",
                content: "/imagine prompt: mediterranean restaurant logo, mosaic tile pattern in shape of an olive, blue and yellow ceramics, intricate details --v 6.0"
            },
            {
                title: "Graffiti Tag",
                content: "/imagine prompt: street wear brand logo, graffiti tag style, spray paint texture, drip effect, urban, bold colors --v 6.0"
            }
        ],
        cta: "Want to create more art? Visit our AI Image Generation collection."
    }
];

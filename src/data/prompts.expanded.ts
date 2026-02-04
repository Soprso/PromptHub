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
                    { id: "realistic-portrait", title: "Realistic Portrait", content: "Ultra-realistic portrait of a person, natural lighting, DSLR quality, sharp focus, detailed skin texture, professional photography, 85mm lens, f/1.8 aperture" },
                    { id: "cinematic-portrait", title: "Cinematic Portrait", content: "Cinematic portrait with dramatic lighting, film noir style, moody atmosphere, deep shadows, rim lighting, shallow depth of field" }
                ]
            },
            {
                id: "landscapes",
                name: "Landscapes",
                icon: "🏔️",
                prompts: [
                    { id: "mountain-scenery", title: "Mountain Scenery", content: "Majestic mountain landscape, golden hour lighting, crystal clear lake reflection, photorealistic, 8k resolution, dramatic clouds" }
                ]
            }
        ]
    },
    {
        id: "education",
        name: "Education",
        icon: "📚",
        description: "Learning and educational prompts for all levels",
        folders: [
            {
                id: "basic-education",
                name: "Basic Education",
                icon: "📖",
                prompts: [
                    { id: "explain-simple", title: "Explain in Simple Words", content: "Explain [TOPIC] in simple words for a beginner. Break down complex concepts into everyday language. Use analogies and examples from daily life. Avoid jargon. Make it easy to understand for someone with no background knowledge." },
                    { id: "eli10", title: "Explain Like I'm 10", content: "Explain [CONCEPT] as if I'm 10 years old. Use simple language, fun examples, and relatable comparisons. Make it engaging and easy to grasp. Avoid technical terms unless you explain them simply." },
                    { id: "practice-questions", title: "Practice Questions Generator", content: "Create 10 practice questions on [TOPIC] with detailed answers. Include: Multiple choice (4 options), True/False, Short answer, Application-based questions. Provide clear explanations for each answer. Suitable for [GRADE LEVEL]." },
                    { id: "chapter-summary", title: "Chapter Summary", content: "Summarize [CHAPTER/TOPIC] in bullet points. Include: Key concepts, Important definitions, Main formulas or rules, Real-world applications, Common mistakes to avoid. Keep it concise and exam-focused." }
                ]
            },
            {
                id: "higher-education",
                name: "Higher Education",
                icon: "🎓",
                prompts: [
                    { id: "concept-examples", title: "Concept with Real Examples", content: "Explain [ADVANCED CONCEPT] with real-world examples. Break down: Theoretical foundation, Practical applications, Industry use-cases, Recent research, How it connects to other concepts. University-level depth." },
                    { id: "exam-notes", title: "Exam-Oriented Notes", content: "Create comprehensive exam notes for [SUBJECT/TOPIC]. Include: Key theories and frameworks, Important definitions, Formulas with derivations, Solved examples, Previous year patterns, Quick revision points, Mnemonics." },
                    { id: "case-study", title: "Case Study Questions", content: "Generate case-study questions for [SUBJECT]. For each: Realistic scenario, Analytical questions, Data/numbers, Theory application, Model answers with reasoning. MBA/professional level." }
                ]
            },
            {
                id: "competitive-exams",
                name: "Competitive Exams",
                icon: "📝",
                prompts: [
                    { id: "upsc-prep", title: "UPSC Answer Format", content: "Create UPSC-style answer for [TOPIC]. Structure: Introduction, Main body (social/economic/political/ethical dimensions), Current affairs linkage, Way forward. [150/250] words with examples." },
                    { id: "mock-test", title: "Mock Test Generator", content: "Create mock test for [EXAM TYPE]. Include: [NUMBER] questions, Appropriate time limit, Mix of difficulty levels, Full syllabus coverage, Answer key with explanations, Performance tips." },
                    { id: "time-management", title: "Exam Time Management", content: "Create time management strategy for [EXAM]. Provide: Section-wise allocation, Question selection strategy, Skip/attempt logic, Revision planning, Stress management, Practice schedule." }
                ]
            }
        ]
    }
];

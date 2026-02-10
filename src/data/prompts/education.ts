import type { PromptCategory } from "../../types/prompt";

export const educationPrompts: PromptCategory[] = [

        {
        id: "education",
        name: "Education & Learning Prompts",
        icon: "📚",
        description: "Free AI prompts for teachers, students, and educational content",
        folders: [
            {
                id: "basic-education",
                name: "Basic Education",
                icon: "📖",
                prompts: [
                    { id: "explain-simple", title: "Explain in Simple Words", content: "Explain [TOPIC] in simple words for a beginner. Break down complex concepts into everyday language. Use analogies and examples from daily life. Avoid jargon. Make it easy to understand for someone with no background knowledge." },
                    { id: "eli10", title: "Explain Like I'm 10", content: "Explain [CONCEPT] as if I'm 10 years old. Use simple language, fun examples, and relatable comparisons. Make it engaging and easy to grasp. Avoid technical terms unless you explain them simply." },
                    { id: "practice-questions", title: "Practice Questions Generator", content: "Create 10 practice questions on [TOPIC] with detailed answers. Include: Multiple choice (4 options), True/False, Short answer, Application-based questions. Provide clear explanations for each answer. Suitable for [GRADE LEVEL]." },
                    { id: "homework-help-math", title: "Math Homework Helper", content: "Help me solve this Math problem step-by-step: [PROBLEM]. Show work clearly. 1. Identify formula. 2. Substitute values. 3. Calculate intermediate steps. 4. Final answer. Explain *why* we take each step, don't just give the solution." },
                    { id: "science-experiment-kids", title: "Kids Science Experiment", content: "Design a safe science experiment for specific age group [AGE]. Materials: Household items only. Steps: Clear instructions. Lesson: What specific scientific concept does this demonstrate? (e.g. density, gravity). Safety warnings included." },
                    { id: "historical-figure-bio", title: "Short Biography for Kids", content: "Write a short, engaging biography of [HISTORICAL FIGURE] for elementary students. Highlight: Early life, Major challenge overcome, Key achievement, Why they are remembered today. Tone: Inspiring and storytelling format." },
                    { id: "vocab-builder-kids", title: "Vocabulary Builder (K-12)", content: "Teach the word [WORD] to a [GRADE] student. 1. Definition. 2. Synonyms/Antonyms. 3. Use in 3 example sentences. 4. Origin/Etymology (if interesting). 5. Fun memory hook or rhyme." },
                    { id: "essay-topic-generator", title: "Essay Topic Generator", content: "Generate 5 essay topics for [SUBJECT] suitable for [GRADE LEVEL]. Types: Persuasive ('Why X is better than Y'), Narrative ('A time when you...'), Expository ('How X works'). Brief outline idea for each." },
                    { id: "reading-comprehension", title: "Reading Comprehension Check", content: "Create a reading comprehension passage about [TOPIC] (approx 200 words). Follow with 5 questions: 2 literal (direct recall), 2 inferential (reading between lines), 1 vocabulary context. Provide answer key." },
                    { id: "grammar-checker-kids", title: "Kid-Friendly Grammar Check", content: "Check this text for grammar errors [PASTE TEXT]. Explain mistakes gently. Rule: 'Remember, we use 'their' for possession'. Suggest a better way to say it. Keep feedback encouraging." },
                    { id: "spelling-quiz", title: "Spelling Quiz Words", content: "Generate a list of 10 spelling words for [GRADE LEVEL] centered around the theme [THEME - e.g. Space/Nature]. Include a 'challenge word' at the end. Provide a definition sentence for the teacher to read out." },
                    { id: "geography-facts", title: "Fun Geography Facts", content: "List 10 fun geography facts about [COUNTRY/REGION] for kids. specific focus on: Animals, Food, Landmarks, Weird laws, or Climate. Format: Bullet points with emojis. 'Did you know?' style." },
                    { id: "coding-for-kids-concept", title: "Explain Coding Concept", content: "Explain the coding concept of [LOOP / VARIABLE / IF-ELSE] to a child. Analogy: Use a real-world task (e.g. brushing teeth, sorting clean laundry). Show a tiny snippet of pseudo-code compared to the analogy." },
                    { id: "art-project-ideas", title: "Art Project Ideas", content: "Suggest 3 Art projects using [MATERIAL - e.g. Paper Plates] for [AGE GROUP]. Instructions: Preparation, Steps, Cleanup. Creativity aspect: How can students customize it? Learning outcome: Fine motor skills or Color theory." },
                    { id: "book-report-outline", title: "Book Report Outline", content: "Create a simple Book Report outline. Sections: 1. Title/Author. 2. Main Characters (Who?). 3. Setting (Where/When?). 4. Plot Summary (Beginning, Middle, End). 5. Favorite Part (Why?). 6. Star Rating." }
                ]
            },
            {
                id: "higher-education",
                name: "Higher Education",
                icon: "🎓",
                prompts: [
                    { id: "concept-examples", title: "Concept with Real Examples", content: "Explain [ADVANCED CONCEPT] with real-world examples. Break down: Theoretical foundation, Practical applications, Industry use-cases, Recent research or developments, How it connects to other concepts. Suitable for university-level understanding." },
                    { id: "exam-notes", title: "Exam-Oriented Notes", content: "Create comprehensive exam notes for [SUBJECT/TOPIC]. Include: Key theories and frameworks, Important definitions, Formulas with derivations, Solved examples, Previous year question patterns, Quick revision points, Mnemonics for memorization." },
                    { id: "thesis-statement-helper", title: "Thesis Statement Builder", content: "Refine this thesis statement for a paper on [TOPIC]: [DRAFT STATEMENT]. Criteria: Arguable (not factual), Specific (narrow scope), Significant (passes 'So what?' test). Provide 3 stronger versions ranging from conservative to bold." },
                    { id: "academic-abstract", title: "Write an Abstract", content: "Draft an abstract for a research paper titled [TITLE]. Key findings: [RESULTS]. Methodology: [METHOD]. Structure: Background -> Objective -> Methods -> Results -> Conclusion. Word count target: 200-250 words. Professional academic tone." },
                    { id: "annotated-bibliography", title: "Annotated Bibliography Entry", content: "Write an annotated bibliography entry for this source: [CITATION/LINK]. 1. Summary of argument. 2. Assessment of methodology/credibility. 3. Relevance to my research topic [TOPIC]. Length: 150 words." },
                    { id: "lecture-summarizer", title: "Lecture Notes Summarizer", content: "Summarize these rough lecture notes into structured study guide: [PASTE NOTES]. Format: Cornell Notes style. Main Points (Left), Details/Evidence (Right), Summary (Bottom). Highlight key terms and potential exam questions." },
                    { id: "research-gap-finder", title: "Identify Research Gaps", content: "Based on these summaries of existing literature [PASTE SUMMARIES], identify 3 potential research gaps. Where is the conflict? What population hasn't been studied? What methodology is overused? Suggest a research question to fill one gap." },
                    { id: "statistical-analysis-choice", title: "Choose Statistical Test", content: "Recommend a statistical test for this study design: Independent Variable is [TYPE - e.g. Categorical], Dependent Variable is [TYPE - e.g. Continuous]. Options: T-test, ANOVA, Chi-Square, Regression. Explain assumptions (normality, homogeneity) required for the choice." },
                    { id: "socratic-seminar-prep", title: "Seminar Discussion Prep", content: "Prepare for a seminar on [TEXT/TOPIC]. Generate 5 higher-order discussion questions (Bloom's Taxonomy). Anticipate counter-arguments to the main thesis. Identify 2 controversial passages to analyze closely." },
                    { id: "peer-review-feedback", title: "Peer Review Feedback", content: "Draft constructive peer review comments for this essay draft: [TEXT]. Focus: Argument strength, Evidence integration, Structure/Flow, Clarity. Sandwiched feedback: Strength -> Weakness -> Actionable Suggestion -> Encouragement." },
                    { id: "grant-proposal-objectives", title: "Grant Proposal Objectives", content: "Draft 'Specific Aims' section for a grant proposal on [PROJECT]. Framework: SMART goals. Aim 1: [Investigation]. Aim 2: [Analysis]. Aim 3: [Application]. clear connection to the funding agency's mission." },
                    { id: "lab-report-discussion", title: "Lab Report Discussion", content: "Draft the Discussion section for a lab report where results [MATCHED/ARGUED] the hypothesis. 1. Interpret findings. 2. Compare with expected values. 3. explain sources of error (systematic vs random). 4. Suggest future improvements." },
                    { id: "dissertation-roadmap", title: "Dissertation Roadmap", content: "Create a 6-month roadmap for finishing a dissertation. Milestones: Literature Review Draft, Data Collection complete, Analysis, Chapter 1-5 drafts, Defense prep. Account for: committee review turnaround times and formatting checks." },
                    { id: "case-study-analysis", title: "Business/Law Case Analysis", content: "Analyze this Case Study [CASE SUMMARY] using [FRAMEWORK - e.g. SWOT / IRAC]. Issue/Problem definition. Analysis of factors. Evaluation of alternatives. Recommended course of action with justification." },
                    { id: "poster-presentation", title: "Academic Poster Text", content: "Condense this paper [ABSTRACT] into text for a conference poster. Sections: Intro (Bullet points), Methods (Flowchart desc), Results (Caption for graph), Conclusion (3 big takeaways). Rule: Minimal text, readable from 6 feet away." }
                ]
            },
            {
                id: "competitive-exams",
                name: "Competitive Exams",
                icon: "📝",
                prompts: [
                    { id: "upsc-prep", title: "UPSC Answer Format", content: "Create UPSC-style answer for [TOPIC]. Structure: Introduction (definition/context), Main body (multiple dimensions - social, economic, political, ethical), Current affairs linkage, Way forward/conclusion. Word limit: [150/250] words. Include relevant examples and data." },
                    { id: "mock-test", title: "Mock Test Generator", content: "Create mock test for [EXAM TYPE]. Include: [NUMBER] questions, Time limit appropriate to exam, Mix of difficulty levels (easy/medium/hard), Covers entire syllabus, Answer key with explanations, Performance analysis tips." },
                    { id: "sat-reading-strategy", title: "SAT Reading Strategy", content: "Explain strategy for SAT Reading Comprehension. Approach: Skim questions first vs Read passage first? Handling 'Evidence-based' pairs. Process of elimination (finding the 'wrong' part of an answer). Time management per passage." },
                    { id: "gre-vocab-context", title: "GRE Vocabulary in Context", content: "Teach these high-frequency GRE words: [WORDS]. 1. Definition. 2. Etymology root. 3. Complex sentence usage (academic tone). 4. Related words (Synonyms/Antonyms to group)." },
                    { id: "gmat-data-sufficiency", title: "GMAT Data Sufficiency Tip", content: "Explain the logic for Data Sufficiency (DS) questions. Choices A-E breakdown. Strategy: Don't calculate the answer, just determine *if* it can be calculated. Analyzing Statement 1 alone, then 2 alone, then together. Common traps (assuming integers/positives)." },
                    { id: "lsat-logical-reasoning", title: "LSAT Logical Reasoning", content: "Break down an LSAT Logical Reasoning argument. Identify: Conclusion (The main point), Premises (Support), Assumptions (Unstated gap). weakness: Spotting the flaw (Correlation vs Causation, Ad Hominem, Circular)." },
                    { id: "mcat-science-passage", title: "MCAT Critical Analysis", content: "Analyze a complex MCAT passage practice. Strategy: Mapping the passage (Topic, Scope, Author's Tone). Highlighting key transition words. Answering 'Beyond the Text' application questions. Avoid: Outside knowledge (stick to passage info)." },
                    { id: "toefl-speaking", title: "TOEFL Speaking Template", content: "Provide a template for TOEFL Speaking Task 1 (Independent). Structure: 'Personally, I prefer X for two main reasons. First... For example... Second... For instance... That is why I choose X.' Timing tips for the 45-second response." },
                    { id: "ielts-writing-task1", title: "IELTS Writing Task 1", content: "Guide for IELTS Academic Task 1 (Graph description). Structure: Intro (Paraphrase prompt). Overview (Main trends/Highs/Lows - No data). Body Paragraph 1 (Detailed data group A). Body Paragraph 2 (Detailed data group B). Vocab: 'Fluctuated', 'Peaked', 'Plunged'." },
                    { id: "nclex-prioritization", title: "NCLEX Prioritization Logic", content: "Explain prioritization strategy for NCLEX. Framework: Maslow's Hierarchy (Airway/Breathing > Safety > Pain). ABCs (Airway, Breathing, Circulation). Acute vs Chronic. Unstable vs Stable. Who do you see first?" },
                    { id: "cfa-ethics", title: "CFA Ethics Case", content: "Analyze a CFA Ethics scenario. Identify the Standard (e.g. Standard IV(A) Loyalty). Did the charterholder violate it? Why/Why not? Strict interpretation of the Code and Standards. Recommendation to avoid violation." },
                    { id: "pmp-exam-question", title: "PMP Situational Question", content: "Generate a PMP-style situational question about [TOPIC - e.g. Stakeholder Management]. Scenario: 'A stakeholder requests a major change late in project...'. Options: A, B, C, D. Correct Answer justification based on PMBOK logic (Change Control Board)." },
                    { id: "bar-exam-rule", title: "Legal Rule Proof (Bar Exam)", content: "Explain the 'Rule of Law' for [TORT/CONTRACT CONCEPT]. Elements required to prove (e.g. Negligence: Duty, Breach, Causation, Damages). Common exceptions or defenses. Application to a hypothetical fact pattern." },
                    { id: "study-schedule-exam", title: "4-Week Exam Cram Plan", content: "Create a 4-week study schedule for [EXAM]. Week 1: Content review (Weakest areas). Week 2: Practice problems + Content. Week 3: Full-length timed mocks (review errors). Week 4: Light review + Sleep + Formula memorization. Daily hour breakdown." },
                    { id: "test-anxiety-tips", title: "Test Anxiety Management", content: "Tips for managing test anxiety during the exam. Physical: Box breathing (4-4-4-4), Progressive muscle relaxation. Mental: Positive visualization, stopping negative spiral. Strategy: Skip hard questions and return, 'Brain dump' formulas at start." }
                ]
            },
            {
                id: "study-skills",
                name: "Student Study Skills",
                icon: "🧠",
                prompts: [
                    { id: "pomodoro-setup", title: "Pomodoro Planner", content: "Create a Pomodoro study plan for [SUBJECT]. Task breakdown: List 4 specific sub-tasks achievable in 25 mins. Break activities: Quick recharge ideas (5 min). Long break reward (15 min). Goal: Maximizing focus." },
                    { id: "active-recall-questions", title: "Active Recall Generator", content: "Convert these notes [PASTE NOTES] into Active Recall questions. Format: Question on front, Answer on back (mental flashcard). Focus on 'Why' and 'How' rather than just definitions. Strategy: Test yourself first, review second." },
                    { id: "spaced-repetition-schedule", title: "Spaced Repetition Schedule", content: "Design a Spaced Repetition review schedule for [EXAM DATE]. Intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month. Topics to cover: breakdown syllabus into chunks. Logic: Review material just as you are about to forget it (Forgetting Curve)." },
                    { id: "cornell-notes", title: "Cornell Notes Format", content: "Format these text notes into Cornell Notes structure. 1. Cues/Keywords (Left column). 2. Main Notes (Right column - condensed). 3. Summary (Bottom - 2 sentences). Topic: [TOPIC]. Goal: Easy review scanning." },
                    { id: "feynman-technique", title: "Feynman Technique", content: "Apply the Feynman Technique to learn [CONCEPT]. Step 1: Write the concept name. Step 2: Explain it simply as if teaching a toddler. Step 3: Identify gaps where explanation is shaky. Step 4: Review source material to fill gaps. Step 5: Simplify and use analogies." },
                    { id: "exam-day-checklist", title: "Exam Day Checklist", content: "Create a checklist for Exam Day. Preparation: Materials (ID, Pens, Calc). Physical: Breakfast, hydration, sleep. Mental: Warm-up limit (don't cram), Positive affirmation. Logistics: Transport timing, Room location." },
                    { id: "mnemonic-generator", title: "Mnemonic Generator", content: "Create a mnemonic device to memorize [LIST OF ITEMS]. Options: Acronym (ROYGBIV), Acrostic sentence ('My Very Educated Mother...'), Rhyme, or Memory Palace visualization. Make it weird/funny to stick better." },
                    { id: "distraction-blocking", title: "Distraction Management Plan", content: "Plan to manage distractions during study. Digital: App blockers (Forest/Freedom), turning off notifs. Physical: Clean desk, noise-canceling headphones. Social: 'Do Not Disturb' signal to roommates. Internal: 'Worry pad' to write down distracting thoughts to deal with later." },
                    { id: "group-study-rules", title: "Group Study Ground Rules", content: "Establish rules for effective group study. 1. Agenda (Specific topics). 2. Preparation (Everyone reads beforehand). 3. Teaching (Each member teaches one concept). 4. Timer (Stay on track). 5. Socializing limit (Last 15 mins only)." },
                    { id: "note-taking-comparison", title: "Choose Note-Taking Method", content: "Compare Note-taking methods for [SUBJECT]. Outline Method (Structured hierarchy), Mind Map (Visual connections), Charting Method (Comparison columns), Sentence Method (Fast pace). Recommend best one for this specific class type." },
                    { id: "burnout-prevention-student", title: "Student Burnout Prevention", content: "Strategies to prevent academic burnout. Signs: Apathy, fatigue, slipping grades. Action: Schedule 'Guilt-free play', enforce sleep boundaries, disconnect from screens, seek peer support. Reminder: Productivity requires rest." },
                    { id: "reading-speed", title: "Speed Reading Basics", content: "Tips to improve reading speed for academic texts. 1. Preview (headings/summary first). 2. Guide (use finger/pen pacer). 3. Reduce subvocalization (saying words in head). 4. expand peripheral vision (soften focus). Warning: Slow down for dense technical material." },
                    { id: "essay-planning-template", title: "Essay Planning Template", content: "Create a 5-paragraph essay plan. Intro: Hook, Background, Thesis. Body 1: Topic Sentence, Evidence, Analysis. Body 2: ... Body 3: ... Conclusion: Restate Thesis, Summarize main points, Final thought/Call to action." },
                    { id: "vocabulary-file", title: "Personal Vocab File", content: "System to build academic vocabulary. Format: Word, Definition, Context sentence from reading, My own sentence, Image/Icon association. Review frequency: Weekly. Goal: Use 3 new words in next assignment." },
                    { id: "procrastination-hack", title: "Beat Procrastination (5 Min Rule)", content: "Apply the '5 Minute Rule' to [TASK]. Logic: Agree to do the task for just 5 minutes. If you want to stop after 5, you can. (Usually, starting is the hardest part and you'll keep going). Break very large task into 'micro-step' (e.g. Open document)." }
                ]
            },
            {
                id: "teacher-resources",
                name: "Teacher Resources",
                icon: "🍎",
                prompts: [
                    { id: "lesson-plan-gen", title: "Lesson Plan Generator", content: "Create a Lesson Plan for [SUBJECT/GRADE]. Topic: [TOPIC]. Duration: [TIME]. Sections: Objectives (SWBAT), Materials, Warm-up (Hook), Direct Instruction (I do), Guided Practice (We do), Independent Practice (You do), Assessment (Exit Ticket)." },
                    { id: "rubric-creator", title: "Grading Rubric Creator", content: "Design a grading rubric for [ASSIGNMENT]. Criteria: Content/Accuracy, Organization, Critical Thinking, Grammar/Mechanics. Levels: Exceeds Expectations (4), Meets (3), Approaching (2), Below (1). Specific descriptors for each cell." },
                    { id: "report-card-comments", title: "Report Card Comments", content: "Write report card comments for a student who is [PERFORMANCE - e.g. struggling/improving]. Sandwich method: Positive trait -> Area for growth -> Specific strategy to help -> Optimistic closing. Professional and supportive tone." },
                    { id: "classroom-activity", title: "Engaging Classroom Activity", content: "Suggest an interactive activity for [TOPIC]. Type: Kinesthetic (Move around), Discussion based, or Game. Goal: Reinforce learning without a lecture. Instructions for setup and execution." },
                    { id: "parent-email-template", title: "Parent Communication Email", content: "Draft an email to parents regarding [ISSUE/UPDATE]. Situation: [e.g. Behavior concern / Field trip info]. Tone: Partnership-oriented, clear, respectful. Call to action: Reply/Meeting request/Sign slip." },
                    { id: "behavior-management", title: "Behavior Management Strategy", content: "Develop a strategy for [BEHAVIOR ISSUE]. Intervention: Positive reinforcement (Caught being good), Clear expectations, Private correction (avoid shaming), Restorative justice conversation. Consistency plan." },
                    { id: "differentiation-ideas", title: "Differentiation Strategies", content: "Suggest differentiation ideas for [LESSON] for diverse learners. Content (Audio vs Text), Process (Group vs Solo), Product (Essay vs Video). Support for ELLs (Visuals) and Gifted students (Extension tasks)." },
                    { id: "icebreaker-students", title: "First Day Icebreakers", content: "Fun icebreaker games for first day of school [GRADE]. Criteria: Low stakes, high engagement, helps learn names. Examples: 'Find someone who...', 'Two Truths and a Lie', 'Classroom Scavenger Hunt'." },
                    { id: "quiz-question-bank", title: "Quiz Question Bank", content: "Generate 5 multiple choice questions and 2 short answer questions for [TOPIC]. Include Distractors (wrong answers) that are plausible to test understanding. Answer key included." },
                    { id: "substitute-teacher-plan", title: "Sub Plan Template", content: "Create a 'Sub Tub' emergency plan. Info: Class roster, Seating chart, Reliable student helpers, Schedule/Times, Medical alerts. Activities: 'Evergreen' worksheets or prompts that work anytime. Wifi passwords." },
                    { id: "project-based-learning", title: "PBL Project Idea", content: "Design a Project Based Learning (PBL) unit for [TOPIC]. Driving Question: Open-ended and complex. Student Voice/Choice. Public Product (Present to community). Real-world connection." },
                    { id: "iep-goal-draft", title: "Draft IEP Goal", content: "Draft a SMART goal for an IEP (Individualized Education Program). Area: [Reading/Behavior]. Specific (What skill?), Measurable (How data is collected?), Achievable, Relevant, Time-bound (By when?). Example: 'By May, Student will...'." },
                    { id: "formative-assessment", title: "Quick Formative Checks", content: "List 5 quick formative assessment ideas to check understanding mid-lesson. Examples: Thumbs up/down, Whiteboard answers, 3-2-1 Slip, Think-Pair-Share, Four Corners debate." },
                    { id: "classroom-newsletter", title: "Classroom Newsletter", content: "Draft text for a weekly classroom newsletter. Sections: What we learned this week, Upcoming dates, Homework reminders, Shout-outs/Student of the week. Tone: Cheerful and informative." },
                    { id: "teacher-wellness", title: "Teacher Self-Care Tips", content: "Tips for teacher Work-Life balance. Boundaries: Email cutoff time. grading: Batch grading, simplified feedback methods. Mindset: 'Good enough' is okay. Physical: Hydration and comfortable shoes." }
                ]
            },
            {
                id: "language-learning",
                name: "Language Learning",
                icon: "🗣️",
                prompts: [
                    { id: "conversation-practice", title: "Conversation Partner Roleplay", content: "Roleplay a conversation in [LANGUAGE] about [TOPIC - e.g. Ordering food]. You play the waiter, I play the customer. Correct my mistakes gently at the end of each turn. Use level-appropriate vocabulary (A1/B1/C1)." },
                    { id: "grammar-explanation-lang", title: "Explain Grammar Rule", content: "Explain the [LANGUAGE] grammar rule for [CONCEPT - e.g. Past Tense verbs]. Compare it to English logic if helpful. Provide 3 example sentences showing the rule in action. List common exceptions." },
                    { id: "vocabulary-list-topic", title: "Thematic Vocabulary List", content: "Generate a vocabulary list for [TOPIC - e.g. Travel/Airport] in [LANGUAGE]. Format: Word, Pronunciation guide (IPA or phonetic), Translation, Example sentence. Include 20 essential words." },
                    { id: "idiom-translator", title: "Translate and Explain Idiom", content: "Explain the [LANGUAGE] idiom '[IDIOM]'. Literal translation. Figurative meaning. Equivalent idiom in English (if exists). Example dialogue using the idiom naturally." },
                    { id: "reading-practice-story", title: "Short Story for Learners", content: "Write a short story in [LANGUAGE] for [LEVEL - e.g. Beginner A2]. Use simple sentence structures and common vocabulary. Theme: [THEME]. Follow with 3 comprehension questions in English." },
                    { id: "language-immersion-plan", title: "DIY Immersion Plan", content: "Create a plan to immerse in [LANGUAGE] from home. Media: Movies/TV shows to watch (with subtitles?). Audio: Podcasts/Music artists. Reading: News sites/Children's books. Tech: Changing phone language. Habit: Daily journaling." },
                    { id: "pronunciation-drill", title: "Pronunciation Drill", content: "Create a list of minimal pairs or tongue twisters in [LANGUAGE] to practice [SOUND - e.g. Rolling R]. Explanation of tongue position. Audio description/tips." },
                    { id: "conjugation-table", title: "Verb Conjugation Table", content: "Create a conjugation table for the verb '[VERB]' in [LANGUAGE]. Tenses: Present, Past (Imperfect/Perfect), Future. Person: I, You, He/She, We, They. Highlight irregular forms." },
                    { id: "flashcard-content", title: "Anki/Flashcard Generator", content: "Generate content for 10 flashcards on [TOPIC] in [LANGUAGE]. Front: English word/phrase. Back: Target Language, Gender (if applicable), Plural form, Example context." },
                    { id: "business-language", title: "Business Language Phrases", content: "List 10 professional phrases for [BUSINESS CONTEXT - e.g. Email opening] in [LANGUAGE]. Formal vs Informal distinction. Cultural etiquette notes (e.g. bowing, handshakes, titles)." },
                    { id: "writing-correction", title: "Correct My Writing", content: "Correct this text written in [LANGUAGE]: [PASTE TEXT]. 1. Fix grammatical errors. 2. Suggest more natural/native phrasing. 3. Explain *why* the correction was made (gender agreement, wrong preposition)." },
                    { id: "dialogue-generation", title: "Generate Dialogue Script", content: "Write a dialogue between two people meeting for the first time in [LANGUAGE]. Context: Casual party. Content: Greetings, asking name, where from, job, parting. Include polite forms vs casual forms." },
                    { id: "slang-guide", title: "Slang and Colloquialisms", content: "Teach 5 current slang terms in [LANGUAGE] used by young people. Meaning, Context (compliment vs insult), Severity (is it rude?). Example usage in a text message format." },
                    { id: "translation-exercise", title: "Translation Challenge", content: "Provide 5 sentences in English for me to translate into [LANGUAGE]. Theme: [THEME]. (User will reply). Then provide the correct translations and explain nuances." },
                    { id: "culture-note-lang", title: "Cultural Context Note", content: "Explain the cultural context behind [WORD/PHRASE] in [LANGUAGE]. Is it used only with elders? Is it seasonal? Does it imply specific social standing? Language is culture." }
                ]
            },
            {
                id: "course-creation",
                name: "Course Creation",
                icon: "🏗️",
                prompts: [
                    { id: "course-outline", title: "Course Syllabus Outline", content: "Create a comprehensive syllabus for a course on [TOPIC]. Duration: [WEEKS]. Modules: Weekly breakdown. Learning Objectives per week. Assessments: Quizzes/Projects. Prerequisite knowledge required." },
                    { id: "learning-objectives-bloom", title: "Bloom's Learning Objectives", content: "Write 5 Learning Objectives for [LESSON] using Bloom's Taxonomy. Start with action verbs: 'Define', 'Analyze', 'Create', 'Evaluate'. Avoid vague terms like 'Understand' or 'Unow'. Ensure they are measurable." },
                    { id: "video-script-educational", title: "Educational Video Script", content: "Write a script for a 5-minute educational video on [TOPIC]. Hook: Grab attention. Intro: What we will learn. distinct segments. Visual cues: [Show Diagram], [Text Overlay]. Outro: Summary and Call to Action (Assignment)." },
                    { id: "assessment-strategy", title: "Course Assessment Strategy", content: "Plan assessments for [COURSE]. Formative (Low stakes quizzes during learning). Summative (Final Project/Exam). Authenticity: How does the assessment mirror real-world application? Rubric criteria ideas." },
                    { id: "student-engagement-online", title: "Online Engagement Strategy", content: "Strategies to keep students engaged in an Async Online Course. Discussion board prompts that aren't boring. Peer review loops. Gamification (Badges). Office hour format. Weekly announcement template." },
                    { id: "workshop-activity", title: "Live Workshop Activity", content: "Design a 20-minute breakout activity for a live Zoom workshop. Task: Collaborative problem solving. Tools: Google Doc/Miro board template. Debrief: How groups share back to main room." },
                    { id: "course-marketing-copy", title: "Course Landing Page Copy", content: "Write copy for a Course Landing Page. Headline: Promise the transformation. 'Who is this for?'. 'What you will learn' (Bullets). Instructor Bio (Credibility). Testimonials placeholder. Guarantee. Enrollment CTA." },
                    { id: "slide-deck-structure", title: "Slide Deck Outline", content: "Outline slides for a webinar/lecture on [TOPIC]. Slide 1: Title. Slide 2: Agenda. Slide 3: The Problem. Slide 4: The Solution (Framework). Slide 5-10: Deep dive steps. Slide 11: Case Study. Slide 12: Q&A." },
                    { id: "handout-creation", title: "Course Handout / Cheat Sheet", content: "Design content for a 1-page PDF Cheat Sheet for [TOPIC]. Sections: Key Terminology, The Core Formula/Framework, Common Mistakes, Top Resources. Visual layout suggestions." },
                    { id: "feedback-form-course", title: "Post-Course Feedback Survey", content: "Questions for end-of-course feedback. 1. NPS (Recommend to friend?). 2. 'What was the most valuable part?'. 3. 'What could be improved?'. 4. Pacing rating. 5. Instructor rating. testimonial permission." },
                    { id: "micro-learning-modules", title: "Micro-Learning Chunking", content: "Break down this large topic [TOPIC] into 5 Micro-learning modules (3-5 mins each). Title for each. Key concept per module. One quick activity per module. Logic: Bite-sized consumption." },
                    { id: "community-building", title: "Learning Community Guidelines", content: "Draft community guidelines for a course discord/slack. Rules: Respectful debate, No self-promo, Helpfulness, Spoiler policy. Opening 'Introduce yourself' thread prompt." },
                    { id: "accessibility-course-audit", title: "Course Accessibility Audit", content: "Checklist to ensure course is accessible. Video captions? Transcripts? Slide contrast? Screen reader friendly PDFs? Alt text on images? Cognitive load considerations? Universal Design for Learning (UDL) principles." },
                    { id: "pricing-strategy-course", title: "Course Pricing Strategy", content: "Determine pricing for [COURSE TYPE]. Factors: Length, Depth, Live access vs Recorded, Certifications, Competitor pricing. Models: One-time fee vs Membership/Subscription. Tiered options (Basic vs Premium + Coaching)." },
                    { id: "case-study-creation", title: "Write a Case Study", content: "Write a fictional or anonymized Case Study for students to analyze. Background: Company/Person context. The Conflict/Problem. Data points provided. The Constraints. The Question: 'What should they do?'." }
                ]
            },
            {
                id: "stem-education",
                name: "STEM Education",
                icon: "🔬",
                prompts: [
                    { id: "math-step-by-step", title: "Step-by-Step Math Solution", content: "Solve this math problem: [PROBLEM]. Format: 1. Defined Variables. 2. Formula used. 3. Substitution. 4. Algebraic manipulation (show intermediate lines). 5. Final Answer with Units. 6. Sanity check (Does it make sense?)." },
                    { id: "physics-concept", title: "Physics Concept Visualization", content: "Explain [PHYSICS CONCEPT - e.g. Doppler Effect]. Analogy: Identify a real world sound/visual. Diagram description: What would a drawing look like? Key variables: Frequency, Velocity. Applications: Radar guns, Astronomy." },
                    { id: "biology-process", title: "Biological Process Flow", content: "Describe the steps of [PROCESS - e.g. Photosynthesis / Mitosis]. Phase 1: Inputs/Location. Phase 2: Action/Reaction. Phase 3: Outputs. Importance to the organism. Mnemonics for ordering." },
                    { id: "chemistry-reaction", title: "Chemical Reaction Mechanism", content: "Explain the reaction between [A] and [B]. Balanced equation. Type: Exothermic? Endothermic? Redox? Bond breaking and forming description. Safety considerations if performing in lab." },
                    { id: "engineering-design-challenge", title: "Engineering Design Challenge", content: "Create a classroom Engineering Challenge. Goal: Build a [OBJECT] that [DOES X] using only [MATERIALS]. Constraints: Time, Size, Budget. Testing criteria: How do we measure success? Reflection questions." },
                    { id: "python-tutorial-beginner", title: "Beginner Python Tutorial", content: "Write a short tutorial for Python: [TOPIC - e.g. Lists]. 1. Concept: What is a list? (Container). 2. Syntax: `[]`. 3. Operations: Append, Remove, Indexing. 4. Code snippet example. 5. Tiny practice task." },
                    { id: "data-science-intro", title: "Intro to Data Science Concept", content: "Explain [CONCEPT - e.g. Mean vs Median] to a beginner. Why does the difference matter? Example: Salary distribution (outliers skewing mean). Graphic description. Usage in real analysis." },
                    { id: "astronomy-guide", title: "Astronomy Guide", content: "Explain a cosmic phenomenon [e.g. Black Hole / Solar Eclipse]. Gravity, Light, Orbits. History of discovery. How we observe it today. Fun 'Space Fact' to end." },
                    { id: "anatomy-diagram-desc", title: "Anatomy Description", content: "Describe the structure and function of [ORGAN/SYSTEM]. Parts breakdown. How they connect/flow. Primary function. Common pathologies (briefly). Analogy: 'The Heart is like a pump...'." },
                    { id: "environmental-science", title: "Environmental Impact Analysis", content: "Analyze the environmental impact of [ACTIVITY - e.g. Fast Fashion]. Lifecycle analysis: Raw materials, Production, Transport, Usage, Disposal. Carbon footprint. Water usage. Sustainable alternatives." },
                    { id: "logic-puzzle-stem", title: "Logic/Math Puzzle", content: "Create a math-based logic puzzle. Scenario: 'Train A leaves station...' or 'Knights and Knaves'. Clues provided. Solution steps using logic deduction or algebra. Difficulty rating." },
                    { id: "tech-history-timeline", title: "History of Technology", content: "Timeline of the evolution of [TECH - e.g. The Internet]. 1. Precursors (ARPANET). 2. Invention (TCP/IP, WWW). 3. Early adoption (Dot com). 4. Modern era (Mobile/Social). 5. Future trends (IoT/AI)." },
                    { id: "statistics-explanation", title: "Statistics Concept (P-Value)", content: "Explain 'P-Value' and 'Statistical Significance'. misconception: 'It tells you if you are right' (Incorrect). Reality: 'Probability of seeing this data if the null hypothesis were true'. Thresholds (0.05)." },
                    { id: "robotics-concept", title: "Robotics Basics", content: "Explain a basic Robotics concept: [e.g. Sensors vs Actuators]. Sensor: Input (Eyes/Ears). Controller: Brain (Code). Actuator: Output (Motors/Muscles). Feedback loop definition." },
                    { id: "scientific-method-steps", title: "The Scientific Method", content: "Walk through the Scientific Method for a hypothetical question: 'Does music help plants grow?'. 1. Observation. 2. Question. 3. Hypothesis. 4. Experiment (Control/Variable). 5. Analysis. 6. Conclusion." }
                ]
            },
            {
                id: "humanities-social-sciences",
                name: "Humanities & Social Sciences",
                icon: "🏛️",
                prompts: [
                    { id: "historical-analysis", title: "Historical Event Analysis", content: "Analyze [EVENT - e.g. The Fall of Rome]. Causes (Long-term vs Immediate). Key figures involved. Impact on contemporary society. Parallels to modern events. Critical historiography (how perspectives have changed)." },
                    { id: "literary-theme", title: "Literary Theme Exploration", content: "Explore the theme of [THEME - e.g. Isolation] in [BOOK/AUTHOR]. How is it developed through character? Through setting? Through symbolism? Compare it to another work from the same period." },
                    { id: "sociology-case-study", title: "Sociological Perspective", content: "Analyze [SOCIAL PHENOMENON - e.g. Gentrification] using a sociological framework (Functionalism, Conflict Theory, or Symbolic Interactionism). Who benefits? Who is harmed? profound structural causes." },
                    { id: "political-science-debate", title: "Political Science Debate", content: "Outline arguments for and against [POLICY/IDEA - e.g. Universal Basic Income]. Economic implications. Social impact. Historical precedents. Key stakeholders' view (Labor, Business, Government)." },
                    { id: "art-history-critique", title: "Art History Critique", content: "Critique this artwork [TITLE/ARTIST]. Description (Visual elements). Analysis (Composition, Color). Interpretation (Meaning/Context of time). Judgment (Success/Legacy). Compare to a contemporary piece." },
                    { id: "psychology-concept", title: "Psychology Concept Application", content: "Apply the concept of [CONCEPT - e.g. Cognitive Dissonance] to a real-life scenario. Definition. Example scenario. How people resolve the dissonance (denial, justification, change). Research citation." },
                    { id: "geography-human-impact", title: "Human Geography Impact", content: "Discuss the relationship between [LOCATION'S GEOGRAPHY] and its [CULTURE/ECONOMY]. How did terrain/climate shape development? Migration patterns? Resource usage? Future challenges (Climate change)." },
                    { id: "anthropology-observation", title: "Anthropological Observation", content: "Design a participant observation study for [SETTING - e.g. A coffee shop]. What behaviors to track? (Seating choice, Social interaction duration). Ethical considerations. How to remain objective/reflexive." },
                    { id: "economics-supply-demand", title: "Supply and Demand Shift", content: "Explain how [EVENT - e.g. A drought] affects the market for [PRODUCT - e.g. Wheat]. Shift in Supply curve (Left/Right?). Impact on Equilibrium Price and Quantity. Short term vs Long term elasticity." },
                    { id: "religious-studies-comparison", title: "Comparative Religion", content: "Compare the concept of [CONCEPT - e.g. Afterlife] in [RELIGION A] and [RELIGION B]. Scriptural basis. Rituals associated. Impact on moral conduct of believers. Shared historical roots?" },
                    { id: "philosophy-ethics-trolley", title: "Ethical Thought Experiment", content: "Analyze the [THOUGHT EXPERIMENT - e.g. Trolley Problem] through the lens of Utilitarianism vs Deontology. What would Bentham do? What would Kant do? Real world application (Autonomous Vehicles)." },
                    { id: "music-theory-basics", title: "Music Theory Explanation", content: "Explain the Circle of Fifths. Visualizing the relationship between keys. How to use it for chord progressions. Determining the relative minor. Why it's useful for songwriting." },
                    { id: "linguistics-syntax-tree", title: "Linguistics Syntax Tree", content: "Draw (describe) a Syntax Tree for the sentence '[SENTENCE]'. Identify Noun Phrase (NP), Verb Phrase (VP). Grammatical role of each constituent. Is it ambiguous? (Structural ambiguity)." },
                    { id: "film-studies-shot-analysis", title: "Film Shot Analysis", content: "Analyze the use of [TECHNIQUE - e.g. Dutch Angle] in [FILM]. What emotional effect does it create? (Unease, madness). Contextualize with the plot moment. Lighting and Sound contribution." },
                    { id: "journalism-article-structure", title: "Inverted Pyramid Structure", content: "Rewrite this story [DETAILS] using the Inverted Pyramid style. 1. The Lede (Who, what, when, where, why - 30 words). 2. Key Details (Evidence/Quotes). 3. Background/Context (Least important)." }
                ]
            },
            {
                id: "philosophy-logic",
                name: "Philosophy & Logic",
                icon: "🤔",
                prompts: [
                    { id: "identify-fallacy", title: "Identify Logical Fallacy", content: "Identify the logical fallacy in this argument: '[ARGUMENT]'. Options: Ad Hominem, Straw Man, Slippery Slope, False Dichotomy. Explain why the reasoning is flawed. Correct the argument to be valid." },
                    { id: "socratic-method-dialogue", title: "Socratic Dialogue Generator", content: "Simulate a Socratic Dialogue on the topic of [TOPIC - e.g. Justice]. The User makes a claim. The AI acts as Socrates, asking probing questions to reveal contradictions or lack of definition. Goal: Aporia (puzzlement) and deeper truth." },
                    { id: "stoicism-application", title: "Apply Stoic Principles", content: "Apply Stoicism to [SITUATION - e.g. Getting fired]. Dichotomy of Control: What is in my power? (Reaction, resume). What is not? (The decision, economy). Premeditatio Malorum (Negative visualization). Advice from Marcus Aurelius." },
                    { id: "formal-logic-proof", title: "Formal Logic Translation", content: "Translate this sentence into Symbolic Logic: '[SENTENCE]'. Use operators: AND (∧), OR (∨), NOT (¬), IMPLIES (→). Construct a Truth Table to test validity." },
                    { id: "existentialism-theme", title: "Existentialist Analysis", content: "Analyze [SITUATION] through an Existentialist lens. Concepts: 'Existence precedes Essence', Radical Freedom, Responsibility, Bad Faith. How should the individual act authentically?" },
                    { id: "utilitarian-calculation", title: "Utilitarian Calculus", content: "Perform a Utilitarian calculus for [DECISION]. List Stakeholders. Assign 'Hedons' (Pleasure units) and 'Dolors' (Pain units) for each outcome. intensity, duration, certainty, extent. What is the 'Greatest Good'?" },
                    { id: "epistemology-question", title: "Epistemology: How do we know?", content: "Examine the claim '[CLAIM]' using Epistemology. Sources of knowledge: Perception, Reason, Introspection, Testimony. Is it Justified True Belief? Cartesian Skepticism verification." },
                    { id: "eastern-philosophy", title: "Eastern Philosophy Insight", content: "Interpret [SITUATION] using concepts from [Taoism/Buddhism]. Concepts: Wu Wei (Non-action), Impermanence (Anicca), Attachment (Upadana). Advice for finding balance/peace." },
                    { id: "political-philosophy-contract", title: "Social Contract Theory", content: "Discuss [POLITICAL ISSUE] using Social Contract Theory. Hobbs (Order/Safety) vs Locke (Rights/Property) vs Rousseau (General Will). Is the contract broken? Justification for resistance." },
                    { id: "aesthetics-beauty", title: "Philosophy of Art", content: "Debate: 'Is Beauty Objective or Subjective?' regarding [OBJECT/ART]. Arguments from Hume (Taste) vs Kant (Universal). Role of utility vs pure form." },
                    { id: "metaphysics-experiment", title: "Metaphysical Thought Experiment", content: "Explore the 'Ship of Theseus' paradox regarding [OBJECT - e.g. Band with new members]. If parts are replaced, is identity retained? Theories: Mereological Essentialism vs Spatiotemporal Continuity." },
                    { id: "critical-thinking-skills", title: "Steel Man Argument", content: "Create a 'Steel Man' version of the opposing argument: '[OPPOSING VIEW]'. (Opposite of Straw Man). Present the strongest, most charitable version of their case. Then, and only then, refute it." },
                    { id: "bias-check", title: "Cognitive Bias Check", content: "Check this decision [DECISION] for Cognitive Biases. Confirmation Bias? Sunk Cost Fallacy? Anchoring? Availability Heuristic? How to mitigate them (e.g. Seek disconfirming evidence)." },
                    { id: "ethics-in-tech", title: "AI Ethics Debate", content: "Debate the ethics of [AI SCENARIO - e.g. Deepfakes]. Arguments for (Creativity, Satire). Arguments against (Consent, Misinfo). Principles: Beneficence, Non-maleficence, Justice. Regulatory suggestions." },
                    { id: "logic-puzzle-riddle", title: "Solve a Riddle", content: "Solve this riddle: '[RIDDLE]'. Break it down laterally. Question assumptions. Look for wordplay. Provide the answer and the 'aha' moment explanation." }
                ]
            },
            {
                id: "special-education",
                name: "Special Education",
                icon: "🧩",
                prompts: [
                    { id: "iep-accommodations", title: "Suggest Accommodations", content: "Suggest classroom accommodations for a student with [DIAGNOSIS - e.g. ADHD / Dyslexia]. Categories: Environment (Seating), Instruction (Chunking), Assessment (Extra time), Tools (Text-to-speech). Justification for each." },
                    { id: "social-story-creator", title: "Social Story Creator", content: "Write a Social Story for [SITUATION - e.g. Fire Drill] for a child with Autism. Structure: Descriptive sentences (facts), Perspective sentences (feelings), Directive sentences (what to do). Tone: Reassuring, first-person ('I will...')." },
                    { id: "behavior-intervention-plan", title: "BIP Strategies", content: "Brainstorm strategies for a Behavior Intervention Plan (BIP). Behavior: [TARGET BEHAVIOR]. Function: [E.g. Escape / Attention]. Antecedent strategies (Prevention). Replacement behaviors (What to do instead). Consequence strategies." },
                    { id: "sensory-diet", title: "Sensory Diet Ideas", content: "Suggest 'Sensory Diet' activities for a student who is [SEEKING/AVOIDING] stimulation. Heavy work ideas (carrying books). Vestibular (spinning/swinging). Tactile (fidgets). Auditory (headphones). Scheduling them throughout the day." },
                    { id: "visual-schedule", title: "Visual Schedule Design", content: "Design a Visual Schedule for [ROUTINE - e.g. Morning Arrival]. Steps broken down. Visual format description (Pictures + Text). Checkbox system. Importance of predictability for anxiety reduction." },
                    { id: "assistive-tech", title: "Assistive Technology Tools", content: "Recommend Assistive Tech for [NEED - e.g. Graphic writing]. Low tech (Pencil grips, Slant boards). High tech (Speech-to-text, Prediction software). iPad apps suggestions. Implementation tip." },
                    { id: "executive-function-support", title: "Executive Function Support", content: "Strategies to support Executive Dysfunction (Organization/Planning). Color coding systems. Checklists. Timer usage (Time blindness). 'Body Doubling'. Scaffolding large projects." },
                    { id: "gifted-enrichment", title: "Gifted Enrichment Task", content: "Create an enrichment task for a Gifted student who finishes early. Topic: [TOPIC]. extensions: Depth and Complexity icons (Ethics, Patterns, Multiple perspectives). Avoid: 'Just more work'. Goal: Creative synthesis." },
                    { id: "universal-design-learning", title: "UDL Lesson Check", content: "Review this lesson plan [PLAN] for Universal Design for Learning (UDL). Multiple Means of Representation (Show it ways). Multiple Means of Action (Let them show knowing ways). Multiple Means of Engagement (Hook them ways)." },
                    { id: "communication-board", title: "AAC Board Layout", content: "Design a basic AAC (Augmentative and Alternative Communication) board for [CONTEXT - e.g. Snack time]. Core words (Want, More, Stop, Help). Fringe words (Cracker, Juice, Open). Layout best practices (Fitzgerald Key colors)." },
                    { id: "dyslexia-friendly-text", title: "Dyslexia Friendly Formatting", content: "Format this text [TEXT] to be Dyslexia-friendly. Font: Sans-serif (Arial/OpenDyslexic). Size: 12-14pt. Spacing: 1.5 line height. Left align (no justify). Avoid italics (use bold). Short paragraphs." },
                    { id: "emotional-regulation", title: "Emotional Regulation Tools", content: "Teach Emotional Regulation using 'The Zones of Regulation' concept. Blue (Sad/Tired), Green (Ready), Yellow (Frustrated), Red (Mad). Tool ideas for moving back to Green (Breathing, Drink water, Walk)." },
                    { id: "transition-strategies", title: "Transition Strategies", content: "Strategies for a student who struggles with transitions (stopping tasks). Priming ('5 mins left'). Visual timer. Transition object. Song/Chant. Reduced verbal instructions during the switch." },
                    { id: "peer-buddy-training", title: "Peer Buddy Training", content: "Script for training a 'Peer Buddy'. How to help [STUDENT] without doing the work for them. How to model social interaction. When to ask a teacher for help. Encouraging independence." },
                    { id: "data-collection-sheet", title: "ABC Data Sheet", content: "Create an ABC (Antecedent - Behavior - Consequence) Data collection sheet. Fields: Date/Time, Context, Antecedent (What happened right before?), Behavior (Specific description), Consequence (What happened after?), Intensity (1-5)." }
                ]
            },
            {
                id: "professional-development",
                name: "Professional Development",
                icon: "🚀",
                prompts: [
                    { id: "career-vision-board", title: "Career Vision Plan", content: "Draft a 5-year Career Vision. 1. Ultimate Goal (Role/Impact). 2. Skills gap analysis (What do I need?). 3. Experience milestones. 4. Network to build. 5. Core Values alignment. " },
                    { id: "skill-acquisition-plan", title: "Quick Skill Acquisition", content: "Create a 20-hour plan to learn [SKILL - e.g. Excel Macros]. Deconstruct the skill into sub-skills. Learn enough to self-correct. Remove practice barriers. Practice continuously. Resources to use." },
                    { id: "soft-skills-training", title: "Soft Skills Scenario", content: "Scenario to practice [SOFT SKILL - e.g. Conflict Resolution]. Context: Disagreement with a coworker. Script a response using 'I' statements. Active listening techniques to demonstrate. Compromise proposal." },
                    { id: "leadership-philosophy", title: "Leadership Philosophy", content: "Draft a personal Leadership Philosophy. 'I believe leadership is...'. 'My expectations for myself...'. 'My expectations for my team...'. 'How I handle failure'. 'How I celebrate success'. Authentic and actionable." },
                    { id: "networking-strategy", title: "Networking Strategy", content: "Plan to build a professional network in [INDUSTRY]. 1. Target list (Companies/Roles). 2. Outreach method (LinkedIn warmth). 3. Value add (What can I offer?). 4. Maintenance (Quarterly check-ins). 5. Event attendance." },
                    { id: "certification-study-guide", title: "Certification Study Guide", content: "Study guide outline for [CERT - e.g. AWS Cloud Practitioner]. Domain breakdown. Heavy weighted topics. Official docs vs Cheatsheets. Practice exam strategy. Exam day logistics." },
                    { id: "resume-action-verbs", title: "Resume Bullet Enhancer", content: "Rewrite these resume bullets using strong Action Verbs: [PASTE BULLETS]. Formula: Action Verb + Task + Result (Metric). e.g. 'Managed team' -> 'Spearheaded cross-functional team of 5, resulting in 20% efficiency gain'." },
                    { id: "interview-prep-star", title: "STAR Interview Prep", content: "Prepare a STAR story for the question: '[QUESTION - e.g. Tell me about a failure]'. Situation (Context). Task (Challenge). Action (What YOU did). Result (Outcome/Learning). Check for brevity and impact." },
                    { id: "salary-negotiation-script", title: "Salary Negotiation Script", content: "Script for negotiating salary. Opening: Express enthusiasm. The Ask: 'Based on my research and experience, I'm looking for...'. Justification: Unique value/Accomplishments. Handling objections: 'What flexibility exists?'. Closing." },
                    { id: "public-speaking-tips", title: "Public Speaking confidence", content: "Tips to improve Public Speaking for [CONTEXT - e.g. Team Meeting]. Structure (Tell them what you'll tell them). Body language (Eye contact, hands). Voice (Pacing, pauses). slide design (Less text). Handling Q&A." },
                    { id: "time-management-matrix", title: "prioritization Matrix", content: "Sort these tasks [TASKS] into the Eisenhower Matrix. 1. Urgent/Important (Do now). 2. Not Urgent/Important (Schedule - Innovation). 3. Urgent/Not Important (Delegate). 4. Not Urgent/Not Important (Delete). Goal: More time in Box 2." },
                    { id: "feedback-request-email", title: "Requesting Feedback", content: "Draft an email to a manager asking for constructive feedback. Specificity: 'I'm working on [SKILL]'. context: 'Regarding the recent project'. openness: 'Please be honest, I want to grow'. Scheduling a brief chat." },
                    { id: "mentorship-meeting-agenda", title: "Mentorship Meeting Agenda", content: "Agenda for a 30-min meeting with a Mentor. 1. Update on action items from last time (5m). 2. Current Challenge/Question (15m). 3. Feedback on [SPECIFIC WORK] (5m). 4. Next steps/Thank you (5m)." },
                    { id: "personal-branding", title: "LinkedIn Profile Optimization", content: "Checklist to optimize LinkedIn profile. Headline: Role + Value Prop. About: Story format (Hook, Background, Skills, Call to Action). Featured section: Portfolio/Links. Skills endorsements. Activity: Commenting strategy." },
                    { id: "remote-work-best-practices", title: "Remote Work Efficiency", content: "Best practices for Remote Work. Communication: Over-communicate status (Async first). Meetings: No agenda = No meeting. Workspace: Ergonomics. Routine: Start/End rituals to separate work/life. Visibility: Weekly snippets." }
                ]
            },
            {
                id: "educational-games",
                name: "Educational Games",
                icon: "🎲",
                prompts: [
                    { id: "trivia-generator", title: "Trivia Question Generator", content: "Generate 10 Trivia questions on [TOPIC]. Difficulty: Progressive (Easy to Hard). Format: Question, Answer, interesting 'Did you know?' fact. Mix of visual/text questions descriptions." },
                    { id: "two-truths-lie", title: "Two Truths and a Lie", content: "Generate 3 statements about [TOPIC/PERSON], where two are true and one is a lie (but plausible). Reveal the lie and explain the truth correction. Great for history or science facts." },
                    { id: "roleplay-scenario-game", title: "Roleplay Simulation", content: "Setup a text-based roleplay game. Setting: [SETTING - e.g. Ancient Rome]. Role: User is a [ROLE]. Goal: [GOAL]. The AI describes the scene and offers 3 choices. User picks one, story advances. Educational context." },
                    { id: "word-ladder", title: "Word Ladder Puzzle", content: "Create a Word Ladder puzzle. Start word: [START]. End word: [END]. Rule: Change one letter at a time to make a new valid word. Hint for each step. Definition of the final word." },
                    { id: "escape-room-puzzle", title: "Classroom Escape Room", content: "Design a logic puzzle for a 'Digital Escape Room'. Theme: [THEME]. Puzzle: Decipher a code based on [SUBJECT CLUES]. Solution reveals a 4-digit lock code. Hint system included." },
                    { id: "jeopardy-board", title: "Jeopardy Board Content", content: "Create content for a Jeopardy board. Categories: 5 topics related to [SUBJECT]. Values: 100-500. Answers (which are the questions) and Questions (which are the answers). 'Daily Double' placement." },
                    { id: "scavenger-hunt-list", title: "Educational Scavenger Hunt", content: "Create a Scavenger Hunt list for [LOCATION - e.g. Museum/Park]. Items to find: 'Something that shows [CONCEPT]'. 'A primary source document'. 'An example of [BIOLOGY TERM]'. Photo proof required." },
                    { id: "debate-topics-fun", title: "Fun Debate Topics", content: "List 10 lighthearted debate topics for students. e.g. 'Is a Hot Dog a Sandwich?'. 'Cats vs Dogs'. 'Video games as a sport'. Goal: Practice argumentation structure without heavy political stakes." },
                    { id: "flashcard-gamification", title: "Gamified Review Ideas", content: "Ideas to gamify flashcard review. 1. 'Around the World' (Speed competition). 2. 'Pictionary' (Draw the term). 3. 'Taboo' (Describe without using forbidden words). 4. 'Memory Match' (Grid layout)." },
                    { id: "math-riddle", title: "Math Riddle", content: "Create a math riddle. 'I am an odd number. Take away a letter and I become even. What am I? (Seven)'. Or number property riddles. 'I have 3 digits...'." },
                    { id: "story-cubes", title: "Story Cubes Prompts", content: "Simulate 'Story Cubes'. Roll 1: [OBJECT]. Roll 2: [ACTION]. Roll 3: [SETTING]. Prompt: Write a short story incorporating all 3 elements. Focus on narrative structure." },
                    { id: "timeline-ordering", title: "Timeline Ordering Game", content: "List 5 historical events related to [TOPIC] in scrambled order. Task: Put them in chronological order. Reveal correct order with dates and one sentence context for each." },
                    { id: "concept-charades", title: "Concept Charades", content: "List of words for 'Concept Charades' for [SUBJECT]. Rules: No talking. Act out [PROCESS/TERM]. Variation: 'Pictionary' on whiteboard. Difficulty levels." },
                    { id: "choose-adventure-history", title: "Historical CYPHER", content: "Create a 'Choose Your Own Adventure' decision point based on history. Context: You are [FIGURE] in [YEAR]. Crisis: [EVENT]. Choice A: Attack. Choice B: Negotiate. Choice C: Retreat. Reveal historical outcome." },
                    { id: "mystery-object", title: "Mystery Object (20 Questions)", content: "I am thinking of an object related to [SUBJECT]. You can ask 20 Yes/No questions to guess what it is. (AI tracks the object and answers). Object: [HIDDEN OBJECT]." }
                ]
            }
        ]
    },
        {
        id: "education-course-prompts",
        name: "Education & Community Management",
        icon: "🎓",
        description: "Course planning, community management, and onboarding",
        folders: [
            {
                id: "course-curriculum-design",
                name: "Course Curriculum Design & Planning",
                icon: "📚",
                prompts: [
                    { id: "syllabus-gen", title: "Course Scheduling & Syllabus", content: "Develop a 6-week course syllabus for [Topic: Intro to Python / Digital Marketing]. Week-by-week breakdown: Learning Objective, Key Topics, Practical Exercises/Assignments, and Resources. Ensure a logical progression from beginner to intermediate concepts." },
                    { id: "lesson-plan", title: "Detailed Lesson Plan", content: "Create a 60-minute lesson plan for [Specific Topic]. Sections: Learning Goals, Warm-up Activity (5 min), Core Instruction (20 min), Guided Practice (15 min), Independent Activity (15 min), and Wrap-up/Assessment. Include discussion questions." }
                ]
            },
            {
                id: "community-engagement-strategy",
                name: "Community Engagement Strategy",
                icon: "🤝",
                prompts: [
                    { id: "community-engagement", title: "Community Engagement Plan", content: "Draft a plan to increase engagement in a [Slack/Discord/Facebook] community. Ideas: Weekly rituals (e.g., Show & Tell Fridays), AMAs with experts, Contests/Challenges, and Recognition (Member of the Month). Define metrics to measure success (active users, comments per post)." },
                    { id: "onboarding-flow", title: "Customer Onboarding Sequence", content: "Design an onboarding email/message sequence for new community members. Day 1: Welcome & Mission. Day 3: 'How to get started' / Tour. Day 7: 'Introduce yourself' prompt. Day 14: Value-add resource. Goal is to turn new signups into active contributors." }
                ]
            }
        ]
    }];

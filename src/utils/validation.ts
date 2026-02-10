// Content validation utilities

const PROFANITY_WORDS = [
    'fuck', 'shit', 'damn', 'bitch', 'ass', 'bastard', 'crap',
    'piss', 'dick', 'cock', 'pussy', 'fag', 'slut', 'whore'
];

export function containsProfanity(text: string): boolean {
    const lowerText = text.toLowerCase();
    return PROFANITY_WORDS.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(lowerText);
    });
}

export function containsURL(text: string): boolean {
    // Check for common URL patterns
    const urlPatterns = [
        /https?:\/\//i,
        /www\./i,
        /\b[a-z0-9]+\.(com|net|org|io|co|dev|app|xyz|me|info|biz)\b/i,
        /\b[a-z0-9-]+\.[a-z]{2,}\//i
    ];

    return urlPatterns.some(pattern => pattern.test(text));
}

export interface SubmissionLimits {
    hasRecentSubmission: boolean;
    submissionsToday: number;
    maxSubmissionsPerDay: number;
    cooldownRemaining: number;
}

export function checkSubmissionLimits(): SubmissionLimits {
    const now = Date.now();
    const lastPostTime = localStorage.getItem('last_prompt_post_time');
    const todayStart = new Date().setHours(0, 0, 0, 0);

    // Get today's submissions
    const submissionsData = localStorage.getItem('prompt_submissions');
    let submissions: number[] = [];
    if (submissionsData) {
        try {
            submissions = JSON.parse(submissionsData);
            // Filter to only today's submissions
            submissions = submissions.filter(timestamp => timestamp >= todayStart);
        } catch (e) {
            submissions = [];
        }
    }

    const submissionsToday = submissions.length;
    const maxSubmissionsPerDay = 10;

    // Check 30 second cooldown
    let cooldownRemaining = 0;
    let hasRecentSubmission = false;
    if (lastPostTime) {
        const timeSince = now - parseInt(lastPostTime);
        if (timeSince < 30000) { // 30 seconds
            hasRecentSubmission = true;
            cooldownRemaining = Math.ceil((30000 - timeSince) / 1000);
        }
    }

    return {
        hasRecentSubmission,
        submissionsToday,
        maxSubmissionsPerDay,
        cooldownRemaining
    };
}

export function recordSubmission(): void {
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);

    // Update last post time
    localStorage.setItem('last_prompt_post_time', now.toString());

    // Update today's submissions
    const submissionsData = localStorage.getItem('prompt_submissions');
    let submissions: number[] = [];
    if (submissionsData) {
        try {
            submissions = JSON.parse(submissionsData);
            submissions = submissions.filter(timestamp => timestamp >= todayStart);
        } catch (e) {
            submissions = [];
        }
    }
    submissions.push(now);
    localStorage.setItem('prompt_submissions', JSON.stringify(submissions));
}

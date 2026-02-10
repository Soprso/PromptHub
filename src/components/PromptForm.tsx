import { useState, useEffect } from 'react';
import { communityApi } from '../lib/communityApi';
import { containsProfanity, containsURL, checkSubmissionLimits, recordSubmission } from '../utils/validation';

const MODELS = ['ChatGPT', 'Claude', 'Midjourney', 'Gemini', 'Llama', 'Other'];
const MAX_CHARS = 3000;

export default function PromptForm({ onSuccess }: { onSuccess?: () => void }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [model, setModel] = useState('ChatGPT');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const limits = checkSubmissionLimits();
    const charCount = content.length;
    const isOverLimit = charCount > MAX_CHARS;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        // Validation
        if (!title.trim() || !content.trim()) {
            setError('Title and Content are required.');
            setIsSubmitting(false);
            return;
        }

        // Character limit
        if (content.length > MAX_CHARS) {
            setError(`Content exceeds ${MAX_CHARS} character limit.`);
            setIsSubmitting(false);
            return;
        }

        // Rate limit check - 30 second cooldown
        if (limits.hasRecentSubmission) {
            setError(`Please wait ${limits.cooldownRemaining} seconds before posting again.`);
            setIsSubmitting(false);
            return;
        }

        // Daily limit check - 10 per day
        if (limits.submissionsToday >= limits.maxSubmissionsPerDay) {
            setError(`Daily limit reached. You can submit up to ${limits.maxSubmissionsPerDay} prompts per day.`);
            setIsSubmitting(false);
            return;
        }

        // URL check
        if (containsURL(title) || containsURL(content)) {
            setError('Links are not allowed in prompts.');
            setIsSubmitting(false);
            return;
        }

        // Profanity check
        if (containsProfanity(title) || containsProfanity(content)) {
            setError('Inappropriate language detected. Please keep prompts professional.');
            setIsSubmitting(false);
            return;
        }

        try {
            await communityApi.submitPrompt({
                title,
                content,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                model
            });

            recordSubmission();
            setSuccess('Prompt submitted successfully! It will appear in the community feed after approval.');

            // Reset Form
            setTitle('');
            setContent('');
            setTags('');
            setModel('ChatGPT');

            if (onSuccess) onSuccess();

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to submit prompt. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "2rem"
            }}
        >
            <h2 style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                color: "var(--text-primary)"
            }}>
                Submit Prompt
            </h2>

            {error && (
                <div style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#FEE2E2",
                    color: "#991B1B",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    border: "1px solid #FECACA"
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#D1FAE5",
                    color: "#065F46",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    border: "1px solid #A7F3D0"
                }}>
                    {success}
                </div>
            )}

            <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)"
                }}>
                    Title <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Python Code Generator"
                    required
                    maxLength={200}
                    style={{
                        width: "100%",
                        padding: "0.625rem 0.875rem",
                        border: "1px solid var(--border-color)",
                        borderRadius: "6px",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s",
                        outline: "none"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <label style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--text-primary)"
                    }}>
                        Prompt Content <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <span style={{
                        fontSize: "0.75rem",
                        color: isOverLimit ? "#DC2626" : "var(--text-muted)"
                    }}>
                        {charCount}/{MAX_CHARS}
                    </span>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your prompt here..."
                    rows={8}
                    required
                    maxLength={MAX_CHARS}
                    style={{
                        width: "100%",
                        padding: "0.625rem 0.875rem",
                        border: `1px solid ${isOverLimit ? "#DC2626" : "var(--border-color)"}`,
                        borderRadius: "6px",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                        fontFamily: "'Fira Code', monospace",
                        transition: "border-color 0.2s",
                        outline: "none",
                        resize: "vertical"
                    }}
                    onFocus={(e) => {
                        if (!isOverLimit) e.currentTarget.style.borderColor = "var(--accent-color)";
                    }}
                    onBlur={(e) => {
                        if (!isOverLimit) e.currentTarget.style.borderColor = "var(--border-color)";
                    }}
                />
                <p style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: "0.5rem",
                    marginBottom: 0
                }}>
                    No links allowed • Markdown supported
                </p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem"
            }}>
                <div>
                    <label style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        marginBottom: "0.5rem",
                        color: "var(--text-primary)"
                    }}>
                        Tags
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="coding, python, devs"
                        style={{
                            width: "100%",
                            padding: "0.625rem 0.875rem",
                            border: "1px solid var(--border-color)",
                            borderRadius: "6px",
                            backgroundColor: "var(--bg-primary)",
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                            fontFamily: "inherit",
                            transition: "border-color 0.2s",
                            outline: "none"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                    />
                    <p style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: "0.5rem",
                        marginBottom: 0
                    }}>
                        Comma separated
                    </p>
                </div>

                <div>
                    <label style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        marginBottom: "0.5rem",
                        color: "var(--text-primary)"
                    }}>
                        AI Model
                    </label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.625rem 0.875rem",
                            border: "1px solid var(--border-color)",
                            borderRadius: "6px",
                            backgroundColor: "var(--bg-primary)",
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                            fontFamily: "inherit",
                            transition: "border-color 0.2s",
                            outline: "none",
                            cursor: "pointer"
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                    >
                        {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            {/* Submission info */}
            <div style={{
                marginBottom: "1.5rem",
                padding: "0.75rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "6px",
                fontSize: "0.75rem",
                color: "var(--text-secondary)"
            }}>
                <p style={{ margin: 0, marginBottom: "0.25rem" }}>
                    <strong>Submissions today:</strong> {limits.submissionsToday}/{limits.maxSubmissionsPerDay}
                </p>
                {limits.hasRecentSubmission && (
                    <p style={{ margin: 0, color: "#DC2626" }}>
                        <strong>Cooldown:</strong> {limits.cooldownRemaining}s remaining
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || isOverLimit || limits.hasRecentSubmission || limits.submissionsToday >= limits.maxSubmissionsPerDay}
                style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: (isSubmitting || isOverLimit || limits.hasRecentSubmission || limits.submissionsToday >= limits.maxSubmissionsPerDay) ? "var(--bg-secondary)" : "var(--accent-color)",
                    color: (isSubmitting || isOverLimit || limits.hasRecentSubmission || limits.submissionsToday >= limits.maxSubmissionsPerDay) ? "var(--text-muted)" : "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: (isSubmitting || isOverLimit || limits.hasRecentSubmission || limits.submissionsToday >= limits.maxSubmissionsPerDay) ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit"
                }}
                onMouseEnter={(e) => {
                    if (!isSubmitting && !isOverLimit && !limits.hasRecentSubmission && limits.submissionsToday < limits.maxSubmissionsPerDay) {
                        e.currentTarget.style.opacity = "0.9";
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                }}
            >
                {isSubmitting ? 'Submitting...' : 'Share Prompt'}
            </button>

            <p style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: "1rem",
                marginBottom: 0,
                textAlign: "center"
            }}>
                Prompts are moderated • No spam or inappropriate content • Max 10 per day
            </p>
        </form>
    );
}

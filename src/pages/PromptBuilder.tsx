import { useState, useMemo } from "react";
import "./PromptBuilder.css";

interface Template {
    id: string;
    name: string;
    prompt: string;
}

const templates: Template[] = [
    {
        id: "image",
        name: "Image Generation",
        prompt: "Create a {style} {shot_type} of {subject} in {lighting} with {mood} mood, {camera} camera, high detail"
    },
    {
        id: "video",
        name: "Video Generation",
        prompt: "Generate a {duration} {style} video of {subject} with {camera_movement} camera movement, {lighting} lighting, {mood} atmosphere, {fps} fps"
    },
    {
        id: "writing",
        name: "Writing",
        prompt: "Write a {tone} {format} about {topic} for {audience} audience, {length} length, {style} style"
    },
    {
        id: "coding",
        name: "Coding",
        prompt: "Write {language} code to {task} using {framework}, with {style} code style, include {features}"
    }
];

// Preset options for each variable
const presets: Record<string, string[]> = {
    // Image Generation
    style: ["cinematic", "photorealistic", "anime", "3D render", "studio photography", "minimalist", "watercolor illustration", "oil painting", "cyberpunk", "fantasy art", "vintage film", "pixel art", "isometric", "flat design", "hyperreal"],
    shot_type: ["close-up", "portrait", "full body", "wide shot", "macro", "aerial view", "top-down", "over-the-shoulder", "product shot", "street photography", "candid", "hero shot"],
    lighting: ["soft light", "golden hour", "studio lighting", "neon glow", "dramatic shadows", "rim light", "backlit", "natural daylight", "low key", "high key", "volumetric light", "moody dark"],
    mood: ["calm", "dreamy", "energetic", "mysterious", "dark", "romantic", "cozy", "epic", "playful", "minimal", "luxurious", "futuristic"],
    camera: ["35mm lens", "50mm lens", "85mm portrait lens", "wide angle", "telephoto", "DSLR", "mirrorless", "film camera", "polaroid", "fisheye", "cinema camera", "IMAX"],
    subject: ["person", "landscape", "product", "animal", "building", "food", "nature", "abstract", "vehicle", "interior"],

    // Video Generation
    duration: ["15 second", "30 second", "1 minute", "2 minute", "5 minute", "short clip", "long form"],
    camera_movement: ["tracking shot", "handheld", "steadycam", "dolly zoom", "static", "pan", "tilt", "crane shot", "drone flyover", "gimbal smooth"],
    fps: ["24fps cinematic", "30fps standard", "60fps smooth", "120fps slow motion", "240fps ultra slow-mo"],

    // Writing
    tone: ["professional", "casual", "friendly", "formal", "humorous", "persuasive", "informative", "inspirational", "conversational", "authoritative"],
    format: ["blog post", "article", "essay", "email", "social media post", "product description", "story", "script", "tutorial", "guide"],
    topic: ["technology", "business", "health", "lifestyle", "education", "entertainment", "travel", "food", "fashion", "sports"],
    audience: ["general public", "professionals", "beginners", "experts", "students", "business owners", "developers", "marketers"],
    length: ["short (100-300 words)", "medium (300-700 words)", "long (700-1500 words)", "comprehensive (1500+ words)"],

    // Coding
    language: ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"],
    task: ["API endpoint", "data validation", "authentication", "database query", "file processing", "algorithm", "UI component", "utility function"],
    framework: ["React", "Vue", "Angular", "Next.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "Rails"],
    features: ["error handling", "TypeScript types", "unit tests", "comments", "async/await", "validation", "logging"]
};

export default function PromptBuilder() {
    const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState(false);

    const currentTemplate = useMemo(
        () => templates.find(t => t.id === selectedTemplate) || templates[0],
        [selectedTemplate]
    );

    const extractedVariables = useMemo(() => {
        const matches = currentTemplate.prompt.match(/\{([^}]+)\}/g);
        return matches ? matches.map(m => m.slice(1, -1)) : [];
    }, [currentTemplate]);

    const generatedPrompt = useMemo(() => {
        let result = currentTemplate.prompt;
        extractedVariables.forEach(varName => {
            let value = variables[varName] || `{${varName}}`;
            // If custom is selected, use the custom value
            if (value === 'custom') {
                value = variables[`${varName}_custom`] || `{${varName}}`;
            }
            result = result.replace(new RegExp(`\\{${varName}\\}`, 'g'), value);
        });
        return result;
    }, [currentTemplate, extractedVariables, variables]);

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        setVariables({});
    };

    const handleVariableChange = (varName: string, value: string) => {
        setVariables(prev => ({ ...prev, [varName]: value }));
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setVariables({});
    };

    return (
        <div className="prompt-builder">
            <div className="builder-header">
                <h1>Prompt Builder</h1>
                <p>Build custom AI prompts with dynamic templates</p>
            </div>

            <div className="builder-content">
                <div className="builder-section">
                    <label htmlFor="template-select" className="builder-label">
                        Select Template
                    </label>
                    <select
                        id="template-select"
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="builder-select"
                    >
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>

                {extractedVariables.length > 0 && (
                    <div className="builder-section">
                        <label className="builder-label">Variables</label>
                        <div className="builder-inputs">
                            {extractedVariables.map(varName => {
                                const options = presets[varName] || [];

                                return (
                                    <div key={varName} className="builder-input-group">
                                        <label htmlFor={`var-${varName}`} className="input-label">
                                            {varName.replace(/_/g, ' ')}
                                        </label>
                                        <select
                                            id={`var-${varName}`}
                                            value={variables[varName] || ''}
                                            onChange={(e) => handleVariableChange(varName, e.target.value)}
                                            className="builder-select"
                                        >
                                            <option value="">Select {varName.replace(/_/g, ' ')}</option>
                                            {options.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                            <option value="custom">✎ Custom</option>
                                        </select>

                                        {variables[varName] === 'custom' && (
                                            <input
                                                type="text"
                                                placeholder={`Enter custom ${varName.replace(/_/g, ' ')}`}
                                                className="builder-custom-input"
                                                onChange={(e) => handleVariableChange(`${varName}_custom`, e.target.value)}
                                                autoFocus
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="builder-section">
                    <label htmlFor="generated-prompt" className="builder-label">
                        Generated Prompt
                    </label>
                    <textarea
                        id="generated-prompt"
                        value={generatedPrompt}
                        readOnly
                        className="builder-textarea"
                        rows={4}
                    />
                </div>

                <div className="builder-actions">
                    <button onClick={handleCopy} className="builder-button builder-button-secondary">
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button onClick={handleReset} className="builder-button builder-button-secondary">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

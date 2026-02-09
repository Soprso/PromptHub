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
            const value = variables[varName] || `{${varName}}`;
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
                            {extractedVariables.map(varName => (
                                <div key={varName} className="builder-input-group">
                                    <label htmlFor={`var-${varName}`} className="input-label">
                                        {varName.replace(/_/g, ' ')}
                                    </label>
                                    <input
                                        id={`var-${varName}`}
                                        type="text"
                                        value={variables[varName] || ''}
                                        onChange={(e) => handleVariableChange(varName, e.target.value)}
                                        placeholder={`Enter ${varName.replace(/_/g, ' ')}`}
                                        className="builder-input"
                                    />
                                </div>
                            ))}
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

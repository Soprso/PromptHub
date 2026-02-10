import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { templates, presets } from "../data/builder-presets";
import "./PromptBuilder.css";

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
            <Helmet>
                <title>AI Prompt Builder – Create Custom Prompts | PromptHub</title>
                <meta name="description" content="Build custom AI prompts with our interactive prompt builder. Create tailored prompts for ChatGPT, Midjourney, DALL·E with dynamic templates for image generation, video, writing, and coding." />
                <meta property="og:title" content="AI Prompt Builder – Create Custom Prompts" />
                <meta property="og:description" content="Interactive tool to build custom AI prompts for any use case. Free, no signup required." />
                <meta property="og:url" content="https://promptshub.shop/builder" />
                <link rel="canonical" content="https://promptshub.shop/builder" />
            </Helmet>
            <div className="builder-header">
                <h1>Prompt Builder</h1>
                <p>Build custom AI prompts with dynamic templates</p>
            </div>

            <div className="builder-content">
                <div className="builder-section">
                    <label htmlFor="template-select" className="builder-label" data-tooltip="Choose the type of AI content you want to create">
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
                                        <label
                                            htmlFor={`var-${varName}`}
                                            className="input-label"
                                            data-tooltip={`Enter value for ${varName.replace(/_/g, ' ')}`}
                                        >
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
                    <button
                        onClick={handleCopy}
                        className="builder-button builder-button-secondary"
                        data-tooltip="Copy result to clipboard"
                    >
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="builder-button builder-button-secondary"
                        data-tooltip="Clear all fields"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

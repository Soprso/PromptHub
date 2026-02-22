import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Loader2 } from 'lucide-react';

interface TryPromptModalProps {
    initialPrompt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function TryPromptModal({ initialPrompt, isOpen, onClose }: TryPromptModalProps) {
    const [promptText, setPromptText] = useState(initialPrompt);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // For simulated streaming
    const [displayedResponse, setDisplayedResponse] = useState('');
    const streamingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const responseEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPromptText(initialPrompt);
            setResponse('');
            setDisplayedResponse('');
            setError('');
            setLoading(false);
            if (streamingRef.current) clearInterval(streamingRef.current);
            // Disable body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable body scroll
            document.body.style.overflow = '';
            if (streamingRef.current) clearInterval(streamingRef.current);
        }

        return () => {
            document.body.style.overflow = '';
        }
    }, [initialPrompt, isOpen]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Simulated streaming effect when `response` changes
    useEffect(() => {
        if (!response) {
            setDisplayedResponse('');
            return;
        }

        // Start streaming
        setDisplayedResponse('');
        let i = 0;
        if (streamingRef.current) clearInterval(streamingRef.current);

        streamingRef.current = setInterval(() => {
            if (i < response.length) {
                // Add chunks of text to make it faster (simulate tokens)
                const chunkSize = Math.max(1, Math.floor(Math.random() * 4) + 1);
                const chunk = response.substring(i, i + chunkSize);
                setDisplayedResponse(prev => prev + chunk);
                i += chunkSize;

                // Auto scroll
                if (responseEndRef.current) {
                    responseEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            } else {
                if (streamingRef.current) clearInterval(streamingRef.current);
            }
        }, 15);

        return () => {
            if (streamingRef.current) clearInterval(streamingRef.current);
        }
    }, [response]);

    if (!isOpen) return null;

    const handleRun = async () => {
        if (!promptText.trim()) return;

        setLoading(true);
        setError('');
        setResponse('');
        setDisplayedResponse('');
        if (streamingRef.current) clearInterval(streamingRef.current);

        try {
            const res = await fetch('/api/run-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptText })
            });

            const text = await res.text();
            let data: any = {};

            try {
                if (text) data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON response:", text);
                data = { error: text || 'Invalid JSON response from server' };
            }

            if (!res.ok) {
                throw new Error(data.error || 'Failed to run prompt API request');
            }

            setResponse(data.output || '');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setResponse('');
        } finally {
            setLoading(false);
        }
    };

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 99999, // Ensure it's above everything
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center'
    };

    const modalStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-secondary)',
        width: isMobile ? '100%' : '650px',
        height: isMobile ? '85vh' : 'auto',
        maxHeight: isMobile ? '85vh' : '90vh',
        borderRadius: isMobile ? '16px 16px 0 0' : '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        animation: isMobile ? 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            backgroundColor: 'var(--accent-color)',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '4px',
                            display: 'flex'
                        }}>
                            <Play size={16} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Try Prompt
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--bg-tertiary, #f3f4f6)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '50%',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.375rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary, #f3f4f6)';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                        aria-label="Close modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    flex: 1,
                    overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Edit Prompt
                        </label>
                        <textarea
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9375rem',
                                lineHeight: 1.5,
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            placeholder="Type your prompt here..."
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleRun}
                            disabled={loading || !promptText.trim()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.625rem',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'var(--primary-color, #3b82f6)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.9375rem',
                                cursor: loading || !promptText.trim() ? 'not-allowed' : 'pointer',
                                opacity: loading || !promptText.trim() ? 0.7 : 1,
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading && promptText.trim()) e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                if (!loading && promptText.trim()) e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                            {loading ? 'Running...' : 'Run Prompt'}
                        </button>
                    </div>

                    {(loading || error || displayedResponse) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                Response
                            </label>
                            <div style={{
                                flex: 1,
                                padding: '1.25rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-primary)',
                                color: error ? '#ef4444' : 'var(--text-primary)',
                                fontSize: '0.9375rem',
                                lineHeight: 1.6,
                                overflowY: 'auto',
                                minHeight: '180px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                position: 'relative'
                            }}>
                                {error ? (
                                    <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <X size={16} /> {error}
                                    </div>
                                ) : loading && !displayedResponse ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                        <Loader2 size={18} className="animate-spin" /> Generating response...
                                    </div>
                                ) : (
                                    <>{displayedResponse}
                                        {response && displayedResponse.length < response.length ?
                                            <span style={{
                                                display: 'inline-block',
                                                width: '8px',
                                                height: '16px',
                                                backgroundColor: 'var(--accent-color)',
                                                marginLeft: '4px',
                                                verticalAlign: 'middle',
                                                animation: 'pulse 1s infinite'
                                            }}></span>
                                            : ''}
                                        <div ref={responseEndRef} />
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}} />
        </div>
    );
}

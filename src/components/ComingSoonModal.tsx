import React, { useEffect, useState } from 'react';
import { X, Rocket, Bot } from 'lucide-react';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    promptContent: string;
}

export default function ComingSoonModal({ isOpen, onClose, promptContent }: ComingSoonModalProps) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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

    if (!isOpen) return null;

    const handleChatGPT = () => {
        window.open(`https://chatgpt.com/?q=${encodeURIComponent(promptContent)}`, '_blank', 'noopener,noreferrer');
    };

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center'
    };

    const modalStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-secondary, #ffffff)',
        width: isMobile ? '100%' : '500px',
        maxHeight: isMobile ? '85vh' : '90vh',
        borderRadius: isMobile ? '24px 24px 0 0' : '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-color, #e5e7eb)',
        animation: isMobile ? 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        padding: '2rem 1.5rem',
        textAlign: 'center'
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'var(--bg-tertiary, #f3f4f6)',
                        border: '1px solid var(--border-color, #e5e7eb)',
                        borderRadius: '50%',
                        color: 'var(--text-muted, #9ca3af)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.375rem',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary, #e5e7eb)';
                        e.currentTarget.style.color = 'var(--text-primary, #111827)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary, #f3f4f6)';
                        e.currentTarget.style.color = 'var(--text-muted, #9ca3af)';
                    }}
                    aria-label="Close modal"
                >
                    <X size={16} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--primary-color, #3b82f6)',
                        borderRadius: '50%',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Rocket size={32} />
                    </div>
                </div>

                <h3 style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary, #111827)',
                    letterSpacing: '-0.02em'
                }}>
                    Try This Prompt — Coming Soon
                </h3>

                <p style={{
                    margin: '0 0 2rem 0',
                    fontSize: '1rem',
                    color: 'var(--text-secondary, #4b5563)',
                    lineHeight: 1.6
                }}>
                    This feature will allow you to run and test prompts directly inside the website.
                    We are currently preparing this feature.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            backgroundColor: 'var(--primary-color, #3b82f6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.2)';
                        }}
                    >
                        Got it
                    </button>

                    <button
                        onClick={handleChatGPT}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary, #111827)',
                            border: '1px solid var(--border-color, #e5e7eb)',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary, #f3f4f6)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Bot size={18} /> Use in ChatGPT instead
                    </button>
                </div>

                <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted, #9ca3af)',
                    fontWeight: 500
                }}>
                    Launching soon. No setup required.
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes slideUp {
                from {transform: translateY(100%); }
            to {transform: translateY(0); }
                }
            @keyframes zoomIn {
                from {opacity: 0; transform: scale(0.95); }
            to {opacity: 1; transform: scale(1); }
                }
            `}} />
        </div>
    );
}

interface TagChipProps {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function TagChip({ tag, isSelected, onClick }: TagChipProps) {
    return (
        <button
            onClick={onClick}
            style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.625rem',
                borderRadius: '12px',
                backgroundColor: isSelected ? 'var(--accent-color)' : 'var(--bg-tertiary, #f3f4f6)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                border: `1px solid ${isSelected ? 'var(--accent-color)' : 'var(--border-color)'}`,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                }
            }}
        >
            {tag}
        </button>
    );
}

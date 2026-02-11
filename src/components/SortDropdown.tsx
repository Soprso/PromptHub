import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
    value: 'newest' | 'most-liked';
    onChange: (value: 'newest' | 'most-liked') => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as 'newest' | 'most-liked')}
                style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
            >
                <option value="newest">Newest</option>
                <option value="most-liked">Most liked</option>
            </select>
        </div>
    );
}

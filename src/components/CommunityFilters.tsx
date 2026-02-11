import SortDropdown from './SortDropdown';
import TagChip from './TagChip';

interface CommunityFiltersProps {
    sortOrder: 'newest' | 'most-liked';
    onSortChange: (order: 'newest' | 'most-liked') => void;
    availableTags: string[];
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
}

export default function CommunityFilters({
    sortOrder,
    onSortChange,
    availableTags,
    selectedTags,
    onTagToggle
}: CommunityFiltersProps) {
    if (availableTags.length === 0) {
        return (
            <div style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                marginBottom: '2rem'
            }}>
                <SortDropdown value={sortOrder} onChange={onSortChange} />
            </div>
        );
    }

    return (
        <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {/* Sort Dropdown */}
                <div>
                    <SortDropdown value={sortOrder} onChange={onSortChange} />
                </div>

                {/* Tag Filters */}
                {availableTags.length > 0 && (
                    <div>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Filter by tag
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                        }}>
                            {availableTags.map(tag => (
                                <TagChip
                                    key={tag}
                                    tag={tag}
                                    isSelected={selectedTags.includes(tag)}
                                    onClick={() => onTagToggle(tag)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

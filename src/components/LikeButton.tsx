import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { getPromptStats, toggleLike } from '../lib/likes';

interface LikeButtonProps {
    promptSlug: string;
}

export function LikeButton({ promptSlug }: LikeButtonProps) {
    const [count, setCount] = useState<number>(0);
    const [liked, setLiked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);

    useEffect(() => {
        let mounted = true;

        const fetchStats = async () => {
            try {
                const stats = await getPromptStats(promptSlug);
                if (mounted) {
                    setCount(stats.count);
                    setLiked(stats.hasLiked);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchStats();

        return () => { mounted = false; };
    }, [promptSlug]);

    const handleToggle = async () => {
        if (updating) return; // Prevent double clicks

        // Optimistic update
        const previousLiked = liked;
        const previousCount = count;

        setLiked(!previousLiked);
        setCount(previousLiked ? Math.max(0, count - 1) : count + 1);
        setUpdating(true);

        try {
            await toggleLike(promptSlug, previousLiked);
        } catch (error) {
            // Revert on error
            setLiked(previousLiked);
            setCount(previousCount);
            console.error('Failed to toggle like:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ height: '24px', width: '40px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }} />
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={updating}
            aria-label={liked ? "Unlike prompt" : "Like prompt"}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: liked ? 'var(--primary-color, #3b82f6)' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
                fontWeight: 500,
            }}
            onMouseEnter={(e) => {
                if (!liked) e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
                if (!liked) e.currentTarget.style.color = 'var(--text-muted)';
            }}
        >
            <ThumbsUp
                size={16}
                className={liked ? "fill-current" : ""}
                style={{
                    fill: liked ? 'currentColor' : 'none',
                    transition: 'transform 0.1s ease',
                }}
            />
            <span>{count}</span>
        </button>
    );
}

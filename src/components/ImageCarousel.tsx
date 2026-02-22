import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type ImageOfDay } from '../lib/imageOfDayApi';
import ImageModal from './ImageModal';

interface ImageCarouselProps {
    images: ImageOfDay[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const [selectedImage, setSelectedImage] = useState<ImageOfDay | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [images]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!images || images.length === 0) return null;

    return (
        <div style={{ position: 'relative', width: '100%', marginBottom: '2rem' }}>
            {/* Left Navigation Arrow */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll('left')}
                    className="carousel-nav-button"
                    style={{ left: '-20px' }}
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Right Navigation Arrow */}
            {showRightArrow && (
                <button
                    onClick={() => scroll('right')}
                    className="carousel-nav-button"
                    style={{ right: '-20px' }}
                    aria-label="Scroll right"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            <div
                ref={scrollContainerRef}
                className="hide-scrollbar"
                style={{
                    display: 'flex',
                    gap: '1.25rem',
                    overflowX: 'auto',
                    padding: '0.75rem 0',
                    scrollSnapType: 'x proximity',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {images.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedImage(item)}
                        style={{
                            flex: '0 0 auto',
                            width: '320px', // Increased size
                            height: '320px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-secondary)',
                            cursor: 'zoom-in',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            scrollSnapAlign: 'start',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                        }}
                        className="carousel-image-card"
                    >
                        <img
                            src={item.image_url}
                            alt="AI generated artwork"
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Custom Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .carousel-nav-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(8px);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    display: flex;
                    alignItems: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .carousel-nav-button:hover {
                    background: #fff;
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
                }

                @media (prefers-color-scheme: dark) {
                    .carousel-nav-button {
                        background: rgba(30, 41, 59, 0.8);
                        color: #fff;
                    }
                    .carousel-nav-button:hover {
                        background: #1e293b;
                    }
                }

                .carousel-image-card:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
                }

                @media (max-width: 768px) {
                    .carousel-image-card {
                        width: 280px !important;
                        height: 280px !important;
                    }
                    .carousel-nav-button {
                        display: none; /* Hide arrows on touch devices for cleaner look */
                    }
                }
                
                @media (max-width: 480px) {
                    .carousel-image-card {
                        width: 240px !important;
                        height: 240px !important;
                    }
                }

            ` }} />

            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage?.image_url || ''}
                altText="AI artwork full preview"
            />
        </div>
    );
}

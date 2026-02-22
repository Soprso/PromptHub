import { useState } from 'react';
import { type ImageOfDay } from '../lib/imageOfDayApi';
import ImageModal from './ImageModal';

interface ImageCarouselProps {
    images: ImageOfDay[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const [selectedImage, setSelectedImage] = useState<ImageOfDay | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <div style={{ position: 'relative', width: '100%', marginBottom: '1.5rem' }}>
            <div
                className="hide-scrollbar"
                style={{
                    display: 'flex',
                    gap: '1rem',
                    overflowX: 'auto',
                    padding: '0.5rem 0',
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
                            width: '260px', // Slightly larger for better impact
                            height: '260px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-secondary)',
                            cursor: 'zoom-in',
                            position: 'relative',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            scrollSnapAlign: 'start',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
                            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                        }}
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

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                @media (max-width: 768px) {
                    div[style*="width: 260px"] {
                        width: 200px !important;
                        height: 200px !important;
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

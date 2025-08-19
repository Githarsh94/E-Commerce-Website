import { useEffect, useRef } from 'react';

type BackgroundProps = {
    url: string;
};

function Background({ url }: BackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');

    useEffect(() => {
        if (isVideo && videoRef.current) {
            const video = videoRef.current;
            
            // Optimize video performance
            video.addEventListener('loadstart', () => {
                // Video loading started
            });
            
            video.addEventListener('canplay', () => {
                // Video can start playing
            });
            
            video.addEventListener('error', (e) => {
                console.error('Video error:', e);
            });

            // Preload metadata only to save bandwidth
            video.preload = 'metadata';
            
            return () => {
                video.removeEventListener('loadstart', () => {});
                video.removeEventListener('canplay', () => {});
                video.removeEventListener('error', () => {});
            };
        }
    }, [url, isVideo]);

    return (
        <div id="blurBackground">
            {isVideo ? (
                <video 
                    ref={videoRef}
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    preload="metadata"
                    src={url}
                    style={{ willChange: 'auto' }}
                ></video>
            ) : (
                <img src={url} alt="Background" loading="lazy" />
            )}
        </div>
    );
}

export default Background;

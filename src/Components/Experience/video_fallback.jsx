import { useEffect, useRef, useState } from "react";

export default function VideoWithFallback({ src, poster, className }) {
    const videoRef = useRef(null);
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const tryPlay = async () => {
            try {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    await playPromise;
                }
            } catch {
                setShowFallback(true);
            }
        };

        const onPlaying = () => setShowFallback(false);
        const onError = () => setShowFallback(true);

        video.addEventListener("playing", onPlaying);
        video.addEventListener("error", onError);

        tryPlay();

        // If it never starts within 300ms → assume blocked
        const timeout = setTimeout(() => {
            if (video.paused) setShowFallback(true);
        }, 300);

        return () => {
            clearTimeout(timeout);
            video.removeEventListener("playing", onPlaying);
            video.removeEventListener("error", onError);
        };
    }, []);

    return (
        <>
            {!showFallback && (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={className}
                >
                    <source src={src} type="video/mp4" />
                </video>
            )}

            {showFallback && <img src={poster} alt="" className={className} />}
        </>
    );
}

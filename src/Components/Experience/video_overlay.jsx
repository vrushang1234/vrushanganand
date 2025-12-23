import {
    motion,
    AnimatePresence,
    useMotionValue,
    animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Expect arg.carousel to be:
 * [
 *   { id: 1, url: "...", title: "..." },
 *   ...
 * ]
 */

function VideoOverlay({ arg, isFullscreen, onOpen, onClose }) {
    const [index, setIndex] = useState(0);
    const containerRef = useRef(null);
    const x = useMotionValue(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.offsetWidth || 1;
        animate(x, -index * width, {
            type: "spring",
            stiffness: 300,
            damping: 30,
        });
    }, [index, x]);

    return (
        <motion.div
            className={`video-overlay ${isFullscreen ? "fullscreen" : ""}`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* HEADER */}
            <div className="overlay-header">
                <motion.h1>{arg.title}</motion.h1>
                <motion.h2>{arg.date}</motion.h2>
                {!isFullscreen && (
                    <button
                        className="overlay-btn-open"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen?.();
                        }}
                    >
                        View
                    </button>
                )}
                {isFullscreen && (
                    <button
                        className="overlay-btn-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose?.();
                        }}
                    >
                        &lt;&lt;
                    </button>
                )}
            </div>
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overlay-content"
                    >
                        <p className="proj-desc">{arg.description}</p>

                        <h2 className="pos-header">{arg.posHeader}</h2>
                        {arg.posDescription.map((i, idx) => (
                            <p key={idx} className="pos-desc">
                                {i}
                            </p>
                        ))}

                        {arg.images && (
                            <div className="carousel-wrapper">
                                <div
                                    className="carousel-viewport"
                                    ref={containerRef}
                                >
                                    <motion.div
                                        className="carousel-track"
                                        style={{ x }}
                                    >
                                        {arg.images.map((item) => (
                                            <div
                                                key={item.id}
                                                className="carousel-slide"
                                            >
                                                <h2 className="carousel-img-title">
                                                    {item.title}
                                                </h2>
                                                <img
                                                    src={item.url}
                                                    alt={item.title}
                                                    draggable={false}
                                                />
                                            </div>
                                        ))}
                                    </motion.div>

                                    <button
                                        className="carousel-btn left"
                                        disabled={index === 0}
                                        onClick={() =>
                                            setIndex((i) => Math.max(0, i - 1))
                                        }
                                    >
                                        &lt;
                                    </button>

                                    <button
                                        className="carousel-btn right"
                                        disabled={
                                            index === arg.images.length - 1
                                        }
                                        onClick={() =>
                                            setIndex((i) =>
                                                Math.min(
                                                    arg.images.length - 1,
                                                    i + 1,
                                                ),
                                            )
                                        }
                                    >
                                        &gt;
                                    </button>

                                    <div className="carousel-dots">
                                        {arg.images.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setIndex(i)}
                                                className={`dot ${i === index ? "active" : ""}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default VideoOverlay;

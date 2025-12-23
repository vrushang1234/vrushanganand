import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./experience.css";

import VideoOverlay from "./video_overlay";
import VideoWithFallback from "./video_fallback";
import experienceData from "./info";

export default function Experience() {
    const [active, setActive] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [closing, setClosing] = useState(false);

    const cardRefs = useRef({});

    const activeExperience = experienceData.find((e) => e.id === active);

    /* Lock scroll when fullscreen */
    useEffect(() => {
        document.body.style.overflow = active ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [active]);

    const open = (id) => {
        const rect = cardRefs.current[id]?.getBoundingClientRect();
        if (!rect) return;

        setOrigin(rect);
        setActive(id);
    };

    const close = () => {
        setClosing(true);

        setTimeout(() => {
            setActive(null);
            setOrigin(null);
            setClosing(false);
        }, 200);
    };

    return (
        <div className="experience-container">
            <h1 className="experience-header">Experience</h1>

            {/* PREVIEW CARDS */}
            {experienceData.map((exp) => (
                <div
                    key={exp.id}
                    ref={(el) => (cardRefs.current[exp.id] = el)}
                    className="video-container"
                >
                    <VideoWithFallback
                        src={exp.video}
                        poster={exp.poster}
                        className="video-preview"
                    />

                    <VideoOverlay
                        arg={exp}
                        isFullscreen={false}
                        onOpen={() => open(exp.id)}
                    />
                </div>
            ))}

            {/* CAMERA ZOOM LAYER */}
            <AnimatePresence mode="wait">
                {activeExperience && origin && (
                    <motion.div
                        className="zoom-layer"
                        initial={{
                            x: origin.left,
                            y: origin.top,
                            width: origin.width,
                            height: origin.height,
                        }}
                        animate={{
                            x: 0,
                            y: 0,
                            width: "100vw",
                            height: "100vh",
                            transition: {
                                duration: 1,
                                ease: [0.22, 1, 0.36, 1],
                            },
                        }}
                        exit={{
                            x: origin.left,
                            y: origin.top,
                            width: origin.width,
                            height: origin.height,
                            transition: {
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1],
                            },
                        }}
                    >
                        <VideoWithFallback
                            src={activeExperience.video}
                            poster={activeExperience.poster}
                            className="video-preview"
                        />

                        <VideoOverlay
                            arg={activeExperience}
                            isFullscreen={!closing}
                            onClose={close}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

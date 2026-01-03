"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./experience.css";

import VideoOverlay from "./video_overlay";
import VideoWithFallback from "./video_fallback";
import experienceData from "./info";
import { useScrollGradient } from "../../useScrollGradient";
import gradientStyle from "../../gradientStyle";

export default function Experience() {
    const experienceRef = useRef(null);

    const [active, setActive] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [closing, setClosing] = useState(false);

    const cardRefs = useRef({});

    const activeExperience = experienceData.find((e) => e.id === active);

    const { opacity, scale, gradientOffset } = useScrollGradient(
        experienceRef,
        {
            mode: "enter",
            fadeInStart: 0.0,
            fadeInEnd: 0.6,
            fadeOutStart: 1.2,
            fadeOutEnd: 1.6,
            baseOffset: 30,
            offsetSpeed: 35,
        },
    );

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
        <div className="experience-container" ref={experienceRef}>
            <h1
                className="experience-header"
                style={gradientStyle(gradientOffset, opacity, scale)}
            >
                Experience
            </h1>

            {/* PREVIEW CARDS */}
            {experienceData.map((exp) => (
                <div
                    key={exp.id}
                    ref={(el) => (cardRefs.current[exp.id] = el)}
                    className="video-container glow"
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

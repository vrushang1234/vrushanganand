import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "./experience.css";

import VideoOverlay from "./video_overlay";
import experienceData from "./info";

export default function Experience() {
    const [activeVideo, setActiveVideo] = useState(null);

    const activeExperience = experienceData.find(
        (exp) => exp.id === activeVideo,
    );

    return (
        <div className="experience-container">
            <h1 className="experience-header">Experience</h1>

            {experienceData.map((exp) => (
                <motion.div
                    key={exp.id}
                    layout
                    layoutId={exp.id}
                    className="video-container"
                    onClick={() => setActiveVideo(exp.id)}
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="video-preview"
                    >
                        <source src={exp.video} type="video/mp4" />
                    </video>

                    <VideoOverlay
                        title={exp.title}
                        date={exp.date}
                        description={exp.description}
                    />
                </motion.div>
            ))}

            <AnimatePresence>
                {activeExperience && (
                    <motion.div
                        layoutId={activeExperience.id}
                        className="video-container fullscreen"
                        onClick={() => setActiveVideo(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.45,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        style={{ position: "fixed", inset: 0 }}
                    >
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="video-preview"
                        >
                            <source
                                src={activeExperience.video}
                                type="video/mp4"
                            />
                        </video>

                        <VideoOverlay
                            title={activeExperience.title}
                            date={activeExperience.date}
                            description={activeExperience.description}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

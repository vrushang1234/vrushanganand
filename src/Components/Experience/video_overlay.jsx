import { motion, AnimatePresence } from "framer-motion";

function VideoOverlay({ title, date, description, isFullscreen }) {
    return (
        <motion.div className="video-overlay">
            <motion.h1>{title}</motion.h1>
            <motion.h2>{date}</motion.h2>

            <AnimatePresence>
                {isFullscreen && (
                    <motion.p
                        key="description"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {description}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default VideoOverlay;

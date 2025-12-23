import { motion, AnimatePresence } from "framer-motion";

function VideoOverlay({ arg, isFullscreen }) {
    return (
        <motion.div
            className={`video-overlay ${isFullscreen ? "fullscreen" : ""}`}
        >
            <motion.h1>{arg.title}</motion.h1>
            <motion.h2>{arg.date}</motion.h2>

            <AnimatePresence>
                {isFullscreen && (
                    <motion.p
                        key="description"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <p className="proj-desc">{arg.description}</p>
                        <h2 className="pos-header">{arg.posHeader}</h2>
                        {arg.posDescription.map((i) => {
                            return <p className="pos-desc">{i}</p>;
                        })}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default VideoOverlay;

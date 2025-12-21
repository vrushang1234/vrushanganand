function VideoOverlay({ title, date, description }) {
    return (
        <div className="video-overlay">
            <h1>{title}</h1>
            <h2>{date}</h2>
            <br />
            <p>{description}</p>
        </div>
    );
}
export default VideoOverlay;

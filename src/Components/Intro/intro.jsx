import "./intro.css";
import React, { useEffect, useState } from "react";

export default function Intro() {
    const [gradientOffset, setGradientOffset] = useState(40);
    const [scale, setScale] = useState(1);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const newOffset = Math.max(0, gradientOffset - scrolled / 10);
            const newScale = Math.max(0.5, 1 - scrolled / 7000);
            const newOpacity = Math.max(0, 1 - scrolled / 600);
            setGradientOffset(newOffset);
            setScale(newScale);
            setOpacity(newOpacity);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="intro-container">
            <h3
                className="intro"
                style={{
                    backgroundImage: `radial-gradient(
            circle at 50% ${gradientOffset}vh,
            rgb(255, 150, 123) 0vh,
            rgb(223, 58, 147) 100vh,
            rgb(92, 22, 99) 90vh,
            rgba(32, 31, 66, 0) 100vh
          )`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    transform: `scale(${scale})`,
                    opacity: opacity,
                    transition: "transform 0.1s linear, opacity 0.1s linear",
                }}
            >
                Hey there, <br />I am Vrushang
            </h3>
        </div>
    );
}

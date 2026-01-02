import "./about.css";
import { useRef } from "react";

import { useScrollGradient } from "../../useScrollGradient";
import gradientStyle from "../../gradientStyle";

export default function About() {
    const aboutRef = useRef(null);

    const { opacity, scale, gradientOffset } = useScrollGradient(aboutRef, {
        mode: "enter",
        fadeInStart: 0.7,
        fadeInEnd: 1.2,
        fadeOutStart: 1.7,
        fadeOutEnd: 2.4,
        baseOffset: 50,
        offsetSpeed: 45,
    });

    return (
        <div className="about-container" ref={aboutRef}>
            <h3
                className="about-text"
                style={gradientStyle(gradientOffset, opacity, scale)}
            >
                I am a Computer Engineering student focused on high-performance
                systems at the intersection of operating systems, machine
                learning, and hardware. I design adaptive systems under strict
                latency and resource constraints.
            </h3>
        </div>
    );
}

"use client";
import "./about.css";
import { useRef } from "react";

import { useScrollGradient } from "../../useScrollGradient";
import gradientStyle from "../../gradientStyle";

export default function About() {
    const aboutRef = useRef(null);

    const { opacity, scale, gradientOffset } = useScrollGradient(aboutRef, {
        mode: "enter",
        fadeInStart: 0.5,
        fadeInEnd: 1,
        fadeOutStart: 1.5,
        fadeOutEnd: 1.8,
        baseOffset: 40,
        offsetSpeed: 35,
        topOffset: 80,
    });

    return (
        <div className="about-container" id="about" ref={aboutRef}>
            <h3
                className="about-text"
                style={gradientStyle(gradientOffset, opacity, scale)}
            >
                Computer Engineering student focused on high-performance systems
                at the intersection of operating systems, machine learning, and
                hardware. I design adaptive systems under strict latency and
                resource constraints.
            </h3>
        </div>
    );
}

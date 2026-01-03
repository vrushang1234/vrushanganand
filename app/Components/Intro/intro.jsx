"use client";
import "./intro.css";
import { useRef } from "react";

import { useScrollGradient } from "../../useScrollGradient";

import gradientStyle from "../../gradientStyle";

export default function Intro() {
    const introRef = useRef(null);

    const { opacity, scale, gradientOffset } = useScrollGradient(introRef, {
        mode: "exit",
        fadeInStart: 0,
        fadeInEnd: 0,
        fadeOutStart: 0.15,
        fadeOutEnd: 0.9,
        baseOffset: 20,
        offsetSpeed: 90,
    });

    return (
        <div className="intro-container" id="intro" ref={introRef}>
            <h3
                className="intro"
                style={gradientStyle(gradientOffset, opacity, scale)}
            >
                ML and Systems Engineer
            </h3>
        </div>
    );
}

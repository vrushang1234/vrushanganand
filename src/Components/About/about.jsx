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
                I am a student at University of California, Irvine, currently
                pursuing my bachelor's in Computer Engineering and minor in
                Computer Science. My hobbies are cooking food and coding. I also
                play video games occasionally.
            </h3>
        </div>
    );
}

import "./about.css";
import { useScrollGradient } from "../../useScrollGradient";
import gradientStyle from "../../gradientStyle";

export default function About() {
    const { opacity, scale, gradientOffset } = useScrollGradient({
        fadeInStart: 0.6,
        fadeInEnd: 1.0,
        fadeOutStart: 1.6,
        fadeOutEnd: 2.2,
        baseOffset: 20,
        offsetSpeed: 60,
    });

    return (
        <div className="about-container">
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

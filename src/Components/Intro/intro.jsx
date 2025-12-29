import "./intro.css";
import { useScrollGradient } from "../../useScrollGradient";
import gradientStyle from "../../gradientStyle";

export default function Intro() {
    const { opacity, scale, gradientOffset } = useScrollGradient({
        fadeInStart: 0.0,
        fadeInEnd: 0.0,
        fadeOutStart: 0.2,
        fadeOutEnd: 0.9,
        baseOffset: 20,
        offsetSpeed: 80,
    });

    return (
        <div className="intro-container">
            <h3
                className="intro"
                style={gradientStyle(gradientOffset, opacity, scale)}
            >
                Hey there,
                <br />I am Vrushang
            </h3>
        </div>
    );
}

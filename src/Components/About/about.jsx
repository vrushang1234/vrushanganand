import "./about.css";
import { useState, useEffect } from "react";

export default function About() {
  const [gradientOffset, setGradientOffset] = useState(40);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;

      const fadeInStart = 0.5 * viewportHeight;
      const fadeInEnd = viewportHeight;
      const fadeOutStart = 1.6 * viewportHeight;
      const fadeOutEnd = 2.2 * viewportHeight;

      let newOpacity = 0;
      if (scrolled < fadeInStart) {
        newOpacity = 0;
      } else if (scrolled >= fadeInStart && scrolled < fadeInEnd) {
        const fadeProgress =
          (scrolled - fadeInStart) / (fadeInEnd - fadeInStart);
        newOpacity = Math.min(1, fadeProgress);
      } else if (scrolled >= fadeInEnd && scrolled < fadeOutStart) {
        newOpacity = 1;
      } else if (scrolled >= fadeOutStart && scrolled < fadeOutEnd) {
        const fadeProgress =
          1 - (scrolled - fadeOutStart) / (fadeOutEnd - fadeOutStart);
        newOpacity = Math.max(0, fadeProgress);
      } else {
        newOpacity = 0;
      }

      let newScale = 1;
      if (scrolled >= fadeOutStart && scrolled < fadeOutEnd) {
        const scaleProgress =
          (scrolled - fadeOutStart) / (fadeOutEnd - fadeOutStart);
        newScale = 1 - 0.2 * scaleProgress;
      } else if (scrolled >= fadeOutEnd) {
        newScale = 0.8;
      }

      const localScroll = Math.max(0, scrolled - viewportHeight);
      const newOffset = Math.min(70, 40 - localScroll / 60);

      setOpacity(newOpacity);
      setScale(newScale);
      setGradientOffset(newOffset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="about-container">
      <h3
        className="about-text"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 50% ${gradientOffset}vh,
              rgba(255, 220, 140, 0.85) 0%,
              rgba(255, 220, 140, 0.0) 30%
            ),
            radial-gradient(
            circle at 50% ${gradientOffset}vh,
            rgb(255, 150, 123) 0vh,
            rgb(223, 58, 147) 100vh,
            rgb(92, 22, 99) 90vh,
            rgba(32, 31, 66, 0) 100vh
          `,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",

          WebkitMaskImage: `radial-gradient(
            farthest-corner at 50% ${gradientOffset}vh,
            rgba(0,0,0,1) 96%,
            rgba(0,0,0,0) 100%
          )`,
          maskImage: `radial-gradient(
            farthest-corner at 50% ${gradientOffset}vh,
            rgba(0,0,0,1) 96%,
            rgba(0,0,0,0) 100%
          )`,

          opacity,
          transform: `scale(${scale})`,
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        }}
      >
        Hey, my name is Vrushang Anand. I am a student at University of
        California, Irvine, currently pursuing my bachelor's in Computer
        Engineering and minor in Computer Science. My hobbies are cooking food
        and coding. I also play video games occasionally.
      </h3>
    </div>
  );
}

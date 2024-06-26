import "./AboutMe.css";
import CodingCartoon from "@/assets/AboutMe.png";
import { useEffect } from "react";

export default function AboutMe() {
  useEffect(() => {
    const createSnowflakes = () => {
      const container = document.querySelector(".about-me-container");

      for (let i = 0; i < 8; i++) {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";
        const size = Math.random() * 10 + 5 + "px";
        snowflake.style.width = size;
        snowflake.style.height = size;
        snowflake.style.left = Math.random() * 75 + "vw";
        snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
        snowflake.style.opacity = Math.random();
        snowflake.style.transform = `translateY(-1px) translateX(${
          Math.random() * 10
        }vw)`;

        container.appendChild(snowflake);
      }
    };

    // Trigger the snowflakes creation and Astro movement after delay
    setTimeout(() => {
      document
        .getElementsByClassName("no-scroll")[0]
        .classList.remove("no-scroll");
      createSnowflakes();
      moveAstroRandomly(); // Initial positioning
      setInterval(moveAstroRandomly, 5000); // Move every 5 seconds
    }, 4500);
  }, []);

  return (
    <div className="about-me-container no-scroll">
      <div className="about-me">
        Hey, my name is Vrushang Anand. I am a student at University of
        California, Irvine, currently pursuing my bachelor's in Computer
        Engineering and minor in Computer Science. My hobbies are cooking food
        and coding. I also play video games occasionally.
      </div>
      <img
        className="coding-cartoon"
        src={CodingCartoon}
        alt="Coding Cartoon"
      />
    </div>
  );
}

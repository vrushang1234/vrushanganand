import "./projects.css";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useScrollGradient } from "../../useScrollGradient";
import gradientStyle from "../../gradientStyle";

import HX from "../../assets/Projects/HX.webp";
import SC from "../../assets/Projects/SC.webp";
import Trading from "../../assets/Projects/Trading.webp";
import Arch from "../../assets/Projects/arch.png";
import ESC from "../../assets/Projects/ESC.png";
import ICS from "../../assets/Projects/ICS259.png";
import GHW from "../../assets/Pictures/github-white.png";
import GHB from "../../assets/Pictures/github-black.png";

const projects = [
    {
        id: 1,
        title: "RL Kernel Scheduler",
        description: "PPO Linux scheduler",
        image: Arch,
        btns: [
            {
                icons: [GHW, GHB],
                title: "Github",
                link: "https://www.google.com",
            },
        ],
    },
    {
        id: 2,
        title: "FPGA HFT Engine",
        description: "Artix-7 order matching",
        image: Trading,
        btns: [],
    },
    {
        id: 3,
        title: "Hyperloop Controls",
        description: "Embedded control stack",
        image: HX,
        btns: [],
    },
    {
        id: 4,
        title: "Solar Telemetry",
        description: "CAN + WebSocket",
        image: SC,
        btns: [],
    },
    {
        id: 5,
        title: "UCI ENGR Room Reservation ",
        description: "CAN + WebSocket",
        image: ICS,
        btns: [],
    },
    {
        id: 6,
        title: "ESC Website",
        description: "CAN + WebSocket",
        image: ESC,
        btns: [],
    },
];
export default function Projects() {
    const projectsRef = useRef(null);
    const { opacity, scale, gradientOffset } = useScrollGradient(projectsRef, {
        mode: "enter",
        fadeInStart: 0,
        fadeInEnd: 0.3,
        baseOffset: 30,
        offsetSpeed: 40,
    });

    const [index, setIndex] = useState(0);
    const containerRef = useRef(null);
    const x = useMotionValue(0);

    const [slidesPerView, setSlidesPerView] = useState(
        window.innerWidth < 1024 ? 1 : 2,
    );

    useEffect(() => {
        const onResize = () => {
            setSlidesPerView(window.innerWidth < 1024 ? 1 : 2);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const firstSlide = containerRef.current.querySelector(
            ".projects-carousel-slide",
        );

        if (!firstSlide) return;

        const slideWidth = firstSlide.offsetWidth;
        const slideStyle = getComputedStyle(firstSlide);
        const margin =
            parseFloat(slideStyle.marginLeft) +
            parseFloat(slideStyle.marginRight);

        const fullSlideWidth = slideWidth + margin;

        animate(x, -index * fullSlideWidth, {
            type: "spring",
            stiffness: 280,
            damping: 30,
        });
    }, [index, x]);

    const maxIndex = Math.max(0, projects.length - slidesPerView);

    return (
        <div className="projects-container" ref={projectsRef}>
            <h1
                className="projects-header"
                style={gradientStyle(gradientOffset, opacity, scale)}
            >
                Projects
            </h1>

            <div className="projects-carousel">
                <div className="projects-carousel-viewport" ref={containerRef}>
                    <motion.div
                        className="projects-carousel-track"
                        style={{ x }}
                    >
                        {projects.map((proj) => (
                            <div
                                key={proj.id}
                                className="projects-carousel-slide"
                                style={{ "--bg": `url(${proj.image})` }}
                            >
                                <h2 className="project-title">{proj.title}</h2>
                                <p className="project-desc">
                                    {proj.description}
                                </p>
                                <br />
                                <div className="project-button-container">
                                    {proj.btns &&
                                        proj.btns.map((project) => (
                                            <a
                                                href={project.link}
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                                rel="norferrer noopener"
                                                target="_blank"
                                            >
                                                <button className="project-button">
                                                    <span className="icon-wrapper">
                                                        <img
                                                            className="icon icon-default"
                                                            src={
                                                                project.icons[1]
                                                            }
                                                            alt=""
                                                        />
                                                        <img
                                                            className="icon icon-hover"
                                                            src={
                                                                project.icons[0]
                                                            }
                                                            alt=""
                                                        />
                                                    </span>
                                                    {project.title}
                                                </button>
                                            </a>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Controls */}
                    <button
                        className="projects-carousel-btn left"
                        disabled={index === 0}
                        onClick={() => setIndex((i) => Math.max(0, i - 1))}
                    >
                        &lt;
                    </button>

                    <button
                        className="projects-carousel-btn right"
                        disabled={index === maxIndex}
                        onClick={() =>
                            setIndex((i) => Math.min(maxIndex, i + 1))
                        }
                    >
                        &gt;
                    </button>
                    <div className="projects-carousel-dots">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button
                                key={i}
                                className={`dot ${i === index ? "active" : ""}`}
                                onClick={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

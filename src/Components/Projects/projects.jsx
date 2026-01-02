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
import WWB from "../../assets/Pictures/web-black.png";
import WWW from "../../assets/Pictures/web-white.png";

const projects = [
    {
        id: 1,
        title: "RL Kernel Schduler",
        description:
            "A custom reinforcement learning powered process scheduler integrated into the Linux kernel for adaptive, low-latency task scheduling.",
        image: Arch,
        btns: [
            {
                icons: [GHW, GHB],
                title: "Github Repo",
                link: "https://github.com/vrushang1234/arch-kernel",
            },
        ],
    },
    {
        id: 2,
        title: "FPGA Trading Engine",
        description:
            "An FPGA-based HFT system combining hardware order matching with an on-chip TPU implemented in FPGA fabric for low-latency reinforcement learning inference.",
        image: Trading,
        btns: [
            {
                icons: [GHW, GHB],
                title: "Github Repo",
                link: "https://github.com/vrushang1234/hft-system",
            },
        ],
    },
    {
        id: 3,
        title: "Hyperloop Controls",
        description: "Rust powered control systems for UCI HyperXite",
        image: HX,
        btns: [
            {
                icons: [GHW, GHB],
                title: "Github Repo",
                link: "https://github.com/vrushang1234/hft-system",
            },
        ],
    },
    {
        id: 4,
        title: "UCI ENGR Room Reservation ",
        description: "Room Reservation System for UCI Engineering Clubs",
        image: ICS,
        btns: [
            {
                icons: [WWW, WWB],
                title: "Website",
                link: "https://ics-259.vercel.app/",
            },
        ],
    },
    {
        id: 6,
        title: "ESC Website",
        description:
            "Website for Engineering Student Council at UCI for event updates and registration.",
        image: ESC,
        btns: [
            {
                icons: [WWW, WWB],
                title: "Website",
                link: "https://esc.eng.uci.edu/",
            },
        ],
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
                                                    {project.icons && (
                                                        <span className="icon-wrapper">
                                                            <img
                                                                className="icon icon-default"
                                                                src={
                                                                    project
                                                                        .icons[1]
                                                                }
                                                                alt=""
                                                            />
                                                            <img
                                                                className="icon icon-hover"
                                                                src={
                                                                    project
                                                                        .icons[0]
                                                                }
                                                                alt=""
                                                            />
                                                        </span>
                                                    )}
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

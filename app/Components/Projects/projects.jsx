"use client";
import "./projects.css";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useScrollGradient } from "../../useScrollGradient";
import gradientStyle from "../../gradientStyle";

const projects = [
    {
        id: 1,
        title: "RL Kernel Scheduler",
        description:
            "A custom reinforcement learning powered process scheduler integrated into the Linux kernel for adaptive, low-latency task scheduling.",
        image: "/assets/Projects/arch.png",
        btns: [
            {
                icons: [
                    "/assets/Pictures/github-white.png",
                    "/assets/Pictures/github-black.png",
                ],
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
        image: "/assets/Projects/Trading.webp",
        btns: [
            {
                icons: [
                    "/assets/Pictures/github-white.png",
                    "/assets/Pictures/github-black.png",
                ],
                title: "Github Repo",
                link: "https://github.com/vrushang1234/hft-system",
            },
        ],
    },
    {
        id: 3,
        title: "Hyperloop Controls",
        description: "Rust-powered control systems for UCI HyperXite.",
        image: "/assets/Projects/HX.webp",
        btns: [
            {
                icons: [
                    "/assets/Pictures/github-white.png",
                    "/assets/Pictures/github-black.png",
                ],
                title: "Github Repo",
                link: "https://github.com/vrushang1234/hft-system",
            },
        ],
    },
    {
        id: 4,
        title: "UCI ENGR Room Reservation",
        description: "Room reservation system for UCI Engineering clubs.",
        image: "/assets/Projects/ICS259.png",
        btns: [
            {
                icons: [
                    "/assets/Pictures/web-white.png",
                    "/assets/Pictures/web-black.png",
                ],
                title: "Website",
                link: "https://ics-259.vercel.app/",
            },
        ],
    },
    {
        id: 6,
        title: "ESC Website",
        description:
            "Website for the Engineering Student Council at UCI for events and registration.",
        image: "/assets/Projects/ESC.png",
        btns: [
            {
                icons: [
                    "/assets/Pictures/web-white.png",
                    "/assets/Pictures/web-black.png",
                ],
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
        typeof window !== "undefined" && window.innerWidth < 1024 ? 1 : 2,
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
        const style = getComputedStyle(firstSlide);
        const margin =
            parseFloat(style.marginLeft) + parseFloat(style.marginRight);

        animate(x, -index * (slideWidth + margin), {
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

                                <div className="project-button-container">
                                    {proj.btns?.map((btn) => (
                                        <a
                                            key={btn.title}
                                            href={btn.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <button className="project-button">
                                                {btn.icons && (
                                                    <span className="icon-wrapper">
                                                        <img
                                                            className="icon icon-default"
                                                            src={btn.icons[1]}
                                                            alt=""
                                                        />
                                                        <img
                                                            className="icon icon-hover"
                                                            src={btn.icons[0]}
                                                            alt=""
                                                        />
                                                    </span>
                                                )}
                                                {btn.title}
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

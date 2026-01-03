"use client";
import "./skills.css";
import { useRef } from "react";

import { useScrollGradient } from "../../useScrollGradient";
import gradientStyle from "../../gradientStyle";

const SKILL_GROUPS = [
    {
        title: "Languages",
        skills: ["C/C++", "Python", "Rust", "Java", "JavaScript/TypeScript"],
    },
    {
        title: "ML",
        skills: [
            "Reinforcement Learning",
            "Neural Networks",
            "PyTorch",
            "StableBaselines3",
            "OpenAI Gym",
        ],
    },
    {
        title: "Hardware",
        skills: [
            "FPGA / Verilog",
            "PCB Design",
            "LTSpice",
            "Cadence Virtuoso",
            "Embedded Systems",
        ],
    },
    {
        title: "Software Development",
        skills: ["ReactJS/NextJS", "Docker", "Kubernetes", "Bash", "Git"],
    },
    {
        title: "Cloud Computing",
        skills: [
            "AWS EC2/Lambda",
            "GCP (Cloud Functions)",
            "Firebase",
            "Supabase",
        ],
    },
];

export default function Skills() {
    const skillsRef = useRef(null);

    const { opacity, scale, gradientOffset } = useScrollGradient(skillsRef, {
        mode: "enter",
        fadeInStart: 0,
        fadeInEnd: 0.3,
        baseOffset: 60,
        offsetSpeed: 30,
    });

    return (
        <div className="skills-section-container" id="skills" ref={skillsRef}>
            <h1
                className="skills-section-header"
                style={gradientStyle(gradientOffset, opacity, scale)}
            >
                Skills
            </h1>

            <div className="skills-parent">
                {SKILL_GROUPS.map(({ title, skills }) => (
                    <div
                        key={title}
                        className="skills-container"
                        style={gradientStyle(gradientOffset, opacity, scale)}
                    >
                        <h2 className="skills-title">{title}</h2>
                        <ul>
                            {skills.map((skill) => (
                                <li key={skill}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";
import { useState } from "react";

const projects = [
    "RL Kernel Scheduler",
    "vishyOS",
    "FPGA Trading Engine",
    "TISA",
];

const articles = [
    {
        title: "Adaptive Kernel Scheduler",
        description:
            "A custom reinforcement learning powered process scheduler integrated into the Arch Linux kernel for adaptive, low-latency task scheduling.",
        href: "articles/adaptive-scheduler",
        project: "RL Kernel Scheduler",
    },
    {
        title: "vishyOS - Memory Management",
        description:
            "From physical frames to virtual pages: transforming raw RAM into isolated address spaces.",
        href: "articles/mmu",
        project: "vishyOS",
    },
];

const reports = [
    {
        title: "High Frequency Trading System",
        description:
            "EECS 159B senior design report on an FPGA-based HFT system combining hardware order matching with an on-chip TPU.",
        href: "/assets/EECS_159B_HFT_Report.pdf",
        project: "FPGA Trading Engine",
    },
    {
        title: "TISA: Tensor Instruction Set Architecture",
        description:
            "A universal instruction set architecture for ML/DL FPGA accelerators, driven from high-level Python libraries such as PyTorch.",
        href: "/assets/TISA.pdf",
        project: "TISA",
    },
];

function WritingSection({ heading, items, isReport }) {
    if (items.length === 0) return null;

    return (
        <section className="writing-section">
            <h1>{heading}</h1>
            {items.map((item) => (
                <div className="article-list-element" key={item.title}>
                    <a
                        className="article-link"
                        href={item.href}
                        {...(isReport
                            ? { target: "_blank", rel: "noreferrer noopener" }
                            : {})}
                    >
                        <h2>
                            {item.title}
                            {isReport && (
                                <span className="article-pdf-tag">PDF</span>
                            )}
                        </h2>
                        <p>{item.description}</p>
                    </a>
                </div>
            ))}
        </section>
    );
}

export default function WritingList() {
    const [filter, setFilter] = useState("All");

    const matches = (item) => filter === "All" || item.project === filter;

    return (
        <div className="articles-list">
            <div className="article-filters">
                <label htmlFor="project-filter">Filter by project</label>
                <select
                    id="project-filter"
                    className="article-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    {["All", ...projects].map((project) => (
                        <option key={project} value={project}>
                            {project}
                        </option>
                    ))}
                </select>
            </div>

            <WritingSection
                heading="Articles"
                items={articles.filter(matches)}
            />
            <WritingSection
                heading="Reports"
                items={reports.filter(matches)}
                isReport
            />
        </div>
    );
}

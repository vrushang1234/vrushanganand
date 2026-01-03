"use client";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
        setOpen(false);
    };

    return (
        <header className="navbar">
            <h1 className="navbar-title">Vrushang Anand</h1>

            <button
                className={`hamburger ${open ? "open" : ""}`}
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle navigation"
            >
                <span />
                <span />
                <span />
            </button>

            <nav className={`navbar-buttons ${open ? "open" : ""}`}>
                <button onClick={() => scrollTo("intro")}>Home</button>
                <button onClick={() => scrollTo("about")}>About Me</button>
                <button onClick={() => scrollTo("experience")}>
                    Experience
                </button>
                <button onClick={() => scrollTo("projects")}>Projects</button>
                <button onClick={() => scrollTo("contact")}>Contact Me</button>
            </nav>
        </header>
    );
}

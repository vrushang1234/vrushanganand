"use client";
import "./particleField.css";
import { useEffect, useRef } from "react";

// Same stops the hero text gradient is built from (gradientStyle.js),
// ordered from the warm focal point outwards.
const PALETTE = [
    [255, 220, 140],
    [255, 150, 123],
    [223, 58, 147],
    [92, 22, 99],
];

const LINK_DIST = 130;
const POINTER_DIST = 170;

function paletteAt(t) {
    const p = Math.max(0, Math.min(1, t)) * (PALETTE.length - 1);
    const i = Math.min(PALETTE.length - 2, Math.floor(p));
    const f = p - i;
    const a = PALETTE[i];
    const b = PALETTE[i + 1];

    return [
        Math.round(a[0] + (b[0] - a[0]) * f),
        Math.round(a[1] + (b[1] - a[1]) * f),
        Math.round(a[2] + (b[2] - a[2]) * f),
    ];
}

export default function ParticleField() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        let width = 0;
        let height = 0;
        let particles = [];
        let frame = 0;
        let scrollOpacity = 1;

        // Focal point of the hero gradient: 50% across, ~20vh down.
        const focal = () => ({ x: width / 2, y: height * 0.2 });

        // Smoothed pointer, parked off-canvas until the user moves.
        const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

        const spawn = () => {
            const count = Math.max(
                28,
                Math.min(110, Math.round((width * height) / 19000)),
            );

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22,
                r: 0.9 + Math.random() * 1.5,
                // Per-particle offset so the drift never looks uniform.
                phase: Math.random() * Math.PI * 2,
            }));
        };

        const resize = () => {
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            spawn();
        };

        // Colour follows distance from the gradient focal point, so the field
        // cools from amber to purple exactly like the heading does.
        const tintOf = (p) => {
            const f = focal();
            const d = Math.hypot(p.x - f.x, p.y - f.y);
            return paletteAt(d / (Math.max(width, height) * 0.85));
        };

        const step = () => {
            frame = requestAnimationFrame(step);

            if (scrollOpacity <= 0.01) {
                ctx.clearRect(0, 0, width, height);
                return;
            }

            pointer.x += (pointer.tx - pointer.x) * 0.12;
            pointer.y += (pointer.ty - pointer.y) * 0.12;

            ctx.clearRect(0, 0, width, height);

            for (const p of particles) {
                if (!reduced) {
                    p.phase += 0.004;
                    p.x += p.vx + Math.cos(p.phase) * 0.06;
                    p.y += p.vy + Math.sin(p.phase) * 0.06;

                    const dx = p.x - pointer.x;
                    const dy = p.y - pointer.y;
                    const d = Math.hypot(dx, dy);

                    // Gentle push out of the cursor's way.
                    if (d < POINTER_DIST && d > 0.001) {
                        const force = (1 - d / POINTER_DIST) * 0.9;
                        p.x += (dx / d) * force;
                        p.y += (dy / d) * force;
                    }
                }

                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;
            }

            // Links between neighbours.
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];

                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;

                    if (Math.abs(dx) > LINK_DIST || Math.abs(dy) > LINK_DIST) {
                        continue;
                    }

                    const d = Math.hypot(dx, dy);
                    if (d > LINK_DIST) continue;

                    const [r, g, bl] = tintOf(a);
                    const alpha = (1 - d / LINK_DIST) * 0.22 * scrollOpacity;

                    ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }

                // Brighter links to the cursor itself.
                const pdx = a.x - pointer.x;
                const pdy = a.y - pointer.y;
                const pd = Math.hypot(pdx, pdy);

                if (pd < POINTER_DIST) {
                    const [r, g, bl] = tintOf(a);
                    const alpha = (1 - pd / POINTER_DIST) * 0.5 * scrollOpacity;

                    ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
                    ctx.lineWidth = 0.9;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }
            }

            // Nodes on top of the links.
            for (const p of particles) {
                const [r, g, bl] = tintOf(p);
                const pd = Math.hypot(p.x - pointer.x, p.y - pointer.y);
                const boost = pd < POINTER_DIST ? 1 - pd / POINTER_DIST : 0;

                ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, ${(0.5 + boost * 0.45) * scrollOpacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r + boost * 1.1, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        // Fade out over the same scroll range the hero heading uses.
        const onScroll = () => {
            const vh = window.innerHeight;
            const y = window.scrollY;
            const start = 0.15 * vh;
            const end = 0.9 * vh;

            scrollOpacity =
                y <= start ? 1 : y >= end ? 0 : 1 - (y - start) / (end - start);

            canvas.style.opacity = scrollOpacity;
        };

        const onPointerMove = (e) => {
            pointer.tx = e.clientX;
            pointer.ty = e.clientY;

            if (pointer.x < -1000) {
                pointer.x = e.clientX;
                pointer.y = e.clientY;
            }
        };

        const onPointerLeave = () => {
            pointer.tx = -9999;
            pointer.ty = -9999;
        };

        resize();
        onScroll();
        frame = requestAnimationFrame(step);

        window.addEventListener("resize", resize);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("pointermove", onPointerMove, {
            passive: true,
        });
        window.addEventListener("pointerdown", onPointerMove, {
            passive: true,
        });
        document.addEventListener("pointerleave", onPointerLeave);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerdown", onPointerMove);
            document.removeEventListener("pointerleave", onPointerLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="particle-field" aria-hidden />;
}

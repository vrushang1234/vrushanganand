"use client";

import { useEffect } from "react";

export default function MathJaxProvider({ children }) {
    useEffect(() => {
        if (!window.MathJax) {
            window.MathJax = {
                tex: {
                    inlineMath: [
                        ["$", "$"],
                        ["\\(", "\\)"],
                    ],
                    displayMath: [
                        ["$$", "$$"],
                        ["\\[", "\\]"],
                    ],
                },
                svg: {
                    fontCache: "global",
                },
            };

            const script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
            script.async = true;
            document.head.appendChild(script);
        } else {
            window.MathJax.typesetPromise();
        }
    }, []);

    return <>{children}</>;
}

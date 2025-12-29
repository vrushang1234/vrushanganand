import { useState, useEffect } from "react";

export function useScrollGradient({
    fadeInStart,
    fadeInEnd,
    fadeOutStart,
    fadeOutEnd,
    baseOffset,
    offsetSpeed,
}) {
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(1);
    const [gradientOffset, setGradientOffset] = useState(100);

    const hasFadeOut =
        typeof fadeOutStart === "number" && typeof fadeOutEnd === "number";

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const vh = window.innerHeight;

            let newOpacity = 0;

            if (scrolled < fadeInStart * vh) {
                newOpacity = 0;
            } else if (scrolled < fadeInEnd * vh) {
                newOpacity =
                    (scrolled - fadeInStart * vh) /
                    ((fadeInEnd - fadeInStart) * vh);
            } else if (!hasFadeOut || scrolled < fadeOutStart * vh) {
                newOpacity = 1;
            } else if (scrolled < fadeOutEnd * vh) {
                newOpacity =
                    1 -
                    (scrolled - fadeOutStart * vh) /
                        ((fadeOutEnd - fadeOutStart) * vh);
            } else {
                newOpacity = hasFadeOut ? 0 : 1;
            }

            let newScale = 1;

            if (hasFadeOut) {
                if (
                    scrolled >= fadeOutStart * vh &&
                    scrolled < fadeOutEnd * vh
                ) {
                    const p =
                        (scrolled - fadeOutStart * vh) /
                        ((fadeOutEnd - fadeOutStart) * vh);
                    newScale = 1 - 0.2 * p;
                } else if (scrolled >= fadeOutEnd * vh) {
                    newScale = 0.8;
                }
            }

            const localScroll = Math.max(0, scrolled - vh);
            const newOffset = Math.min(
                70,
                baseOffset - localScroll / offsetSpeed,
            );

            setOpacity(Math.max(0, Math.min(1, newOpacity)));
            setScale(newScale);
            setGradientOffset(newOffset);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return { opacity, scale, gradientOffset };
}

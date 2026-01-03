import { useState, useEffect } from "react";

export function useScrollGradient(
    ref,
    {
        mode = "enter",
        fadeInStart = 0,
        fadeInEnd = 0,
        fadeOutStart,
        fadeOutEnd,
        baseOffset = 70,
        offsetSpeed = 60,
        topOffset = 0,
    },
) {
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(1);
    const [gradientOffset, setGradientOffset] = useState(baseOffset);

    const hasFadeIn = fadeInEnd > fadeInStart;
    const hasFadeOut =
        typeof fadeOutStart === "number" && typeof fadeOutEnd === "number";

    useEffect(() => {
        if (!ref?.current) return;

        const handleScroll = () => {
            const vh = window.innerHeight;
            const rect = ref.current.getBoundingClientRect();
            const adjustedTop = rect.top - topOffset;

            const localScroll =
                mode === "exit"
                    ? Math.max(0, -adjustedTop)
                    : Math.max(0, vh - adjustedTop);

            let newOpacity;

            if (hasFadeIn && localScroll < fadeInStart * vh) {
                newOpacity = 0;
            } else if (hasFadeIn && localScroll < fadeInEnd * vh) {
                newOpacity =
                    (localScroll - fadeInStart * vh) /
                    ((fadeInEnd - fadeInStart) * vh);
            } else if (!hasFadeOut || localScroll < fadeOutStart * vh) {
                newOpacity = 1;
            } else if (localScroll < fadeOutEnd * vh) {
                newOpacity =
                    1 -
                    (localScroll - fadeOutStart * vh) /
                        ((fadeOutEnd - fadeOutStart) * vh);
            } else {
                newOpacity = hasFadeOut ? 0 : 1;
            }

            let newScale = 1;

            if (hasFadeOut) {
                if (
                    localScroll >= fadeOutStart * vh &&
                    localScroll < fadeOutEnd * vh
                ) {
                    const p =
                        (localScroll - fadeOutStart * vh) /
                        ((fadeOutEnd - fadeOutStart) * vh);
                    newScale = 1 - 0.2 * p;
                } else if (localScroll >= fadeOutEnd * vh) {
                    newScale = 0.8;
                }
            }

            const newOffset = Math.max(
                0,
                Math.min(70, baseOffset - localScroll / offsetSpeed),
            );

            setOpacity(Math.max(0, Math.min(1, newOpacity)));
            setScale(newScale);
            setGradientOffset(newOffset);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [
        ref,
        mode,
        fadeInStart,
        fadeInEnd,
        fadeOutStart,
        fadeOutEnd,
        baseOffset,
        offsetSpeed,
        hasFadeIn,
        hasFadeOut,
        topOffset,
    ]);

    return { opacity, scale, gradientOffset };
}

export default function gradientStyle(offset, opacity, scale) {
    return {
        backgroundImage: `
            radial-gradient(
                circle at 50% ${offset}vh,
                rgba(255, 220, 140, 0.85) 0%,
                rgba(255, 220, 140, 0.0) 30%
            ),
            radial-gradient(
                circle at 50% ${offset}vh,
                rgb(255, 150, 123) 0vh,
                rgb(223, 58, 147) 100vh,
                rgb(92, 22, 99) 90vh,
                rgba(32, 31, 66, 0) 100vh
            )
        `,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",

        WebkitMaskImage: `
            radial-gradient(
                farthest-corner at 50% ${offset}vh,
                rgba(0,0,0,1) 96%,
                rgba(0,0,0,0) 100%
            )
        `,
        maskImage: `
            radial-gradient(
                farthest-corner at 50% ${offset}vh,
                rgba(0,0,0,1) 96%,
                rgba(0,0,0,0) 100%
            )
        `,

        opacity,
        transform: `scale(${scale})`,
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
    };
}

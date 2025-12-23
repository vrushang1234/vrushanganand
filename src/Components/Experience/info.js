import HyperXite from "../../assets/Videos/HyperXite.mp4";
import SolarCar from "../../assets/Videos/SolarCar.mp4";
import HyperXitePoster from "../../assets/Pictures/HyperXite/hyperxite.webp";
import SolarCarPoster from "../../assets/Pictures/SolarCar/solarcar.webp";
import HyperXiteFSM from "../../assets/Pictures/HyperXite/FSM.png";
import HyperXiteThreading from "../../assets/Pictures/HyperXite/Threading.png";

const experienceData = [
    {
        id: "hyperxite",
        title: "HyperXite",
        date: "Aug 2023 – June 2025",
        description:
            "HyperXite is a student led undergraduate project team, aimed at building a prototype for the SpaceX Hyperloop project and participating in global Hyperloop competitions.",
        video: HyperXite,
        poster: HyperXitePoster,
        posHeader: "Control Systems Engineer",
        posDescription: [
            "As a Control Systems Engineer, I worked on the brains and nervous system of UCI HyperXite’s Hyperloop pod. My focus was making sure the pod could sense what was happening in real time, react correctly, and fail safely when something went wrong.",

            "I spent most of my time close to the hardware - bringing up sensors, debugging weird edge cases, and figuring out how to turn noisy real-world signals into reliable system behavior. I worked with IMUs, encoders, pressure sensors, and thermistors, building control logic that continuously monitored pod state and enforced safety limits.",

            "A big part of my role was designing how data flowed through the system. I built multithreaded pipelines to read sensors, process them deterministically, and stream telemetry over CAN and serial links so the ground team could see exactly what the pod was doing in real time.",

            "What I enjoyed most was working at the boundary between software and physical systems - where timing matters, assumptions break, and every bug has a real-world consequence.",
        ],
        images: [HyperXiteFSM, HyperXiteThreading],
    },
    {
        id: "solarcar",
        title: "Solar Car",
        date: "April 2024 – June 2025",
        description:
            "UCI Solar Car is a team of undergraduate engineers pushing the boundaries of sustainable transportation through solar-powered vehicle design.",
        video: SolarCar,
        poster: SolarCarPoster,
        posHeader: "Low Voltage Engineer",
        posDescription: [],
    },
];

export default experienceData;

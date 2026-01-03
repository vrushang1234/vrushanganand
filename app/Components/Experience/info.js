const experienceData = [
    {
        id: "rcps",
        title: "RCPS Lab",
        date: "Mar 2025 - Present",
        description:
            "The Resilient Cyber-Physical Systems (RCPS) Lab at UC Irvine focuses on designing resilient, secure, and privacy-preserving cyber-physical systems, combining theory and real-world systems across robotics, IoT, and embedded intelligence.",
        poster: "/assets/Pictures/RCPS/RCPS.png",
        posHeader: "Undergraduate Researcher",
        posDescription: [
            "I developed an efficient PyTorch-based pipeline, accelerated with CUDA, for computing multivariate Bernstein polynomial coefficients using the Matrix Method. The implementation was designed to scale to high-dimensional inputs while maintaining numerical stability, enabling practical use of Bernstein representations in learning and analysis workflows.",
            "To improve performance, I optimized matrix construction through aggressive vectorization and memory reuse, reducing the computational complexity from O(n²ˡ) to O(nˡ⁺¹). These optimizations resulted in significant runtime improvements on large, high-dimensional datasets, particularly when executed on GPUs.",
            "I verified numerical accuracy by benchmarking the PyTorch implementation against MATLAB baselines, confirming both consistency and improved scalability relative to existing implementations.",
            "Building on this work, I implemented a custom neural network architecture incorporating Bernstein polynomial activation functions and integrated it into Stable-Baselines3. I evaluated the approach using PPO and A2C, benchmarking learning efficiency and policy optimization behavior against standard architectures to study the tradeoffs between expressiveness, stability, and performance.",
        ],
    },

    {
        id: "hyperxite",
        title: "HyperXite",
        date: "Aug 2023 – June 2025",
        description:
            "HyperXite is a student-led undergraduate project team building a prototype for the SpaceX Hyperloop project and competing globally.",
        video: "/assets/Videos/HyperXite.mp4",
        poster: "/assets/Pictures/HyperXite/hyperxite.webp",
        posHeader: "Control Systems Engineer",
        posDescription: [
            "I led the design and implementation of a C++ based control system to coordinate the pod’s propulsion, pneumatics, and braking subsystems. The Finite State Machine enforced strict safety guarantees while enabling efficient real-time operation, ensuring predictable behavior across all operational states.",
            "To support closed-loop control, we integrated a diverse set of sensors, including an IMU, wheel encoders, LiDAR, Hall effect sensors, and thermistors, using I²C and GPIO interfaces. Sensor acquisition and control logic were implemented using multithreaded programming, allowing concurrent data collection, processing, and actuation without violating real-time constraints.",
            "To enable remote operation and observability, we developed an interactive React-based control interface backed by WebSocket communication. This system provided live telemetry visualization and bidirectional control between the FSM and a remote control station, with telemetry efficiently cached and streamed to a central database for monitoring and analysis.",
            "What I enjoyed most was working at the boundary between software and physical systems - where timing matters, assumptions break, and every bug has a real-world consequence.",
        ],
        images: [
            {
                id: 1,
                url: "/assets/Pictures/HyperXite/hxpod.webp",
                title: "The HyperXite Pod",
            },
            {
                id: 2,
                url: "/assets/Pictures/HyperXite/FSM.png",
                title: "FSM Schematic",
            },
            {
                id: 3,
                url: "/assets/Pictures/HyperXite/Threading.png",
                title: "Multithreading Schematic",
            },
            {
                id: 4,
                url: "/assets/Pictures/HyperXite/HXTeam.JPG",
                title: "Team Photo",
            },
        ],
    },

    {
        id: "solarcar",
        title: "Solar Car",
        date: "April 2024 – June 2025",
        description:
            "UCI Solar Car is a team of undergraduate engineers pushing the boundaries of sustainable transportation.",
        video: "/assets/Videos/SolarCar.mp4",
        poster: "/assets/Pictures/SolarCar/solarcar.webp",
        posHeader: "Low Voltage Engineer",
        posDescription: [
            "I implemented a telemetry and fault detection system using ESP32 microcontrollers to collect, packetize, and transmit sensor data over a custom radio link. On the receiver side, telemetry was decoded from CAN bus message IDs, enabling structured access to data from the motor, battery management system (BMS), onboard sensors, and communication subsystems. I designed and implemented fault detection logic across these components to ensure safe and reliable operation under real-time conditions.",
            "On the trackside workstation, I designed a multithreaded backend to ingest and decode incoming radio packets while maintaining low-latency data handling. Telemetry was cached in Redis for fast access, periodically persisted to CSV for offline analysis, and streamed live to a Next.js-based dashboard. This architecture enabled real-time vehicle monitoring, historical analysis, and robust fault visibility during operation.",
            "What I enjoyed most was operating at the intersection of software and an energy-limited vehicle, where real-time telemetry, power efficiency, and fault tolerance directly determine on-track performance.",
        ],
        images: [
            {
                id: 1,
                url: "/assets/Pictures/SolarCar/solarcar1.webp",
                title: "The Solar Car",
            },
            {
                id: 2,
                url: "/assets/Pictures/SolarCar/dashboard.png",
                title: "Dashboard Flowchart",
            },
            {
                id: 3,
                url: "/assets/Pictures/SolarCar/telemetery.png",
                title: "Radio Telemetry Flowchart",
            },
            {
                id: 4,
                url: "/assets/Pictures/SolarCar/SolarCarTeam.webp",
                title: "Team Photo",
            },
        ],
    },

    {
        id: "swipetax",
        title: "SwipeTax",
        date: "Sep 2024 - Mar 2025",
        description:
            "SwipeTax is an all-in-one platform for automated bookkeeping, real-time insights, and tax-ready reporting.",
        poster: "/assets/Pictures/SwipeTax/swipetax_logo.jpg",
        posHeader: "Software Engineering Intern",
        posDescription: [
            "I developed a full-stack accounting platform for freelancers and small businesses using React, Node.js, and AWS EC2, with a focus on intuitive user experience and streamlined financial workflows. The platform was designed to reduce friction in everyday bookkeeping while remaining scalable and reliable.",
            "I integrated the Plaid API to enable secure, real-time bank synchronization and automated transaction tracking, with financial data persisted and managed through Supabase. This provided a consistent and centralized source of truth for user financial activity.",
            "To automate expense intake, I built a GPT-powered receipt digitization pipeline that extracts and structures transaction data from uploaded receipts. The system caches processed results in Redis for low-latency access and stores both raw and structured records in AWS S3 and Supabase, ensuring durability, traceability, and fast retrieval.",
        ],
    },
];

export default experienceData;

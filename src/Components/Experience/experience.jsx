import "./experience.css";
import HyperXite from "../../assets/Videos/HyperXite.mp4";
import SolarCar from "../../assets/Videos/SolarCar.mp4";

export default function Experience() {
  return (
    <div className="experience-container">
      <h1 className="experience-header">Experience</h1>
      <div className="video-container">
        <video autoPlay muted loop playsInline className="video-preview">
          <source src={HyperXite} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay">
          <h1>HyperXite</h1>
          <h2>Aug 2023 - June 2025</h2>
          <br />
          <p>
            HyperXite is a student led undergraduate project team, aimed at
            building a protype for the SpaceX hyperloop project and participates
            in global Hyperloop competitions. The team consists of engineers
            from various fields including Mechanical Engineering, Electrical
            Engineering, Aerospace Engineering, Computer Engineering etc.
          </p>
        </div>
      </div>
      <div className="video-container">
        <video autoPlay muted loop playsInline className="video-preview">
          <source src={SolarCar} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay">
          <h1>Solar Car</h1>
          <h2>April 2024 - June 2025</h2>
          <br />
          <p>
            UCI Solar Car is a team of undergraduate students from various
            Engineering fields, working on pushing the boundaries of sustainable
            transportation. The team has been working on the project for the
            last 2 years, meticulously designing and constructing a car that
            runs on solar energy from scratch. The team participates in various
            Solar Car competitions.
          </p>
        </div>
      </div>
    </div>
  );
}

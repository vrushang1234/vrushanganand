import Headshot from "@/assets/VrushangHeadshot.svg";
import "./LandingPage.css";
export default function Landing({ setstart }) {
  function animate() {
    setstart(true);
    document.getElementById("zoom-v").classList.add("zoom-animate");
    document.getElementsByClassName("landing-button")[0].style.display = "None";
    document.getElementsByClassName("landing-page")[0].classList.add("outro");
    setTimeout(() => {
      document.getElementsByClassName("loader")[0].style.opacity = "1";
    }, 1500);
    setTimeout(() => {
      document.getElementsByClassName("loader")[0].style.opacity = "0";
    }, 10000);
  }
  return (
    <div className="landing-page">
      <div className="loader"></div>
      <div className="landing-text">
        <div style={{ overflow: "visible" }}>
          <span id="zoom-v">Vrushang</span>
          <br /> Anand
        </div>
      </div>
      <img className="headshot" src={Headshot} />
      <button onClick={animate} className="landing-button">
        Let's go
      </button>
    </div>
  );
}

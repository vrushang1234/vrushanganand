import Headshot from "@/assets/VrushangHeadshot.svg";
import "./LandingPage.css";
export default function Landing({ setstart }) {
  function animate() {
    setstart(true);
    document.getElementById("zoom-v").classList.add("zoom-animate");
    document.getElementsByClassName("landing-button")[0].style.display = "None";
    document.getElementsByClassName("landing-page")[0].classList.add("outro");
  }
  return (
    <div className="landing-page">
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

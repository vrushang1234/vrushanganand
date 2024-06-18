import "./AboutMe.css";
import CodingCartoon from "@/assets/AboutMe.png";
export default function AboutMe() {
  return (
    <div className="about-me-container">
      <div className="about-me">
        Hey, my name is Vrushang Anand. I am a student at University of
        California, Irvine, currently pursuing my bachelor's in Computer
        Engineering and minor in Computer Science. My hobbies are cooking food
        and coding. I also play video games occasionally.
      </div>
      <img className="coding-cartoon" src={CodingCartoon} />
    </div>
  );
}

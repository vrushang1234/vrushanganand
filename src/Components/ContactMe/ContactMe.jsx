import "./ContactMe.css";
import Gmail from "@/assets/Gmail.svg";
import Github from "@/assets/Github.svg";
import LinkedIn from "@/assets/LinkedIn.svg";
import Instagram from "@/assets/Instagram.svg";
export default function ContactMe() {
  return (
    <div className="contact-me">
      <div>
        <a
          href="mailto:vrushanganand20@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="social-icon" src={Gmail}></img>
        </a>
        <a
          href="https://github.com/vrushang1234"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="social-icon" src={Github}></img>
        </a>
        <a
          href="https://www.linkedin.com/in/vrushang-anand12/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="social-icon" src={LinkedIn}></img>
        </a>
        <a
          href="https://www.instagram.com/vrushang.anand/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="social-icon" src={Instagram}></img>
        </a>
      </div>
    </div>
  );
}

import "./footer.css";

import Github from "../../assets/Pictures/github-white.png";
import Resume from "../../assets/Pictures/resume.png";
import LinkedIn from "../../assets/Pictures/linkedin.png";
import ResumePDF from "../../assets/Vrushang_Anand_Resume.pdf";

export default function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-text">
                &#169; Vrushang Anand. All Rights Reserved
            </div>
            <div className="footer-icons">
                <a
                    href="https://www.github.com/vrushang1234"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={Github} />
                </a>
                <a
                    href="https://www.linkedin.com/in/vrushang-anand12/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={LinkedIn} />
                </a>
                <a href={ResumePDF} target="_blank" rel="noopener noreferrer">
                    <img src={Resume} />
                </a>
            </div>
        </div>
    );
}

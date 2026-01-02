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
                <img src={Github} />
                <img src={LinkedIn} />
                <a href={ResumePDF} target="_blank" rel="noopener noreferrer">
                    <img src={Resume} />
                </a>
            </div>
        </div>
    );
}

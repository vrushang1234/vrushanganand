"use client";
import "./footer.css";

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
                    <img src="/assets/Pictures/github-white.png" alt="GitHub" />
                </a>

                <a
                    href="https://www.linkedin.com/in/vrushang-anand12/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src="/assets/Pictures/linkedin.png" alt="LinkedIn" />
                </a>

                <a
                    href="/assets/Vrushang_Anand_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src="/assets/Pictures/resume.png" alt="Resume" />
                </a>
            </div>
        </div>
    );
}

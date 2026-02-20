import "../Components/Navbar/navbar.css";
import "./linktree.css";

export default function Linktree() {
    return (
        <>
            <header className="navbar">
                <h1 className="navbar-title">
                    <a href="/">Vrushang Anand</a>
                </h1>
            </header>

            <div className="linktree-container">
                <img
                    className="linktree-pic"
                    src="/assets/Pictures/Articles/Vrushang.jpg"
                    alt="Vrushang Anand"
                />
                <h1 className="linktree-name">Vrushang Anand</h1>
                <p className="linktree-location">
                    <span className="icon-col">
                        <img
                            src="/assets/Pictures/Articles/location.svg"
                            alt=""
                        />
                    </span>
                    <span>Irvine, CA</span>
                </p>

                <div className="linktree-section">
                    <h2>Connect</h2>

                    <a
                        href="mailto:vrushanganand2004@gmail.com"
                        className="linktree-link"
                    >
                        <span className="icon-col">
                            <img
                                src="/assets/Pictures/Articles/mail.svg"
                                alt=""
                            />
                        </span>
                        <span>vrushanganand2004@gmail.com</span>
                    </a>

                    <a
                        href="https://www.vrushanganand.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="linktree-link"
                    >
                        <span className="icon-col">
                            <img src="/favicon-white.ico" alt="" />
                        </span>
                        <span>Portfolio</span>
                    </a>

                    <a
                        href="https://www.github.com/vrushang1234"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="linktree-link"
                    >
                        <span className="icon-col">
                            <img
                                src="/assets/Pictures/Articles/github-svg.svg"
                                alt=""
                            />
                        </span>
                        <span>GitHub</span>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/vrushang-anand12/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="linktree-link"
                    >
                        <span className="icon-col">
                            <img
                                src="/assets/Pictures/Articles/linkedin.svg"
                                alt=""
                            />
                        </span>
                        <span>LinkedIn</span>
                    </a>

                    <a
                        href="/assets/Vrushang_Anand_Resume.pdf"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="linktree-link"
                    >
                        <span className="icon-col">
                            <img
                                src="/assets/Pictures/Articles/link.svg"
                                alt=""
                            />
                        </span>
                        <span>Resume</span>
                    </a>
                    <a
                        href="https://www.vrushanganand.com/articles"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="linktree-link"
                    >
                        <span className="icon-col">
                            <img src="/assets/Pictures/articles.svg" alt="" />
                        </span>
                        <span>Articles</span>
                    </a>
                </div>
            </div>
        </>
    );
}

import "./articles.css";

export default function Articles() {
    return (
        <div className="articles-container">
            <div className="articles-about">
                <div style={{ width: "40%", minWidth: "300px" }}>
                    <img
                        className="vrushang-pic"
                        src="/assets/Pictures/Articles/Vrushang.jpg"
                    />

                    <div className="vrushang-info">
                        <h1>Vrushang Anand</h1>

                        <p>
                            <span className="icon-col">
                                <img src="/assets/Pictures/Articles/location.svg" />
                            </span>
                            <span>Irvine, CA</span>
                        </p>

                        <p>
                            <a
                                href="mailto:vrushanganand2004@gmail.com"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <span className="icon-col">
                                    <img src="/assets/Pictures/Articles/mail.svg" />
                                </span>
                                <span>vrushanganand2004@gmail.com</span>
                            </a>
                        </p>

                        <p>
                            <a
                                href="https://www.vrushanganand.com"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <span className="icon-col">
                                    <img src="/assets/Pictures/Articles/link.svg" />
                                </span>
                                <span>https://www.vrushanganand.com</span>
                            </a>
                        </p>

                        <p>
                            <a
                                href="https://www.github.com/vrushang1234"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <span className="icon-col">
                                    <img src="/assets/Pictures/Articles/github-svg.svg" />
                                </span>
                                <span>https://www.github.com/vrushang1234</span>
                            </a>
                        </p>
                        <p>
                            <a
                                href="https://www.linkedin.com/in/vrushang-anand12/"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <span className="icon-col">
                                    <img src="/assets/Pictures/Articles/linkedin.svg" />
                                </span>
                                <span>
                                    https://www.linkedin.com/in/vrushang-anand12/
                                </span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="articles-list">
                <div className="article-list-element">
                    <a className="article-link" href="articles/rl-scheduler">
                        <h2>RL Powered Kernel Scheduler</h2>
                        <p>
                            A custom reinforcement learning powered process
                            scheduler integrated into the Arch Linux kernel for
                            adaptive, low-latency task scheduling.
                        </p>
                    </a>
                </div>
            </div>
        </div>
    );
}

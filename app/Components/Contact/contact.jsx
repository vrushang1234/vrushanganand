"use client";
import "./contact.css";

export default function Contact() {
    return (
        <div className="contact-section-container" id="contact">
            <div className="contact-container">
                <div className="contact-surface"></div>
            </div>

            <div className="contact-text">
                <h1>Let's Collaborate!</h1>
                <p>I am always down to create cool stuff together!</p>

                <a href="mailto:vrushanganand2004@gmail.com">
                    <button className="contact-button">
                        <img
                            src="/assets/Pictures/mail.png"
                            className="mail-icon"
                            alt="Mail"
                        />
                        Get in touch
                    </button>
                </a>
            </div>
        </div>
    );
}

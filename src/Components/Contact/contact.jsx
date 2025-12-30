import "./contact.css";

import mail from "../../assets/Pictures/mail.png";

export default function Contact() {
    return (
        <div className="contact-section-container">
            <div className="contact-container">
                <div className="contact-surface"></div>
            </div>
            <div className="contact-text">
                <h1>Let's Collaborate!</h1>
                <p>I am always down create cool stuff together!</p>
                <button className="contact-button">
                    <img src={mail} className="mail-icon" />
                    Get in touch
                </button>
            </div>
        </div>
    );
}

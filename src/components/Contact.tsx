import { useState, FormEvent } from "react";
import { MdArrowOutward, MdCopyright, MdDescription } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xkokvbwp", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setFormState("sent");
        form.reset();
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a href="mailto:99anujbansal@gmail.com" data-cursor="disable">
                99anujbansal@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+15089652806" data-cursor="disable">
                (508) 965-2806
              </a>
            </p>
            <h4>Education</h4>
            <p>MS Data Science, UMass Dartmouth — 2024–Present (GPA: 3.6)</p>
            <p>B.Tech Mechanical Engineering, Punjab Technical University — 2016–2020</p>
            <h4>Location</h4>
            <p>Boston · New York · Texas · Remote</p>
            <h4>Resumes</h4>
            <a
              href="https://drive.google.com/drive/folders/1WAQVRc-gTyEjBhdDnthiCjIihxO6FtXD?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="resume-button"
            >
              <MdDescription /> View My Resumes
            </a>
            <p className="resume-helper">
              Download role-specific resumes for Data Scientist, Data Analyst,
              Business Analyst, Data Engineer, ML Engineer, and Finance Analyst positions
            </p>
          </div>
          <div className="contact-box">
            <h4>Send a Message</h4>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                data-cursor="disable"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                data-cursor="disable"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                required
                data-cursor="disable"
              />
              <button
                type="submit"
                disabled={formState === "sending"}
                data-cursor="disable"
                className="contact-submit"
              >
                {formState === "sending" ? "Sending..." : "Send Message"}
              </button>
              {formState === "sent" && (
                <p className="form-feedback form-success">Message sent!</p>
              )}
              {formState === "error" && (
                <p className="form-feedback form-error">Something went wrong. Try again.</p>
              )}
            </form>
            <h4 style={{ marginTop: "30px" }}>Social</h4>
            <a
              href="https://github.com/99anujb"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://linkedin.com/in/anuj-bansal-854772189"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="mailto:99anujbansal@gmail.com"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Anuj Bansal</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

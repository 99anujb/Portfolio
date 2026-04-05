import { MdArrowOutward, MdCopyright, MdDescription } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="mailto:99anujbansal@gmail.com"
                data-cursor="disable"
              >
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
            <p>
              MS Data Science, UMass Dartmouth — 2024–Present (GPA: 3.6)
            </p>
            <p>
              B.Tech Mechanical Engineering, Punjab Technical University — 2016–2020
            </p>
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
            <h4>Social</h4>
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
            <a
              href="https://drive.google.com/drive/folders/1WAQVRc-gTyEjBhdDnthiCjIihxO6FtXD?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Resumes <MdArrowOutward />
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

import { useEffect, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useSmoother } from "../context/SmootherContext";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const Navbar = () => {
  const smootherRef = useSmoother();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (window.innerWidth > 1024 && smootherRef.current) {
        e.preventDefault();
        const section = e.currentTarget.getAttribute("data-href");
        if (section) {
          smootherRef.current.scrollTo(section, true, "top top");
        }
      }
    },
    [smootherRef]
  );

  useEffect(() => {
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smootherRef.current.scrollTop(0);
    smootherRef.current.paused(true);

    const handleResize = () => ScrollSmoother.refresh(true);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [smootherRef]);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          AB
        </a>
        <a
          href="https://linkedin.com/in/anuj-bansal-854772189"
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          99anujbansal@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about" onClick={handleNavClick}>
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work" onClick={handleNavClick}>
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact" onClick={handleNavClick}>
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;

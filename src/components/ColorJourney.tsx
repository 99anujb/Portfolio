import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Background hue shifts as you travel down the page. Each color stays dark
// enough for the existing text/accent palette; sections whose CSS uses
// var(--backgroundColor) follow automatically.
const STOPS: [selector: string, color: string][] = [
  [".landing-section", "#0a0e17"],
  [".about-section", "#101434"],
  [".whatIDO", "#062226"],
  [".career-section", "#1b1133"],
  [".work-section", "#0b1730"],
  [".playground-section", "#072630"],
  [".github-section", "#161232"],
  [".techstack", "#0a0e17"],
  [".contact-section", "#120e26"],
];

const ColorJourney = () => {
  useEffect(() => {
    const shift = (color: string) => {
      gsap.to("html", {
        "--backgroundColor": color,
        duration: 1,
        ease: "power1.out",
        overwrite: "auto",
      });
      gsap.to("body", {
        backgroundColor: color,
        duration: 1,
        ease: "power1.out",
        overwrite: "auto",
      });
    };

    const triggers = STOPS.filter(([sel]) =>
      document.querySelector(sel)
    ).map(([sel, color]) =>
      ScrollTrigger.create({
        trigger: sel,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => shift(color),
        onEnterBack: () => shift(color),
      })
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
};

export default ColorJourney;

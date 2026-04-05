import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  // Teal text
  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  var tealText1 = new SplitText(".landing-h2-1", TextProps);
  var tealText2 = new SplitText(".landing-h2-2", TextProps);
  var tealText3 = new SplitText(".landing-h2-3", TextProps);
  var tealText4 = new SplitText(".landing-h2-4", TextProps);
  var tealText5 = new SplitText(".landing-h2-5", TextProps);
  var tealText6 = new SplitText(".landing-h2-6", TextProps);

  LoopTexts([tealText1, tealText2, tealText3, tealText4, tealText5, tealText6]);
}

function LoopTexts(texts: SplitText[]) {
  const tl = gsap.timeline({ repeat: -1 });
  const holdDuration = 1.5;
  const transitionDuration = 0.6;

  texts.forEach((_, i) => {
    const current = texts[i];
    const next = texts[(i + 1) % texts.length];
    const offset = i * (holdDuration + transitionDuration);

    // Current text moves out (up)
    tl.to(
      current.chars,
      {
        y: -80,
        duration: transitionDuration,
        ease: "power3.inOut",
        stagger: 0.05,
      },
      offset + holdDuration
    );

    // Next text moves in (from below)
    tl.fromTo(
      next.chars,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: transitionDuration,
        ease: "power3.inOut",
        stagger: 0.05,
      },
      offset + holdDuration
    );
  });
}

import { createContext, useContext, useRef, PropsWithChildren } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";

interface SmootherContextType {
  smootherRef: React.MutableRefObject<ScrollSmoother | null>;
}

const SmootherContext = createContext<SmootherContextType | null>(null);

export const SmootherProvider = ({ children }: PropsWithChildren) => {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  return (
    <SmootherContext.Provider value={{ smootherRef }}>
      {children}
    </SmootherContext.Provider>
  );
};

export const useSmoother = () => {
  const context = useContext(SmootherContext);
  if (!context) {
    throw new Error("useSmoother must be used within SmootherProvider");
  }
  return context.smootherRef;
};

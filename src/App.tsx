import { lazy, Suspense } from "react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import { SmootherProvider } from "./context/SmootherContext";

const App = () => {
  return (
    <>
      <SmootherProvider>
        <LoadingProvider>
          <Suspense>
            <MainContainer>
              <Suspense>
                <CharacterModel />
              </Suspense>
            </MainContainer>
          </Suspense>
        </LoadingProvider>
      </SmootherProvider>
      <Analytics />
    </>
  );
};

export default App;

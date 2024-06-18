import React, { useState } from "react";
import Landing from "@/Components/LandingPage/LandingPage";
import AboutMe from "./Components/AboutMe/AboutMe";
import Skills from "./Components/Skills/Skills";
import ContactMe from "./Components/ContactMe/ContactMe";

export default function App() {
  const [start, setstart] = useState(false);

  return (
    <div>
      <Landing setstart={setstart} />
      {start && (
        <>
          <AboutMe />
          <Skills />
          <ContactMe />
        </>
      )}
    </div>
  );
}

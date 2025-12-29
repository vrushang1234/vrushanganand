import About from "./Components/About/about";
import Experience from "./Components/Experience/experience";
import Intro from "./Components/Intro/intro";
import Projects from "./Components/Projects/projects";
import Skills from "./Components/Skills/skills";
import "./index.css";
export default function App() {
    return (
        <div>
            <Intro />
            <About />
            <Experience />
            <Projects />
            <Skills />
        </div>
    );
}

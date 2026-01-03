import About from "./Components/About/about";
import Contact from "./Components/Contact/contact";
import Experience from "./Components/Experience/experience";
import Footer from "./Components/Footer/footer";
import Intro from "./Components/Intro/intro";
import Projects from "./Components/Projects/projects";
import Skills from "./Components/Skills/skills";

export default function Home() {
    return (
        <>
            <Intro />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Contact />
            <Footer />
        </>
    );
}

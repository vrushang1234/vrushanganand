import About from "./Components/About/about";
import Intro from "./Components/Intro/intro";
import "./index.css";
export default function App() {
  return (
    <div>
      <Intro />
      <About />
      <div style={{height:"100vh"}}></div>
    </div>
  );
}

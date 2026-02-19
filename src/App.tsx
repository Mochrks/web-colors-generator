import "./App.css";
import ColorGenerator from "./components/demo/ColorGeneration";
import { Footer } from "./components/demo/Footer";
import { Navbar } from "./components/demo/Navbar";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

function App() {
  return (
    <SmoothScrollProvider>
      <div className="w-full min-h-screen hero-gradient noise-overlay">
        <Navbar />
        <main className="pt-24 pb-8">
          <ColorGenerator />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}

export default App;

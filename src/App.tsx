import "./App.css";
import ColorGenerator from "./components/demo/ColorGeneration";
import { Footer } from "./components/demo/Footer";
import { Navbar } from "./components/demo/Navbar";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

function App() {
  return (
    <SmoothScrollProvider>
      <div className="w-full min-h-screen mesh-gradient bg-transition relative">
        {/* Progress Bar */}
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 z-[100] transition-all duration-300"
          id="scroll-progress-bar"
          style={{ width: "0%" }}
        />

        <Navbar />
        <main className="relative pt-24 pb-16">
          <ColorGenerator />
        </main>
        <Footer />

        {/* Global Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </SmoothScrollProvider>
  );
}

export default App;

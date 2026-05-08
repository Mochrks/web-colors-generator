import "./App.css";
import ColorGenerator from "./components/demo/ColorGeneration";
import { Footer } from "./components/demo/Footer";
import { Navbar } from "./components/demo/Navbar";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

function App() {
  return (
    <SmoothScrollProvider>
      <div className="w-full min-h-screen mesh-gradient relative">
        <Navbar />
        <main className="relative pt-14">
          <ColorGenerator />
        </main>
        <Footer />

        {/* Subtle noise for depth, very low opacity */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </SmoothScrollProvider>
  );
}

export default App;

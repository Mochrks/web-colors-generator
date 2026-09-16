import "./styles/App.css";
import ColorGenerator from "./components/demo/ColorGeneration";
import { Footer } from "./components/demo/Footer";
import SmoothScrollProvider from "./components/demo/SmoothScrollProvider";

function App() {
  return (
    <SmoothScrollProvider>
      <div className="w-full min-h-screen bg-[#020202] relative">
        <main className="relative">
          <ColorGenerator />
        </main>
        <Footer />

        {/* Subtle noise for depth */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </SmoothScrollProvider>
  );
}

export default App;

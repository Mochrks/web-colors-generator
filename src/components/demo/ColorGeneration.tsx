"use client";

import { useState, useLayoutEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pipette,
  Sparkles,
  Paintbrush,
  Eye,
  Blend,
  Image as ImageIcon,
  Bookmark,
  ChevronsRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ColorPickerConverter from "./ColorPickerConverter";
import ColorHarmony from "./ColorHarmony";
import GradientGenerator from "./GradientGenerator";
import ContrastChecker from "./ContrastChecker";
import ColorBlender from "./ColorBlender";
import ImageColorExtractor from "./ImageColorExtractor";
import PaletteShowcase from "./PaletteShowcase";
import SavedColors from "./SavedColors";
import LightTunnel from "./LightTunnel";
import GradualBlur from "./GradualBlur";
import FoldText from "./FoldText";

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { id: "picker", label: "Color Picker", icon: Pipette, desc: "Pick & convert colors" },
  { id: "harmony", label: "Harmony", icon: Sparkles, desc: "Generate harmonies" },
  { id: "gradient", label: "Gradient", icon: Paintbrush, desc: "Create gradients" },
  { id: "contrast", label: "Contrast", icon: Eye, desc: "Check accessibility" },
  { id: "blender", label: "Blender", icon: Blend, desc: "Blend two colors" },
  { id: "extract", label: "Extractor", icon: ImageIcon, desc: "Extract from image" },
  { id: "saved", label: "Saved", icon: Bookmark, desc: "Your saved colors" },
];

export default function ColorGenerator() {
  const [activeTab, setActiveTab] = useState("picker");
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 60,
        opacity: 0,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full">
      {/* ══════════════════════════ HERO ══════════════════════ */}
      <div
        ref={heroRef}
        className="relative w-full flex flex-col items-center justify-center text-center min-h-[88vh] py-28 px-6 overflow-hidden bg-[#020202]"
        id="hero-section"
      >
        {/* WebGL bg */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <LightTunnel
              cableColor="#A855F7"
              pulseColor="#A855F7"
              tunnelColor="#5227FF"
              tunnelOpacity={0}
              speed={0.1}
              pulseSpeed={2}
              pulseLength={0.28}
              pulseBlend={1}
              pulseWidth={1}
              cableCount={20}
              thickness={0.35}
              rimWidth={0.15}
              waviness={0.3}
              sway={0.5}
              size={1.5}
              centerX={0}
              centerY={0}
              glow={1}
              fadeNear={0.5}
              fadeFar={2}
              brightness={1}
              colorVariance
              grain
              grainIntensity={0.05}
              opacity={0.8}
              mouseInteraction
              mouseStrength={0.1}
            />
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-[60vh] pointer-events-none z-[5]"
            style={{
              background:
                "linear-gradient(to top, #020202 0%, #020202 20%, rgba(2,2,2,0.88) 48%, rgba(2,2,2,0.3) 74%, transparent 100%)",
            }}
          />
          <GradualBlur preset="bottom" height="28vh" zIndex={10} className="pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          {/* Headline only */}
          <h1 className="text-center leading-[0.96] tracking-tight">
            {/* Line 1 — "Generate >> Your" */}
            <span className="block text-neutral-500 font-medium text-[clamp(2.6rem,8vw,6rem)]">
              <FoldText
                text="Generate"
                splitBy="char"
                hinge="top"
                trigger="mount"
                duration={0.52}
                stagger={0.036}
                fontSize="inherit"
                fontWeight="inherit"
                color="inherit"
              />
              <span className="inline-flex items-center justify-center px-4 py-2 mx-3 rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500 text-white shadow-xl shadow-fuchsia-500/25 align-middle">
                <ChevronsRight className="w-[0.7em] h-[0.7em]" />
              </span>
              <FoldText
                text="Your"
                splitBy="char"
                hinge="top"
                trigger="mount"
                duration={0.52}
                stagger={0.036}
                fontSize="inherit"
                fontWeight="inherit"
                color="inherit"
              />
            </span>
            {/* Line 2 — "Perfect Color Palette" white bold */}
            <span className="block text-white font-extrabold text-[clamp(2.6rem,8vw,6rem)] mt-1">
              <FoldText
                text="Perfect Color Palette"
                splitBy="word"
                hinge="bottom"
                trigger="mount"
                duration={0.68}
                stagger={0.09}
                ease="power4.out"
                fontSize="inherit"
                fontWeight="inherit"
                color="inherit"
              />
            </span>
          </h1>
        </div>
      </div>

      {/* ═══════════════════ MAIN CONTENT ═════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-6 space-y-24 mt-12 sm:mt-20">
        {/* TOOLS */}
        <section id="tools-section" className="space-y-12" data-animate>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 z-40 py-4 bg-[#020202]/80 backdrop-blur-xl border-b border-white/[0.05] -mx-6 px-6">
              <div className="w-full overflow-x-auto scrollbar-hide -mb-4 pb-4">
                <TabsList className="flex w-max mx-auto sm:w-auto sm:justify-center gap-1 p-1 rounded-2xl bg-white/[0.05] border border-white/[0.08] h-auto min-w-full sm:min-w-0">
                  {tools.map(({ id, label, icon: Icon }) => (
                    <TabsTrigger
                      key={id}
                      value={id}
                      className="rounded-xl gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs font-semibold data-[state=active]:bg-white/10 data-[state=active]:shadow-sm transition-all text-neutral-500 data-[state=active]:text-white whitespace-nowrap"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            <div className="mt-8">
              <TabsContent value="picker" className="mt-0 animate-fade-in outline-none">
                <ColorPickerConverter />
              </TabsContent>
              <TabsContent value="harmony" className="mt-0 animate-fade-in outline-none">
                <ColorHarmony />
              </TabsContent>
              <TabsContent value="gradient" className="mt-0 animate-fade-in outline-none">
                <GradientGenerator />
              </TabsContent>
              <TabsContent value="contrast" className="mt-0 animate-fade-in outline-none">
                <ContrastChecker />
              </TabsContent>
              <TabsContent value="blender" className="mt-0 animate-fade-in outline-none">
                <ColorBlender />
              </TabsContent>
              <TabsContent value="extract" className="mt-0 animate-fade-in outline-none">
                <ImageColorExtractor />
              </TabsContent>
              <TabsContent value="saved" className="mt-0 animate-fade-in outline-none">
                <SavedColors />
              </TabsContent>
            </div>
          </Tabs>
        </section>

        {/* DIVIDER */}
        <div className="flex items-center gap-8 py-12" data-animate>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600">
            Featured Collections
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* PALETTES */}
        <section id="palettes-section" className="pb-24" data-animate>
          <PaletteShowcase />
        </section>
      </div>
    </div>
  );
}

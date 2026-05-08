"use client";

import { useState, useLayoutEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pipette, Sparkles, Paintbrush, Eye, Blend, Image, Bookmark } from "lucide-react";
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

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { id: "picker", label: "Color Picker", icon: Pipette, desc: "Pick & convert colors" },
  { id: "harmony", label: "Harmony", icon: Sparkles, desc: "Generate harmonies" },
  { id: "gradient", label: "Gradient", icon: Paintbrush, desc: "Create gradients" },
  { id: "contrast", label: "Contrast", icon: Eye, desc: "Check accessibility" },
  { id: "blender", label: "Blender", icon: Blend, desc: "Blend two colors" },
  { id: "extract", label: "Extractor", icon: Image, desc: "Extract from image" },
  { id: "saved", label: "Saved", icon: Bookmark, desc: "Your saved colors" },
];

export default function ColorGenerator() {
  const [activeTab, setActiveTab] = useState("picker");
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".hero-badge", { opacity: 1, y: 0, duration: 0.8, startAt: { y: 10 } })
        .to(".hero-title", { opacity: 1, y: 0, duration: 1, startAt: { y: 20 } }, "-=0.6")
        .to(".hero-description", { opacity: 1, y: 0, duration: 0.8, startAt: { y: 10 } }, "-=0.6")
        .to(".hero-stats", { opacity: 1, y: 0, duration: 0.8, startAt: { y: 10 } }, "-=0.6");

      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 50,
        opacity: 0,
      });

      gsap.from(".stat-item", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".hero-stats",
          start: "top 90%",
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 space-y-24">
      {/* ======== HERO ======== */}
      <div
        ref={heroRef}
        className="relative text-center space-y-10 py-20 sm:py-32"
        id="hero-section"
      >
        <div className="relative z-10 space-y-8">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-0">
            <Sparkles className="h-3 w-3" />
            <span>Design With Perfect Colors</span>
          </div>

          <h1 className="hero-title text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-neutral-900 dark:text-white opacity-0">
            Professional color
            <br />
            <span className="text-neutral-400 dark:text-neutral-500">made simple.</span>
          </h1>

          <p className="hero-description text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-lg sm:text-xl leading-relaxed font-medium opacity-0">
            A minimalist workspace for designers to pick, harmonize, and generate stunning colors
            with precision and ease.
          </p>

          {/* Quick stats with cards */}
          <div className="hero-stats flex flex-wrap justify-center gap-4 pt-4 opacity-0">
            {[
              { label: "Formats", value: "6+" },
              { label: "Palettes", value: "23k" },
              { label: "Tools", value: "7" },
              { label: "Harmonies", value: "5" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="stat-item min-w-[120px] p-6 rounded-3xl apple-card bg-white dark:bg-neutral-950"
              >
                <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======== TOOLS SECTION ======== */}
      <section id="tools-section" className="space-y-12" data-animate>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-14 z-40 py-6 apple-blur -mx-6 px-6">
            <div className="max-w-fit mx-auto overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex gap-1 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50 h-auto">
                {tools.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    className="rounded-xl gap-2 px-5 py-2.5 text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all text-neutral-500 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white"
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

      {/* ======== DIVIDER ======== */}
      <div className="flex items-center gap-8 py-12" data-animate>
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
          Featured Collections
        </span>
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* ======== PALETTES SECTION ======== */}
      <section id="palettes-section" className="pb-24" data-animate>
        <PaletteShowcase />
      </section>
    </div>
  );
}

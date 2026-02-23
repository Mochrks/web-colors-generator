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
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(".hero-badge", { opacity: 1, y: 0, duration: 1, startAt: { y: 20 } })
        .to(".hero-title", { opacity: 1, y: 0, duration: 1.2, startAt: { y: 40 } }, "-=0.8")
        .to(".hero-description", { opacity: 1, y: 0, duration: 1, startAt: { y: 20 } }, "-=0.8")
        .to(".hero-stats", { opacity: 1, y: 0, duration: 1, startAt: { y: 20 } }, "-=0.8")
        .to(".hero-scroll-indicator", { opacity: 1, duration: 1 }, "-=0.5");

      // Scroll animations
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 100,
        opacity: 0,
        scale: 0.9,
      });

      // Stats cards staggered hover-like entry
      gsap.from(".hero-stats > div", {
        opacity: 0,
        scale: 0.8,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".hero-stats",
          start: "top 90%",
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 space-y-12">
      {/* ======== HERO ======== */}
      <div
        ref={heroRef}
        className="relative text-center space-y-8 py-16 sm:py-24 overflow-hidden"
        id="hero-section"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-soft" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-[100px] animate-pulse-soft"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-primary text-xs font-semibold opacity-0">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="tracking-wider uppercase">Next-Gen Creative Suite</span>
          </div>

          <h1 className="hero-title text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] opacity-0">
            <span className="gradient-text  text-glow">Color Generation</span>
            <br />
            <span className="text-foreground">Made Beautiful</span>
          </h1>

          <p className="hero-description text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed opacity-0">
            Elevate your design workflow with professional-grade color tools. Experience seamless
            extraction, harmony generation, and high-fidelity gradients in one stunning workspace.
          </p>

          {/* Quick stats with cards */}
          <div className="hero-stats flex flex-wrap justify-center gap-4 sm:gap-6 pt-6 opacity-0">
            {[
              { label: "Formats", value: "6+", sub: "Universal support" },
              { label: "Palettes", value: "23k", sub: "Curated daily" },
              { label: "Tools", value: "7", sub: "Pro features" },
              { label: "Harmonies", value: "5", sub: "Color theory" },
            ].map((stat) => (
              <div key={stat.label} className="group relative p-4 sm:p-6 rounded-3xl premium-card">
                <div className="text-2xl sm:text-3xl font-black gradient-text group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground/80">
                  {stat.label}
                </div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="hero-scroll-indicator pt-12 opacity-0">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                Scroll to explore
              </span>
              <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* ======== TOOLS SECTION ======== */}
      <section id="tools-section" data-animate>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="sticky top-16 z-40 py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="overflow-x-auto pb-1 scrollbar-hide">
              <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 sm:w-full gap-1 p-1.5 rounded-2xl bg-muted/60 backdrop-blur-sm h-auto">
                {tools.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    className="rounded-xl gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 transition-all whitespace-nowrap flex-1 sm:flex-initial font-medium"
                    id={`tab-${id}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            <TabsContent value="picker" className="mt-0 animate-fade-in">
              <ColorPickerConverter />
            </TabsContent>
            <TabsContent value="harmony" className="mt-0 animate-fade-in">
              <ColorHarmony />
            </TabsContent>
            <TabsContent value="gradient" className="mt-0 animate-fade-in">
              <GradientGenerator />
            </TabsContent>
            <TabsContent value="contrast" className="mt-0 animate-fade-in">
              <ContrastChecker />
            </TabsContent>
            <TabsContent value="blender" className="mt-0 animate-fade-in">
              <ColorBlender />
            </TabsContent>
            <TabsContent value="extract" className="mt-0 animate-fade-in">
              <ImageColorExtractor />
            </TabsContent>
            <TabsContent value="saved" className="mt-0 animate-fade-in">
              <SavedColors />
            </TabsContent>
          </div>
        </Tabs>
      </section>

      {/* ======== DIVIDER ======== */}
      <div className="flex items-center gap-4" data-animate>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-purple-500" />
          Curated Palettes
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ======== PALETTES SECTION — always visible ======== */}
      <section id="palettes-section" data-animate>
        <PaletteShowcase />
      </section>
    </div>
  );
}

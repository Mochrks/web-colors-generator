"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pipette, Sparkles, Paintbrush, Eye, Blend, Image, Bookmark } from "lucide-react";
import ColorPickerConverter from "./ColorPickerConverter";
import ColorHarmony from "./ColorHarmony";
import GradientGenerator from "./GradientGenerator";
import ContrastChecker from "./ContrastChecker";
import ColorBlender from "./ColorBlender";
import ImageColorExtractor from "./ImageColorExtractor";
import PaletteShowcase from "./PaletteShowcase";
import SavedColors from "./SavedColors";

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

  return (
    <div className="container mx-auto px-4 sm:px-6 space-y-12">
      {/* ======== HERO ======== */}
      <div className="text-center space-y-4 py-4 sm:py-8" data-animate>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          Advanced Color Tools • HEX • RGB • RGBA • HSL • CMYK
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight animate-slide-up">
          <span className="gradient-text">Color Generation</span>
          <br />
          <span className="text-foreground">Made Beautiful</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base animate-fade-in leading-relaxed">
          Pick, convert, generate & explore colors across every format. Build gradients, check
          contrast, extract from images, explore curated palettes, and more.
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-2 animate-fade-in">
          {[
            { label: "Color Formats", value: "6" },
            { label: "Curated Palettes", value: "23" },
            { label: "Tools", value: "7" },
            { label: "Harmony Types", value: "5" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-2xl font-black gradient-text">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ======== TOOLS SECTION ======== */}
      <section id="tools-section" data-animate>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="sticky top-16 z-40 py-3 -mx-4 px-4 sm:mx-0 sm:px-0 backdrop-blur-xl bg-background/60">
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

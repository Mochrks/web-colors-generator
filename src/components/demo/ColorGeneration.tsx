import { useState, useLayoutEffect, useRef, useEffect } from "react";
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
import FolderFloat from "./FolderFloat";
import { useLenis } from "./SmoothScrollProvider";
import {
  FOLDER_FLOAT_ITEMS,
  FOLDER_FLOAT_LABEL,
  FOLDER_FLOAT_SUBLABEL,
  FOLDER_FLOAT_CONFIG,
  LIGHT_TUNNEL_CONFIG,
} from "@/constants";

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { id: "picker", label: "Color Picker", icon: Pipette },
  { id: "harmony", label: "Harmony", icon: Sparkles },
  { id: "gradient", label: "Gradient", icon: Paintbrush },
  { id: "contrast", label: "Contrast", icon: Eye },
  { id: "blender", label: "Blender", icon: Blend },
  { id: "extract", label: "Extractor", icon: ImageIcon },
  { id: "saved", label: "Saved", icon: Bookmark },
];

const FOLDER_TAB_MAP: Record<string, string> = {
  "Pick & convert colors": "picker",
  "Generate harmonies": "harmony",
  "Build gradients": "gradient",
  "Check contrast (WCAG)": "contrast",
  "Blend two colors": "blender",
  "Extract from image": "extract",
};

export default function ColorGenerator() {
  const [activeTab, setActiveTab] = useState("picker");
  const [tabNavVisible, setTabNavVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const toolsSectionRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

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

  useEffect(() => {
    const section = toolsSectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: () => setTabNavVisible(true),
      onLeaveBack: () => setTabNavVisible(false),
    });

    return () => trigger.kill();
  }, []);

  const scrollToTools = () => {
    const target = toolsSectionRef.current;
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: -60, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFolderSelect = (value: string, index: number) => {
    const tab = FOLDER_TAB_MAP[value];
    if (tab) {
      setActiveTab(tab);
      scrollToTools();
    }
    console.log(value, index);
  };

  return (
    <div className="w-full">
      <div
        ref={heroRef}
        className="relative w-full flex flex-col items-center justify-center text-center min-h-[88vh] py-28 px-6 bg-[#020202]"
        id="hero-section"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <LightTunnel
              cableColor={LIGHT_TUNNEL_CONFIG.cableColor}
              pulseColor={LIGHT_TUNNEL_CONFIG.pulseColor}
              tunnelColor={LIGHT_TUNNEL_CONFIG.tunnelColor}
              tunnelOpacity={LIGHT_TUNNEL_CONFIG.tunnelOpacity}
              speed={LIGHT_TUNNEL_CONFIG.speed}
              pulseSpeed={LIGHT_TUNNEL_CONFIG.pulseSpeed}
              pulseLength={LIGHT_TUNNEL_CONFIG.pulseLength}
              pulseBlend={LIGHT_TUNNEL_CONFIG.pulseBlend}
              pulseWidth={LIGHT_TUNNEL_CONFIG.pulseWidth}
              cableCount={LIGHT_TUNNEL_CONFIG.cableCount}
              thickness={LIGHT_TUNNEL_CONFIG.thickness}
              rimWidth={LIGHT_TUNNEL_CONFIG.rimWidth}
              waviness={LIGHT_TUNNEL_CONFIG.waviness}
              sway={LIGHT_TUNNEL_CONFIG.sway}
              size={LIGHT_TUNNEL_CONFIG.size}
              centerX={LIGHT_TUNNEL_CONFIG.centerX}
              centerY={LIGHT_TUNNEL_CONFIG.centerY}
              glow={LIGHT_TUNNEL_CONFIG.glow}
              fadeNear={LIGHT_TUNNEL_CONFIG.fadeNear}
              fadeFar={LIGHT_TUNNEL_CONFIG.fadeFar}
              brightness={LIGHT_TUNNEL_CONFIG.brightness}
              colorVariance={LIGHT_TUNNEL_CONFIG.colorVariance}
              grain={LIGHT_TUNNEL_CONFIG.grain}
              grainIntensity={LIGHT_TUNNEL_CONFIG.grainIntensity}
              opacity={LIGHT_TUNNEL_CONFIG.opacity}
              mouseInteraction={LIGHT_TUNNEL_CONFIG.mouseInteraction}
              mouseStrength={LIGHT_TUNNEL_CONFIG.mouseStrength}
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

        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          <h1 className="text-center leading-[0.96] tracking-tight">
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

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <FolderFloat
            items={FOLDER_FLOAT_ITEMS}
            label={FOLDER_FLOAT_LABEL}
            sublabel={FOLDER_FLOAT_SUBLABEL}
            trigger="hover"
            closeOnSelect
            physics
            drift={FOLDER_FLOAT_CONFIG.drift}
            onSelect={handleFolderSelect}
            folderColor={FOLDER_FLOAT_CONFIG.folderColor}
            frontColor={FOLDER_FLOAT_CONFIG.frontColor}
            paperColor={FOLDER_FLOAT_CONFIG.paperColor}
            itemColor={FOLDER_FLOAT_CONFIG.itemColor}
            itemTextColor={FOLDER_FLOAT_CONFIG.itemTextColor}
            labelColor={FOLDER_FLOAT_CONFIG.labelColor}
            width={FOLDER_FLOAT_CONFIG.width}
            height={FOLDER_FLOAT_CONFIG.height}
            radius={FOLDER_FLOAT_CONFIG.radius}
            spread={FOLDER_FLOAT_CONFIG.spread}
            lift={FOLDER_FLOAT_CONFIG.lift}
            tilt={FOLDER_FLOAT_CONFIG.tilt}
            flapAngle={FOLDER_FLOAT_CONFIG.flapAngle}
            restAngle={FOLDER_FLOAT_CONFIG.restAngle}
            openDuration={FOLDER_FLOAT_CONFIG.openDuration}
            stagger={FOLDER_FLOAT_CONFIG.stagger}
            bounce={FOLDER_FLOAT_CONFIG.bounce}
          />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 space-y-24 mt-12 sm:mt-20">
        <section ref={toolsSectionRef} id="tools-section" className="space-y-12" data-animate>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div
              className={`sticky top-0 z-40 py-4 bg-[#020202]/80 backdrop-blur-xl border-b border-white/[0.05] -mx-6 px-6 transition-all duration-500 ${
                tabNavVisible
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-3 pointer-events-none"
              }`}
            >
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

        <div className="flex items-center gap-8 py-12" data-animate>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600">
            Featured Collections
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <section id="palettes-section" className="pb-24" data-animate>
          <PaletteShowcase />
        </section>
      </div>
    </div>
  );
}

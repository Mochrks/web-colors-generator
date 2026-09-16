"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type ColorFormat,
  type ColorData,
  generateShades,
  formatColor,
  copyToClipboard,
  getTextColor,
} from "@/hooks/color-main";
import {
  christmasColors,
  coffeeColors,
  coldColors,
  creamColors,
  cyberpunkColors,
  galaxyColors,
  goldColors,
  halloweenColors,
  initialTailwindColors,
  kidsColors,
  neonColors,
  pastelColors,
  rainbowColors,
  ramadhanColors,
  retroColors,
  seaColors,
  skyColors,
  spaceXColors,
  summerColors,
  sunsetColors,
  vintageColors,
  warmColors,
  weddingColors,
} from "@/utils/color";

interface PaletteSection {
  title: string;
  colors: Record<string, string>;
}

const allPalettes: PaletteSection[] = [
  { title: "Tailwind CSS", colors: initialTailwindColors },
  { title: "Pastel", colors: pastelColors },
  { title: "Retro", colors: retroColors },
  { title: "Vintage", colors: vintageColors },
  { title: "Neon", colors: neonColors },
  { title: "Gold & Metallic", colors: goldColors },
  { title: "Warm", colors: warmColors },
  { title: "Cold", colors: coldColors },
  { title: "Summer", colors: summerColors },
  { title: "Sunset", colors: sunsetColors },
  { title: "Sky", colors: skyColors },
  { title: "Sea & Ocean", colors: seaColors },
  { title: "Coffee", colors: coffeeColors },
  { title: "Cream", colors: creamColors },
  { title: "Kids", colors: kidsColors },
  { title: "Rainbow", colors: rainbowColors },
  { title: "Space", colors: spaceXColors },
  { title: "Galaxy", colors: galaxyColors },
  { title: "Cyberpunk", colors: cyberpunkColors },
  { title: "Wedding", colors: weddingColors },
  { title: "Halloween", colors: halloweenColors },
  { title: "Christmas", colors: christmasColors },
  { title: "Ramadhan", colors: ramadhanColors },
];

function PaletteRow({ palette, format }: { palette: PaletteSection; format: ColorFormat }) {
  const [expandedColor, setExpandedColor] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (color: ColorData, key: string) => {
    await copyToClipboard(formatColor(color, format));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <Card className="apple-card overflow-hidden bg-white dark:bg-neutral-900 border-none">
      <CardContent className="p-6">
        {/* Palette Header */}
        <div className="flex items-center gap-4 mb-6">
          {/* Mini swatch dots — first 6 colors of the palette */}
          <div className="flex items-center gap-1 shrink-0">
            {Object.values(palette.colors)
              .slice(0, 6)
              .map((hex, i) => (
                <span
                  key={i}
                  className="block rounded-full border border-white/10"
                  style={{
                    backgroundColor: hex,
                    width: i === 0 ? 18 : 12,
                    height: i === 0 ? 18 : 12,
                    marginLeft: i === 0 ? 0 : -4,
                    zIndex: 6 - i,
                    position: "relative",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                />
              ))}
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
              {palette.title}
            </h3>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
              {Object.keys(palette.colors).length} Essential Colors
            </p>
          </div>
        </div>

        {/* All colors in this palette */}
        <div className="space-y-4">
          {Object.entries(palette.colors).map(([name, hex]) => {
            const shades = generateShades(hex, 11);
            const isExpanded = expandedColor === name;

            return (
              <div key={name} className="group/row">
                {/* Color Row: Name + Swatch + Shade Strip */}
                <div className="flex items-center gap-4">
                  {/* Color swatch + name */}
                  <div
                    className="flex items-center gap-3 w-40 sm:w-52 shrink-0 cursor-pointer"
                    onClick={() => setExpandedColor(isExpanded ? null : name)}
                  >
                    <div
                      className="w-8 h-8 rounded-xl shadow-sm shrink-0 border border-neutral-200/50 dark:border-neutral-800/50 transition-transform duration-500 group-hover/row:scale-105"
                      style={{ backgroundColor: hex }}
                    />
                    <div className="min-w-0">
                      <span className="text-[13px] font-semibold capitalize block truncate text-neutral-800 dark:text-neutral-200">
                        {name.replace(/_/g, " ")}
                      </span>
                      <code className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">
                        {hex}
                      </code>
                    </div>
                  </div>

                  {/* Shade Strip — full width */}
                  <div className="flex-1 flex h-8 rounded-xl overflow-hidden border border-neutral-200/30 dark:border-neutral-800/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    {shades.map((shade, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="flex-1 cursor-pointer relative group/shade transition-all hover:flex-[2.5] duration-500"
                              style={{ backgroundColor: shade.hex }}
                              onClick={() => handleCopy(shade, `${name}-${idx}`)}
                            >
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/shade:opacity-100 transition-opacity">
                                {copiedKey === `${name}-${idx}` ? (
                                  <Check
                                    className="h-3 w-3"
                                    style={{ color: getTextColor(shade.hex) }}
                                  />
                                ) : (
                                  <Copy
                                    className="h-3 w-3"
                                    style={{ color: getTextColor(shade.hex) }}
                                  />
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="font-mono text-[11px] font-bold">
                              {formatColor(shade, format)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>

                  {/* Expand toggle */}
                  <button
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 shrink-0"
                    onClick={() => setExpandedColor(isExpanded ? null : name)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Expanded detail grid */}
                {isExpanded && (
                  <div className="mt-4 ml-0 sm:ml-52 grid grid-cols-11 gap-2 animate-fade-in">
                    {shades.map((shade, idx) => (
                      <div
                        key={idx}
                        className="text-center cursor-pointer group/detail"
                        onClick={() => handleCopy(shade, `${name}-detail-${idx}`)}
                      >
                        <div
                          className="w-full aspect-square rounded-lg shadow-sm border border-neutral-200/50 dark:border-neutral-800/50 group-hover/detail:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: shade.hex }}
                        />
                        <code className="text-[8px] font-bold text-neutral-400 mt-1.5 block truncate leading-tight uppercase">
                          {copiedKey === `${name}-detail-${idx}` ? "✓" : shade.hex}
                        </code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaletteShowcase() {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [showAll, setShowAll] = useState(false);

  const visiblePalettes = showAll ? allPalettes : allPalettes.slice(0, 6);

  return (
    <div className="space-y-12" id="palette-showcase">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Curated Collections
          </h2>
          <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
            {allPalettes.length} professionally curated sets with dynamic shade generation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Format
          </span>
          <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
            <SelectTrigger
              className="w-[120px] rounded-2xl h-10 text-xs font-semibold bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              id="palette-format-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-800">
              <SelectItem value="hex">HEX</SelectItem>
              <SelectItem value="rgb">RGB</SelectItem>
              <SelectItem value="rgba">RGBA</SelectItem>
              <SelectItem value="hsl">HSL</SelectItem>
              <SelectItem value="hsla">HSLA</SelectItem>
              <SelectItem value="cmyk">CMYK</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Palette Rows */}
      <div className="space-y-6">
        {visiblePalettes.map((palette) => (
          <PaletteRow key={palette.title} palette={palette} format={format} />
        ))}
      </div>

      {/* Show More / Less */}
      {allPalettes.length > 6 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="rounded-2xl px-10 gap-2.5 h-12 text-[13px] font-bold border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all shadow-sm"
            id="show-more-palettes-btn"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Fewer Collections
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Explore All {allPalettes.length} Collections
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

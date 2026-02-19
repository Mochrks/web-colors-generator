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
  emoji: string;
  colors: Record<string, string>;
}

const allPalettes: PaletteSection[] = [
  { title: "Tailwind CSS", emoji: "🎯", colors: initialTailwindColors },
  { title: "Pastel", emoji: "🌸", colors: pastelColors },
  { title: "Retro", emoji: "📻", colors: retroColors },
  { title: "Vintage", emoji: "🏛️", colors: vintageColors },
  { title: "Neon", emoji: "💡", colors: neonColors },
  { title: "Gold & Metallic", emoji: "✨", colors: goldColors },
  { title: "Warm", emoji: "🔥", colors: warmColors },
  { title: "Cold", emoji: "❄️", colors: coldColors },
  { title: "Summer", emoji: "☀️", colors: summerColors },
  { title: "Sunset", emoji: "🌅", colors: sunsetColors },
  { title: "Sky", emoji: "🌤️", colors: skyColors },
  { title: "Sea & Ocean", emoji: "🌊", colors: seaColors },
  { title: "Coffee", emoji: "☕", colors: coffeeColors },
  { title: "Cream", emoji: "🍦", colors: creamColors },
  { title: "Kids", emoji: "🧸", colors: kidsColors },
  { title: "Rainbow", emoji: "🌈", colors: rainbowColors },
  { title: "Space", emoji: "🚀", colors: spaceXColors },
  { title: "Galaxy", emoji: "🌌", colors: galaxyColors },
  { title: "Cyberpunk", emoji: "🤖", colors: cyberpunkColors },
  { title: "Wedding", emoji: "💒", colors: weddingColors },
  { title: "Halloween", emoji: "🎃", colors: halloweenColors },
  { title: "Christmas", emoji: "🎄", colors: christmasColors },
  { title: "Ramadhan", emoji: "🌙", colors: ramadhanColors },
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
    <Card className="glass-card overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardContent className="p-4 sm:p-5">
        {/* Palette Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{palette.emoji}</span>
          <h3 className="text-base sm:text-lg font-bold">{palette.title}</h3>
          <span className="text-[10px] font-medium text-muted-foreground ml-auto px-2 py-0.5 rounded-full bg-muted/60">
            {Object.keys(palette.colors).length} colors
          </span>
        </div>

        {/* All colors in this palette */}
        <div className="space-y-3">
          {Object.entries(palette.colors).map(([name, hex]) => {
            const shades = generateShades(hex, 11);
            const isExpanded = expandedColor === name;

            return (
              <div key={name}>
                {/* Color Row: Name + Swatch + Shade Strip */}
                <div className="flex items-center gap-3">
                  {/* Color swatch + name */}
                  <div
                    className="flex items-center gap-2 w-36 sm:w-44 shrink-0 cursor-pointer group/name"
                    onClick={() => setExpandedColor(isExpanded ? null : name)}
                  >
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-sm shrink-0 color-swatch ring-1 ring-black/5 dark:ring-white/10"
                      style={{ backgroundColor: hex }}
                    />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-semibold capitalize block truncate leading-tight">
                        {name.replace(/_/g, " ")}
                      </span>
                      <code className="text-[9px] sm:text-[10px] text-muted-foreground">{hex}</code>
                    </div>
                  </div>

                  {/* Shade Strip — full width */}
                  <div className="flex-1 flex h-8 sm:h-9 rounded-lg overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                    {shades.map((shade, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="flex-1 cursor-pointer relative group/shade transition-all hover:flex-[2] duration-200"
                              style={{ backgroundColor: shade.hex }}
                              onClick={() => handleCopy(shade, `${name}-${idx}`)}
                            >
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/shade:opacity-100 transition-opacity">
                                {copiedKey === `${name}-${idx}` ? (
                                  <Check
                                    className="h-3 w-3"
                                    style={{
                                      color: getTextColor(shade.hex),
                                    }}
                                  />
                                ) : (
                                  <Copy
                                    className="h-2.5 w-2.5"
                                    style={{
                                      color: getTextColor(shade.hex),
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <p className="font-mono">{formatColor(shade, format)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>

                  {/* Expand toggle */}
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg shrink-0"
                    onClick={() => setExpandedColor(isExpanded ? null : name)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Expanded detail grid */}
                {isExpanded && (
                  <div className="mt-2 ml-0 sm:ml-[calc(11rem)] grid grid-cols-11 gap-1.5 animate-scale-in">
                    {shades.map((shade, idx) => (
                      <div
                        key={idx}
                        className="text-center cursor-pointer group/detail"
                        onClick={() => handleCopy(shade, `${name}-detail-${idx}`)}
                      >
                        <div
                          className="w-full aspect-square rounded-md shadow-sm color-swatch ring-1 ring-black/5 dark:ring-white/5"
                          style={{ backgroundColor: shade.hex }}
                        />
                        <code className="text-[7px] sm:text-[8px] text-muted-foreground mt-0.5 block truncate leading-tight">
                          {copiedKey === `${name}-detail-${idx}`
                            ? "✓ Copied"
                            : formatColor(shade, format)}
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
    <div className="space-y-6" id="palette-showcase">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="gradient-text">Color Palettes</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {allPalettes.length} curated palettes with 11 shades each • Click any shade to copy
          </p>
        </div>
        <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
          <SelectTrigger className="w-[130px] rounded-xl" id="palette-format-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hex">HEX</SelectItem>
            <SelectItem value="rgb">RGB</SelectItem>
            <SelectItem value="rgba">RGBA</SelectItem>
            <SelectItem value="hsl">HSL</SelectItem>
            <SelectItem value="hsla">HSLA</SelectItem>
            <SelectItem value="cmyk">CMYK</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Palette Rows — one per row, full width */}
      <div className="space-y-4">
        {visiblePalettes.map((palette) => (
          <PaletteRow key={palette.title} palette={palette} format={format} />
        ))}
      </div>

      {/* Show More / Less */}
      {allPalettes.length > 6 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="rounded-xl px-8 gap-2 h-11 text-sm"
            id="show-more-palettes-btn"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show All {allPalettes.length} Palettes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Sparkles, RotateCw } from "lucide-react";
import {
  type ColorData,
  type ColorFormat,
  getComplementary,
  getAnalogous,
  getTriadic,
  getTetradic,
  getSplitComplementary,
  formatColor,
  copyToClipboard,
  generateRandomColor,
  getTextColor,
  isValidHex,
} from "@/hooks/color-main";

type HarmonyType = "complementary" | "analogous" | "triadic" | "tetradic" | "split-complementary";

const harmonyDescriptions: Record<HarmonyType, string> = {
  complementary: "Two colors opposite on the color wheel for maximum contrast",
  analogous: "Colors adjacent on the wheel for harmonious, natural palettes",
  triadic: "Three colors evenly spaced (120°) for vibrant, balanced schemes",
  tetradic: "Four colors forming a rectangle for rich, diverse palettes",
  "split-complementary": "A base color and two adjacent to its complement",
};

export default function ColorHarmony() {
  const [baseHex, setBaseHex] = useState("#7c3aed");
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("analogous");
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const harmonyColors = useMemo((): ColorData[] => {
    const hex = isValidHex(baseHex) ? baseHex : "#7c3aed";
    switch (harmonyType) {
      case "complementary":
        return getComplementary(hex);
      case "analogous":
        return getAnalogous(hex);
      case "triadic":
        return getTriadic(hex);
      case "tetradic":
        return getTetradic(hex);
      case "split-complementary":
        return getSplitComplementary(hex);
    }
  }, [baseHex, harmonyType]);

  const handleCopy = async (color: ColorData, idx: number) => {
    await copyToClipboard(formatColor(color, format));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleRandomize = () => {
    setBaseHex(generateRandomColor());
  };

  return (
    <Card className="glass-card overflow-hidden animate-slide-up" id="color-harmony">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-pink-500" />
          Color Harmony Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-10 h-10 rounded-xl shadow-md shrink-0 border border-white/20"
              style={{ backgroundColor: isValidHex(baseHex) ? baseHex : "#7c3aed" }}
            />
            <Input
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value)}
              placeholder="#7c3aed"
              className="font-mono rounded-xl"
              id="harmony-hex-input"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleRandomize}
              className="rounded-xl shrink-0"
              id="harmony-random-btn"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <Select value={harmonyType} onValueChange={(v: HarmonyType) => setHarmonyType(v)}>
            <SelectTrigger className="w-full sm:w-[200px] rounded-xl" id="harmony-type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complementary">Complementary</SelectItem>
              <SelectItem value="analogous">Analogous</SelectItem>
              <SelectItem value="triadic">Triadic</SelectItem>
              <SelectItem value="tetradic">Tetradic</SelectItem>
              <SelectItem value="split-complementary">Split Complementary</SelectItem>
            </SelectContent>
          </Select>
          <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
            <SelectTrigger className="w-full sm:w-[120px] rounded-xl" id="harmony-format-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hex">HEX</SelectItem>
              <SelectItem value="rgb">RGB</SelectItem>
              <SelectItem value="rgba">RGBA</SelectItem>
              <SelectItem value="hsl">HSL</SelectItem>
              <SelectItem value="cmyk">CMYK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-muted-foreground">{harmonyDescriptions[harmonyType]}</p>

        {/* Color Display */}
        <div className="flex gap-2 h-32 rounded-xl overflow-hidden shadow-xl">
          {harmonyColors.map((color, idx) => (
            <div
              key={idx}
              className="flex-1 relative group cursor-pointer transition-all duration-300 hover:flex-[2]"
              style={{ backgroundColor: color.hex }}
              onClick={() => handleCopy(color, idx)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className="px-2 py-1 rounded-lg backdrop-blur-sm text-xs font-mono"
                  style={{
                    color: getTextColor(color.hex),
                    backgroundColor:
                      getTextColor(color.hex) === "#ffffff"
                        ? "rgba(0,0,0,0.4)"
                        : "rgba(255,255,255,0.4)",
                  }}
                >
                  {copiedIdx === idx ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> {formatColor(color, format)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Color Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {harmonyColors.map((color, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer group"
              onClick={() => handleCopy(color, idx)}
            >
              <div
                className="w-8 h-8 rounded-lg shrink-0 shadow-sm color-swatch"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0 flex-1">
                <code className="text-[10px] block truncate">{formatColor(color, format)}</code>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

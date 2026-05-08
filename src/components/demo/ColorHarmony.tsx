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
  analogous: "Colors adjacent on the wheel for harmonious schemes",
  triadic: "Three colors evenly spaced (120°) for balanced palettes",
  tetradic: "Four colors forming a rectangle for diverse schemes",
  "split-complementary": "A base color and two adjacent to its complement",
};

export default function ColorHarmony() {
  const [baseHex, setBaseHex] = useState("#000000");
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("analogous");
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const harmonyColors = useMemo((): ColorData[] => {
    const hex = isValidHex(baseHex) ? baseHex : "#000000";
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
    <Card
      className="apple-card overflow-hidden bg-white dark:bg-neutral-900 border-none animate-fade-in"
      id="color-harmony"
    >
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
          <Sparkles className="h-4 w-4 text-neutral-500" />
          Harmony Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-12 h-12 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 shrink-0"
              style={{ backgroundColor: isValidHex(baseHex) ? baseHex : "#000000" }}
            />
            <Input
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value)}
              placeholder="#000000"
              className="font-mono rounded-2xl h-12 text-[15px] bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
              id="harmony-hex-input"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleRandomize}
              className="rounded-2xl h-12 w-12 shrink-0 border-neutral-200 dark:border-neutral-800"
              id="harmony-random-btn"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-3">
            <Select value={harmonyType} onValueChange={(v: HarmonyType) => setHarmonyType(v)}>
              <SelectTrigger
                className="w-full lg:w-[180px] rounded-2xl h-12 font-semibold text-xs border-neutral-200 dark:border-neutral-800"
                id="harmony-type-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-800">
                <SelectItem value="complementary">Complementary</SelectItem>
                <SelectItem value="analogous">Analogous</SelectItem>
                <SelectItem value="triadic">Triadic</SelectItem>
                <SelectItem value="tetradic">Tetradic</SelectItem>
                <SelectItem value="split-complementary">Split Complementary</SelectItem>
              </SelectContent>
            </Select>
            <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
              <SelectTrigger
                className="w-full lg:w-[110px] rounded-2xl h-12 font-semibold text-xs border-neutral-200 dark:border-neutral-800"
                id="harmony-format-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-800">
                <SelectItem value="hex">HEX</SelectItem>
                <SelectItem value="rgb">RGB</SelectItem>
                <SelectItem value="rgba">RGBA</SelectItem>
                <SelectItem value="hsl">HSL</SelectItem>
                <SelectItem value="cmyk">CMYK</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
          {harmonyDescriptions[harmonyType]}
        </p>

        {/* Color Display */}
        <div className="flex h-40 rounded-3xl overflow-hidden shadow-sm border border-neutral-200/50 dark:border-neutral-800/50">
          {harmonyColors.map((color, idx) => (
            <div
              key={idx}
              className="flex-1 relative group cursor-pointer transition-all duration-500 hover:flex-[2.5]"
              style={{ backgroundColor: color.hex }}
              onClick={() => handleCopy(color, idx)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className="px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20 text-[11px] font-bold tracking-tight shadow-sm"
                  style={{
                    color: getTextColor(color.hex),
                    backgroundColor:
                      getTextColor(color.hex) === "#ffffff"
                        ? "rgba(0,0,0,0.2)"
                        : "rgba(255,255,255,0.2)",
                  }}
                >
                  {copiedIdx === idx ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Copy className="h-3 w-3" /> {formatColor(color, format)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Color Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {harmonyColors.map((color, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer group"
              onClick={() => handleCopy(color, idx)}
            >
              <div
                className="w-10 h-10 rounded-xl shrink-0 shadow-sm border border-neutral-200/50 dark:border-neutral-800/50 transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0 flex-1">
                <code className="text-[12px] font-bold text-neutral-600 dark:text-neutral-400 block truncate uppercase tracking-tighter">
                  {formatColor(color, format)}
                </code>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

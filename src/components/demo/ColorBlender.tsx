import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy, Check, RotateCw, Blend } from "lucide-react";
import {
  type ColorFormat,
  blendColors,
  formatColor,
  copyToClipboard,
  generateRandomColor,
  isValidHex,
  getTextColor,
} from "@/hooks/color-main";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BLEND_DEFAULT_COLOR1,
  BLEND_DEFAULT_COLOR2,
  BLEND_STEPS_MIN,
  BLEND_STEPS_MAX,
  COPIED_RESET_MS,
  COLOR_FORMAT_OPTIONS,
} from "@/constants";

export default function ColorBlender() {
  const [color1, setColor1] = useState(BLEND_DEFAULT_COLOR1);
  const [color2, setColor2] = useState(BLEND_DEFAULT_COLOR2);
  const [steps, setSteps] = useState(5);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const blended = useMemo(() => {
    const hex1 = isValidHex(color1) ? color1 : "#000000";
    const hex2 = isValidHex(color2) ? color2 : "#ffffff";
    return blendColors(hex1, hex2, steps);
  }, [color1, color2, steps]);

  const handleCopy = async (idx: number) => {
    await copyToClipboard(formatColor(blended[idx], format));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), COPIED_RESET_MS);
  };

  const randomize = () => {
    setColor1(generateRandomColor());
    setColor2(generateRandomColor());
  };

  return (
    <Card
      className="apple-card overflow-hidden bg-white dark:bg-neutral-900 border-none animate-fade-in"
      id="color-blender"
    >
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
          <Blend className="h-4 w-4 text-neutral-500" />
          Color Blender
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Color 1
            </Label>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="color"
                value={isValidHex(color1) ? color1 : "#000000"}
                onChange={(e) => setColor1(e.target.value)}
                className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer shrink-0 bg-transparent"
              />
              <Input
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="font-mono rounded-2xl h-10 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
                id="blend-color1-input"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={randomize}
            className="rounded-2xl h-10 w-10 mb-0.5 border-neutral-200 dark:border-neutral-800"
            id="blend-random-btn"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Color 2
            </Label>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="color"
                value={isValidHex(color2) ? color2 : "#ffffff"}
                onChange={(e) => setColor2(e.target.value)}
                className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer shrink-0 bg-transparent"
              />
              <Input
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="font-mono rounded-2xl h-10 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
                id="blend-color2-input"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Steps
            </Label>
            <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
              {steps}
            </span>
          </div>
          <Slider
            min={BLEND_STEPS_MIN}
            max={BLEND_STEPS_MAX}
            step={1}
            value={[steps]}
            onValueChange={([v]) => setSteps(v)}
          />
        </div>

        <div className="flex justify-end">
          <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
            <SelectTrigger
              className="w-[130px] rounded-2xl h-10 font-semibold text-xs border-neutral-200 dark:border-neutral-800"
              id="blend-format-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-800">
              {COLOR_FORMAT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex h-20 rounded-2xl overflow-hidden shadow-sm border border-neutral-200/50 dark:border-neutral-800/50">
          {blended.map((color, idx) => (
            <div
              key={idx}
              className="flex-1 relative group cursor-pointer transition-all hover:flex-[2] duration-300"
              style={{ backgroundColor: color.hex }}
              onClick={() => handleCopy(idx)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-md backdrop-blur-sm"
                  style={{
                    color: getTextColor(color.hex),
                    backgroundColor:
                      getTextColor(color.hex) === "#ffffff"
                        ? "rgba(0,0,0,0.4)"
                        : "rgba(255,255,255,0.4)",
                  }}
                >
                  {copiedIdx === idx ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
          {blended.map((color, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
              onClick={() => handleCopy(idx)}
            >
              <div
                className="w-5 h-5 rounded-lg shrink-0 border border-neutral-200/50 dark:border-neutral-800/50"
                style={{ backgroundColor: color.hex }}
              />
              <code className="text-[10px] truncate text-neutral-600 dark:text-neutral-400">
                {formatColor(color, format)}
              </code>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

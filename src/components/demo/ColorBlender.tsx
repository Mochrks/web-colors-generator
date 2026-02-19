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

export default function ColorBlender() {
  const [color1, setColor1] = useState("#7c3aed");
  const [color2, setColor2] = useState("#f97316");
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
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const randomize = () => {
    setColor1(generateRandomColor());
    setColor2(generateRandomColor());
  };

  return (
    <Card className="glass-card overflow-hidden animate-slide-up" id="color-blender">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Blend className="h-5 w-5 text-cyan-500" />
          Color Blender
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Colors */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Color 1</Label>
            <div className="flex gap-2 items-center mt-1">
              <input
                type="color"
                value={isValidHex(color1) ? color1 : "#000000"}
                onChange={(e) => setColor1(e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer"
              />
              <Input
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="font-mono rounded-xl"
                id="blend-color1-input"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={randomize}
            className="rounded-xl mb-0.5"
            id="blend-random-btn"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Color 2</Label>
            <div className="flex gap-2 items-center mt-1">
              <input
                type="color"
                value={isValidHex(color2) ? color2 : "#ffffff"}
                onChange={(e) => setColor2(e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer"
              />
              <Input
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="font-mono rounded-xl"
                id="blend-color2-input"
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Steps</Label>
            <span className="text-xs font-mono text-muted-foreground">{steps}</span>
          </div>
          <Slider min={2} max={20} step={1} value={[steps]} onValueChange={([v]) => setSteps(v)} />
        </div>

        <div className="flex justify-end">
          <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
            <SelectTrigger className="w-[120px] rounded-xl" id="blend-format-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hex">HEX</SelectItem>
              <SelectItem value="rgb">RGB</SelectItem>
              <SelectItem value="hsl">HSL</SelectItem>
              <SelectItem value="cmyk">CMYK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blend Result */}
        <div className="flex h-20 rounded-xl overflow-hidden shadow-xl">
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

        {/* Color list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto">
          {blended.map((color, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/30 hover:bg-muted/60 cursor-pointer transition-colors"
              onClick={() => handleCopy(idx)}
            >
              <div className="w-5 h-5 rounded-md shrink-0" style={{ backgroundColor: color.hex }} />
              <code className="text-[9px] truncate">{formatColor(color, format)}</code>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

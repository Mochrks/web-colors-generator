import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Plus, X, Paintbrush, RotateCw } from "lucide-react";
import {
  type GradientType,
  type GradientDirection,
  generateGradientCSS,
  generateRandomColor,
  copyToClipboard,
  isValidHex,
} from "@/hooks/color-main";

const directions: { value: GradientDirection; label: string }[] = [
  { value: "to right", label: "→ Right" },
  { value: "to left", label: "← Left" },
  { value: "to bottom", label: "↓ Down" },
  { value: "to top", label: "↑ Up" },
  { value: "to bottom right", label: "↘ Bottom Right" },
  { value: "to top right", label: "↗ Top Right" },
  { value: "45deg", label: "45°" },
  { value: "90deg", label: "90°" },
  { value: "135deg", label: "135°" },
  { value: "180deg", label: "180°" },
];

export default function GradientGenerator() {
  const [colors, setColors] = useState<string[]>(["#7c3aed", "#ec4899", "#f97316"]);
  const [gradType, setGradType] = useState<GradientType>("linear");
  const [direction, setDirection] = useState<GradientDirection>("to right");
  const [copied, setCopied] = useState(false);

  const gradientCSS = useMemo(() => {
    const validColors = colors.map((c) => (isValidHex(c) ? c : "#000000"));
    return generateGradientCSS(validColors, gradType, direction);
  }, [colors, gradType, direction]);

  const fullCSS = `background: ${gradientCSS};`;

  const handleCopy = async () => {
    await copyToClipboard(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addColor = () => {
    setColors([...colors, generateRandomColor()]);
  };

  const removeColor = (idx: number) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, i) => i !== idx));
  };

  const updateColor = (idx: number, val: string) => {
    const newColors = [...colors];
    newColors[idx] = val;
    setColors(newColors);
  };

  const randomize = () => {
    const count = 2 + Math.floor(Math.random() * 3);
    setColors(Array.from({ length: count }, () => generateRandomColor()));
  };

  return (
    <Card className="glass-card overflow-hidden animate-slide-up" id="gradient-generator">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Paintbrush className="h-5 w-5 text-orange-500" />
          Gradient Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gradient Preview */}
        <div
          className="w-full h-40 sm:h-52 rounded-xl shadow-xl transition-all duration-500"
          style={{ background: gradientCSS }}
          id="gradient-preview"
        />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={gradType} onValueChange={(v: GradientType) => setGradType(v)}>
            <SelectTrigger className="w-full sm:w-[140px] rounded-xl" id="grad-type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
              <SelectItem value="conic">Conic</SelectItem>
            </SelectContent>
          </Select>
          {gradType === "linear" && (
            <Select value={direction} onValueChange={(v: GradientDirection) => setDirection(v)}>
              <SelectTrigger className="w-full sm:w-[160px] rounded-xl" id="grad-direction-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {directions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" onClick={randomize} className="rounded-xl" id="grad-random-btn">
            <RotateCw className="h-4 w-4 mr-2" />
            Random
          </Button>
        </div>

        {/* Color Stops */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Color Stops</Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded-xl bg-muted/50">
                <input
                  type="color"
                  value={isValidHex(color) ? color : "#000000"}
                  onChange={(e) => updateColor(idx, e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                />
                <Input
                  value={color}
                  onChange={(e) => updateColor(idx, e.target.value)}
                  className="w-24 font-mono text-xs rounded-lg h-8"
                />
                {colors.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                    onClick={() => removeColor(idx)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-xl"
              onClick={addColor}
              id="add-color-stop-btn"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* CSS Output */}
        <div className="relative p-3 rounded-xl bg-muted/50 font-mono text-xs break-all">
          <code>{fullCSS}</code>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 rounded-lg"
            onClick={handleCopy}
            id="copy-gradient-css-btn"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

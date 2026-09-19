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
import { GRADIENT_DIRECTIONS, GRADIENT_DEFAULT_COLORS, COPIED_RESET_MS } from "@/constants";

export default function GradientGenerator() {
  const [colors, setColors] = useState<string[]>([...GRADIENT_DEFAULT_COLORS]);
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
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
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
    <Card
      className="apple-card overflow-hidden bg-white dark:bg-neutral-900 border-none animate-fade-in"
      id="gradient-generator"
    >
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
          <Paintbrush className="h-4 w-4 text-neutral-500" />
          Gradient Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8">
        <div
          className="w-full h-40 sm:h-52 rounded-2xl shadow-sm border border-neutral-200/50 dark:border-neutral-800/50 transition-all duration-500"
          style={{ background: gradientCSS }}
          id="gradient-preview"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={gradType} onValueChange={(v: GradientType) => setGradType(v)}>
            <SelectTrigger
              className="w-full sm:w-[140px] rounded-2xl h-10 border-neutral-200 dark:border-neutral-800 font-semibold text-xs"
              id="grad-type-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-800">
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
              <SelectItem value="conic">Conic</SelectItem>
            </SelectContent>
          </Select>
          {gradType === "linear" && (
            <Select value={direction} onValueChange={(v: GradientDirection) => setDirection(v)}>
              <SelectTrigger
                className="w-full sm:w-[160px] rounded-2xl h-10 border-neutral-200 dark:border-neutral-800 font-semibold text-xs"
                id="grad-direction-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-800">
                {GRADIENT_DIRECTIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            onClick={randomize}
            className="rounded-2xl h-10 border-neutral-200 dark:border-neutral-800 font-semibold text-xs"
            id="grad-random-btn"
          >
            <RotateCw className="h-3.5 w-3.5 mr-2" />
            Randomize
          </Button>
        </div>

        <div className="space-y-3">
          <Label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            Color Stops
          </Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50"
              >
                <input
                  type="color"
                  value={isValidHex(color) ? color : "#000000"}
                  onChange={(e) => updateColor(idx, e.target.value)}
                  className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer bg-transparent"
                />
                <Input
                  value={color}
                  onChange={(e) => updateColor(idx, e.target.value)}
                  className="w-24 font-mono text-xs rounded-xl h-8 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                />
                {colors.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-xl text-neutral-400 hover:text-red-500"
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
              className="h-[52px] w-[52px] rounded-2xl border-neutral-200 dark:border-neutral-800"
              onClick={addColor}
              id="add-color-stop-btn"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30 font-mono text-xs break-all">
          <code className="text-neutral-700 dark:text-neutral-300">{fullCSS}</code>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 rounded-xl"
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

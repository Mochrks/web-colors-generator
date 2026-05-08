import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check, RotateCw, Bookmark, Pipette, Palette } from "lucide-react";
import {
  type ColorData,
  type ColorFormat,
  colorDataFromHsl,
  colorDataFromRgba,
  parseColorString,
  formatColor,
  generateRandomColor,
  copyToClipboard,
  saveColor,
  addToHistory,
  getTextColor,
  generateShades,
} from "@/hooks/color-main";

interface ColorPickerConverterProps {
  onColorChange?: (color: ColorData) => void;
}

export default function ColorPickerConverter({ onColorChange }: ColorPickerConverterProps) {
  const [colorData, setColorData] = useState<ColorData>(() => colorDataFromHsl(0, 0, 10));
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [hexInput, setHexInput] = useState(colorData.hex);
  const [rgbInput, setRgbInput] = useState({
    r: String(colorData.rgb.r),
    g: String(colorData.rgb.g),
    b: String(colorData.rgb.b),
  });
  const [cmykInput, setCmykInput] = useState({
    c: String(colorData.cmyk.c),
    m: String(colorData.cmyk.m),
    y: String(colorData.cmyk.y),
    k: String(colorData.cmyk.k),
  });
  const [pasteInput, setPasteInput] = useState("");
  const [saved, setSaved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);

  const updateColor = useCallback(
    (newData: ColorData) => {
      setColorData(newData);
      setHexInput(newData.hex);
      setRgbInput({
        r: String(newData.rgb.r),
        g: String(newData.rgb.g),
        b: String(newData.rgb.b),
      });
      setCmykInput({
        c: String(newData.cmyk.c),
        m: String(newData.cmyk.m),
        y: String(newData.cmyk.y),
        k: String(newData.cmyk.k),
      });
      addToHistory(newData.hex);
      onColorChange?.(newData);
    },
    [onColorChange]
  );

  // Draw saturation/lightness picker
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    const gradH = ctx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, "#ffffff");
    gradH.addColorStop(1, `hsl(${colorData.hsl.h}, 100%, 50%)`);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, w, h);

    const gradV = ctx.createLinearGradient(0, 0, 0, h);
    gradV.addColorStop(0, "rgba(0,0,0,0)");
    gradV.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, w, h);
  }, [colorData.hsl.h]);

  // Draw hue strip
  useEffect(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    for (let i = 0; i <= 360; i += 30) {
      grad.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const handleCanvasInteraction = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const s = Math.round(x * 100);
      const v = Math.round((1 - y) * 100);
      const l = Math.round((v * (200 - s)) / 200);
      const sHsl = v === 0 ? 0 : Math.round(((v - l) / Math.min(l, 100 - l)) * 100) || 0;
      updateColor(colorDataFromHsl(colorData.hsl.h, Math.min(100, sHsl), l));
    },
    [colorData.hsl.h, updateColor]
  );

  const handleHueInteraction = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
      const canvas = hueCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const h = Math.round(x * 360);
      updateColor(colorDataFromHsl(h, colorData.hsl.s, colorData.hsl.l));
    },
    [colorData.hsl.s, colorData.hsl.l, updateColor]
  );

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsHueDragging(false);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleCanvasInteraction(e);
      if (isHueDragging) handleHueInteraction(e);
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, isHueDragging, handleCanvasInteraction, handleHueInteraction]);

  const handleCopy = async (format: ColorFormat) => {
    const text = formatColor(colorData, format);
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 1500);
    }
  };

  const handleRandomize = () => {
    const hex = generateRandomColor();
    const parsed = parseColorString(hex);
    if (parsed) updateColor(parsed);
  };

  const handleSave = () => {
    saveColor(colorData.hex);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const parsed = parseColorString(val);
    if (parsed) updateColor(parsed);
  };

  const handleRgbChange = (channel: "r" | "g" | "b", val: string) => {
    const newRgb = { ...rgbInput, [channel]: val };
    setRgbInput(newRgb);
    const r = parseInt(newRgb.r) || 0;
    const g = parseInt(newRgb.g) || 0;
    const b = parseInt(newRgb.b) || 0;
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      updateColor(colorDataFromRgba(r, g, b, 1));
    }
  };

  const handleCmykChange = (channel: "c" | "m" | "y" | "k", val: string) => {
    const newCmyk = { ...cmykInput, [channel]: val };
    setCmykInput(newCmyk);
    const c = parseInt(newCmyk.c) || 0;
    const m = parseInt(newCmyk.m) || 0;
    const y = parseInt(newCmyk.y) || 0;
    const k = parseInt(newCmyk.k) || 0;
    if (c >= 0 && c <= 100 && m >= 0 && m <= 100 && y >= 0 && y <= 100 && k >= 0 && k <= 100) {
      const parsed = parseColorString(`cmyk(${c}%, ${m}%, ${y}%, ${k}%)`);
      if (parsed) updateColor(parsed);
    }
  };

  const handlePaste = () => {
    const parsed = parseColorString(pasteInput);
    if (parsed) {
      updateColor(parsed);
      setPasteInput("");
    }
  };

  const shades = generateShades(colorData.hex, 10);

  const formats: { format: ColorFormat; label: string }[] = [
    { format: "hex", label: "HEX" },
    { format: "rgb", label: "RGB" },
    { format: "rgba", label: "RGBA" },
    { format: "hsl", label: "HSL" },
    { format: "hsla", label: "HSLA" },
    { format: "cmyk", label: "CMYK" },
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="color-picker">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ============ LEFT: Visual Picker ============ */}
        <Card className="apple-card overflow-hidden lg:col-span-1 bg-white dark:bg-neutral-900 border-none">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
              <Pipette className="h-4 w-4 text-neutral-500" />
              Visual Picker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-8">
            {/* Color Canvas */}
            <div className="relative rounded-2xl overflow-hidden cursor-crosshair shadow-sm border border-neutral-200/50 dark:border-neutral-800/50">
              <canvas
                ref={canvasRef}
                width={400}
                height={220}
                className="w-full h-[200px]"
                onClick={(e) => handleCanvasInteraction(e)}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  handleCanvasInteraction(e);
                }}
                id="color-canvas"
              />
            </div>

            {/* Hue Slider */}
            <div className="relative rounded-full overflow-hidden cursor-pointer border border-neutral-200/50 dark:border-neutral-800/50">
              <canvas
                ref={hueCanvasRef}
                width={400}
                height={16}
                className="w-full h-4"
                onClick={(e) => handleHueInteraction(e)}
                onMouseDown={(e) => {
                  setIsHueDragging(true);
                  handleHueInteraction(e);
                }}
                id="hue-slider"
              />
            </div>

            {/* HSL Sliders */}
            <div className="space-y-4">
              {[
                { label: "Hue", value: colorData.hsl.h, max: 360, suffix: "°", key: "h" as const },
                {
                  label: "Saturation",
                  value: colorData.hsl.s,
                  max: 100,
                  suffix: "%",
                  key: "s" as const,
                },
                {
                  label: "Lightness",
                  value: colorData.hsl.l,
                  max: 100,
                  suffix: "%",
                  key: "l" as const,
                },
              ].map(({ label, value, max, suffix, key }) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      {label}
                    </Label>
                    <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                      {value}
                      {suffix}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={max}
                    step={1}
                    value={[value]}
                    onValueChange={([v]) => {
                      const h = key === "h" ? v : colorData.hsl.h;
                      const s = key === "s" ? v : colorData.hsl.s;
                      const l = key === "l" ? v : colorData.hsl.l;
                      updateColor(colorDataFromHsl(h, s, l));
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleRandomize}
                variant="outline"
                className="flex-1 rounded-2xl h-10 text-[13px] font-medium border-neutral-200 dark:border-neutral-800"
                id="randomize-btn"
              >
                <RotateCw className="h-3.5 w-3.5 mr-2" />
                Randomize
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                className="flex-1 rounded-2xl h-10 text-[13px] font-medium border-neutral-200 dark:border-neutral-800"
                id="save-color-btn"
              >
                {saved ? (
                  <Check className="h-3.5 w-3.5 mr-2 text-green-500" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5 mr-2" />
                )}
                {saved ? "Saved" : "Save Color"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ============ MIDDLE: Color Values & Converter ============ */}
        <Card className="apple-card overflow-hidden lg:col-span-1 bg-white dark:bg-neutral-900 border-none">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
              Color Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-8">
            {/* Big Preview */}
            <div
              className="w-full h-32 rounded-2xl shadow-sm transition-all duration-500 flex items-end p-4 border border-neutral-200/50 dark:border-neutral-800/50"
              style={{ backgroundColor: colorData.hex }}
            >
              <span
                className="text-[15px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20 shadow-sm"
                style={{
                  color: getTextColor(colorData.hex),
                  backgroundColor:
                    getTextColor(colorData.hex) === "#ffffff"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.2)",
                }}
              >
                {colorData.hex.toUpperCase()}
              </span>
            </div>

            {/* All Formats with Copy */}
            <div className="space-y-2">
              {formats.map(({ format, label }) => (
                <TooltipProvider key={format}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group cursor-pointer"
                        onClick={() => handleCopy(format)}
                      >
                        <span className="text-[10px] font-black text-neutral-400 w-10 shrink-0 uppercase tracking-widest">
                          {label}
                        </span>
                        <code className="text-[13px] flex-1 truncate font-medium text-neutral-700 dark:text-neutral-300">
                          {formatColor(colorData, format)}
                        </code>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedFormat === format ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-neutral-400" />
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Copy {label}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {/* Generated Shades */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-neutral-400" />
                <span className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">
                  Shade Palette
                </span>
              </div>
              <div className="flex h-12 rounded-2xl overflow-hidden shadow-sm border border-neutral-200/50 dark:border-neutral-800/50">
                {shades.map((shade, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex-1 cursor-pointer relative group/shade transition-all hover:flex-[3] duration-500"
                          style={{ backgroundColor: shade.hex }}
                          onClick={() => handleCopy("hex")}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/shade:opacity-100 transition-opacity">
                            <Copy
                              className="h-3.5 w-3.5"
                              style={{ color: getTextColor(shade.hex) }}
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">{shade.hex}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============ RIGHT: Manual Input ============ */}
        <Card className="apple-card overflow-hidden lg:col-span-1 bg-white dark:bg-neutral-900 border-none">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
              Manual Input
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <Tabs defaultValue="hex" className="w-full">
              <TabsList className="grid grid-cols-4 w-full rounded-2xl bg-neutral-100 dark:bg-neutral-950 p-1 h-11 border border-neutral-200/50 dark:border-neutral-800/50">
                {["hex", "rgb", "cmyk", "paste"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-xl text-[11px] font-bold uppercase tracking-wider"
                  >
                    {tab === "paste" ? "Any" : tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="hex" className="mt-6 space-y-4">
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={colorData.hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="w-12 h-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 cursor-pointer shrink-0 bg-transparent"
                  />
                  <Input
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#000000"
                    className="font-mono rounded-2xl h-12 text-[15px] bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
                    id="hex-input"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 font-medium">
                  Enter a hex color code (e.g. #000, #F5F5F7)
                </p>
              </TabsContent>

              <TabsContent value="rgb" className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {(["r", "g", "b"] as const).map((ch) => (
                    <div key={ch} className="space-y-2">
                      <Label className="text-[10px] text-neutral-400 uppercase font-black tracking-widest pl-1">
                        {ch}
                      </Label>
                      <Input
                        value={rgbInput[ch]}
                        onChange={(e) => handleRgbChange(ch, e.target.value)}
                        type="number"
                        min={0}
                        max={255}
                        className="font-mono rounded-2xl h-12 text-[15px] bg-neutral-50 dark:bg-neutral-950"
                        id={`rgb-${ch}-input`}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="cmyk" className="mt-6 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {(["c", "m", "y", "k"] as const).map((ch) => (
                    <div key={ch} className="space-y-2">
                      <Label className="text-[10px] text-neutral-400 uppercase font-black tracking-widest pl-1">
                        {ch}
                      </Label>
                      <Input
                        value={cmykInput[ch]}
                        onChange={(e) => handleCmykChange(ch, e.target.value)}
                        type="number"
                        min={0}
                        max={100}
                        className="font-mono rounded-2xl h-12 text-[14px] bg-neutral-50 dark:bg-neutral-950"
                        id={`cmyk-${ch}-input`}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="paste" className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={pasteInput}
                    onChange={(e) => setPasteInput(e.target.value)}
                    placeholder="Paste color string..."
                    className="font-mono rounded-2xl h-12 text-[14px] bg-neutral-50 dark:bg-neutral-950"
                    id="paste-input"
                    onKeyDown={(e) => e.key === "Enter" && handlePaste()}
                  />
                  <Button
                    onClick={handlePaste}
                    className="rounded-2xl h-12 px-6 font-semibold"
                    id="paste-btn"
                  >
                    Parse
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest pl-1">
                    Examples
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["rgb(0,0,0)", "hsl(220,10%,98%)", "rgba(0,0,0,0.5)"].map((example) => (
                      <code
                        key={example}
                        className="text-[10px] px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer hover:bg-neutral-200 transition-colors border border-neutral-200/50 dark:border-neutral-800/50"
                        onClick={() => {
                          setPasteInput(example);
                          const parsed = parseColorString(example);
                          if (parsed) updateColor(parsed);
                        }}
                      >
                        {example}
                      </code>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

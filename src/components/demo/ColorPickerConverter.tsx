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
  const [colorData, setColorData] = useState<ColorData>(() => colorDataFromHsl(262, 67, 55));
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [hexInput, setHexInput] = useState(colorData.hex);
  const [rgbInput, setRgbInput] = useState({
    r: String(colorData.rgb.r),
    g: String(colorData.rgb.g),
    b: String(colorData.rgb.b),
  });
  const [alphaInput, setAlphaInput] = useState("1");
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
    const a = parseFloat(alphaInput) || 1;
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      updateColor(colorDataFromRgba(r, g, b, a));
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
    <div className="space-y-6 animate-slide-up" id="color-picker">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============ LEFT: Visual Picker ============ */}
        <Card className="glass-card overflow-hidden lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Pipette className="h-5 w-5 text-purple-500" />
              Color Picker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Color Canvas */}
            <div className="relative rounded-xl overflow-hidden cursor-crosshair shadow-lg ring-1 ring-black/5 dark:ring-white/5">
              <canvas
                ref={canvasRef}
                width={400}
                height={220}
                className="w-full h-[180px] sm:h-[220px]"
                onClick={(e) => handleCanvasInteraction(e)}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  handleCanvasInteraction(e);
                }}
                id="color-canvas"
              />
            </div>

            {/* Hue Slider */}
            <div className="relative rounded-lg overflow-hidden cursor-pointer shadow-sm ring-1 ring-black/5 dark:ring-white/5">
              <canvas
                ref={hueCanvasRef}
                width={400}
                height={20}
                className="w-full h-5"
                onClick={(e) => handleHueInteraction(e)}
                onMouseDown={(e) => {
                  setIsHueDragging(true);
                  handleHueInteraction(e);
                }}
                id="hue-slider"
              />
            </div>

            {/* HSL Sliders */}
            <div className="space-y-2.5">
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
                <div key={key} className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-[11px] font-medium text-muted-foreground">{label}</Label>
                    <span className="text-[11px] font-mono text-muted-foreground">
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
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label className="text-[11px] font-medium text-muted-foreground">Alpha</Label>
                  <span className="text-[11px] font-mono text-muted-foreground">{alphaInput}</span>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={[parseFloat(alphaInput)]}
                  onValueChange={([v]) => {
                    setAlphaInput(v.toFixed(2));
                    updateColor(
                      colorDataFromRgba(colorData.rgb.r, colorData.rgb.g, colorData.rgb.b, v)
                    );
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleRandomize}
                variant="outline"
                className="flex-1 rounded-xl h-9 text-xs"
                id="randomize-btn"
              >
                <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                Random
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                className="flex-1 rounded-xl h-9 text-xs"
                id="save-color-btn"
              >
                {saved ? (
                  <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                )}
                {saved ? "Saved!" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ============ MIDDLE: Color Values & Converter ============ */}
        <Card className="glass-card overflow-hidden lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Color Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Big Preview */}
            <div
              className="w-full h-24 rounded-xl shadow-xl transition-colors duration-300 flex items-end p-3 ring-1 ring-black/5 dark:ring-white/5"
              style={{ backgroundColor: colorData.hex }}
            >
              <span
                className="text-sm font-mono font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm"
                style={{
                  color: getTextColor(colorData.hex),
                  backgroundColor:
                    getTextColor(colorData.hex) === "#ffffff"
                      ? "rgba(0,0,0,0.35)"
                      : "rgba(255,255,255,0.35)",
                }}
              >
                {colorData.hex.toUpperCase()}
              </span>
            </div>

            {/* All Formats with Copy */}
            <div className="space-y-1.5">
              {formats.map(({ format, label }) => (
                <TooltipProvider key={format}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center gap-2 p-2 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors group cursor-pointer"
                        onClick={() => handleCopy(format)}
                      >
                        <span className="text-[10px] font-bold text-muted-foreground w-10 shrink-0 uppercase">
                          {label}
                        </span>
                        <code className="text-xs flex-1 truncate select-all">
                          {formatColor(colorData, format)}
                        </code>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedFormat === format ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Click to copy {label}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {/* Generated Shades */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-semibold">Auto Shades</span>
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {shades.length} shades • Click to copy
                </span>
              </div>
              {/* Big shade strip */}
              <div className="flex h-14 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                {shades.map((shade, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex-1 cursor-pointer relative group/shade transition-all hover:flex-[2.5] duration-300"
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
              {/* Individual shade squares */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {shades.map((shade, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="text-center cursor-pointer group/sq"
                          onClick={() => handleCopy("hex")}
                        >
                          <div
                            className="w-full aspect-square rounded-lg shadow-sm color-swatch ring-1 ring-black/5 dark:ring-white/5 group-hover/sq:scale-110 transition-transform"
                            style={{ backgroundColor: shade.hex }}
                          />
                          <code className="text-[7px] text-muted-foreground mt-0.5 block truncate leading-tight">
                            {shade.hex}
                          </code>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Click to copy {shade.hex}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============ RIGHT: Manual Input ============ */}
        <Card className="glass-card overflow-hidden lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Input Color</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="hex" className="w-full">
              <TabsList className="grid grid-cols-4 w-full rounded-xl h-9">
                <TabsTrigger value="hex" className="rounded-lg text-xs">
                  HEX
                </TabsTrigger>
                <TabsTrigger value="rgb" className="rounded-lg text-xs">
                  RGB
                </TabsTrigger>
                <TabsTrigger value="cmyk" className="rounded-lg text-xs">
                  CMYK
                </TabsTrigger>
                <TabsTrigger value="paste" className="rounded-lg text-xs">
                  Any
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hex" className="mt-3 space-y-3">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={colorData.hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="w-10 h-10 rounded-xl border-0 cursor-pointer shrink-0"
                  />
                  <Input
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#7c3aed"
                    className="font-mono rounded-xl"
                    id="hex-input"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Enter a hex color code (e.g. #FF5733, #ABC)
                </p>
              </TabsContent>

              <TabsContent value="rgb" className="mt-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {(["r", "g", "b"] as const).map((ch) => (
                    <div key={ch}>
                      <Label className="text-[10px] text-muted-foreground uppercase font-semibold">
                        {ch}
                      </Label>
                      <Input
                        value={rgbInput[ch]}
                        onChange={(e) => handleRgbChange(ch, e.target.value)}
                        type="number"
                        min={0}
                        max={255}
                        className="font-mono rounded-xl"
                        id={`rgb-${ch}-input`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">Values: 0-255 for each channel</p>
              </TabsContent>

              <TabsContent value="cmyk" className="mt-3 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {(["c", "m", "y", "k"] as const).map((ch) => (
                    <div key={ch}>
                      <Label className="text-[10px] text-muted-foreground uppercase font-semibold">
                        {ch}
                      </Label>
                      <Input
                        value={cmykInput[ch]}
                        onChange={(e) => handleCmykChange(ch, e.target.value)}
                        type="number"
                        min={0}
                        max={100}
                        className="font-mono rounded-xl"
                        id={`cmyk-${ch}-input`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">Values: 0-100% for each channel</p>
              </TabsContent>

              <TabsContent value="paste" className="mt-3 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={pasteInput}
                    onChange={(e) => setPasteInput(e.target.value)}
                    placeholder="Paste any color..."
                    className="font-mono rounded-xl"
                    id="paste-input"
                    onKeyDown={(e) => e.key === "Enter" && handlePaste()}
                  />
                  <Button onClick={handlePaste} className="rounded-xl shrink-0" id="paste-btn">
                    Parse
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Supported formats:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "#FF5733",
                      "rgb(255,87,51)",
                      "rgba(255,87,51,0.8)",
                      "hsl(11,100%,60%)",
                      "cmyk(0%,66%,80%,0%)",
                    ].map((example) => (
                      <code
                        key={example}
                        className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground cursor-pointer hover:bg-muted transition-colors"
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

            {/* Theme Preview Mini */}
            <div className="mt-4 space-y-2">
              <Label className="text-[11px] font-medium text-muted-foreground">Theme Preview</Label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className="p-3 rounded-xl shadow-sm"
                  style={{
                    backgroundColor: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, 96%)`,
                  }}
                >
                  <div
                    className="text-xs font-bold mb-0.5"
                    style={{
                      color: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, 20%)`,
                    }}
                  >
                    Light
                  </div>
                  <div
                    className="text-[10px]"
                    style={{
                      color: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, 35%)`,
                    }}
                  >
                    Sample text
                  </div>
                  <div
                    className="mt-1.5 px-2 py-0.5 rounded text-[9px] text-white inline-block font-medium"
                    style={{
                      backgroundColor: colorData.hex,
                    }}
                  >
                    Button
                  </div>
                </div>
                <div
                  className="p-3 rounded-xl shadow-sm"
                  style={{
                    backgroundColor: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, 12%)`,
                  }}
                >
                  <div
                    className="text-xs font-bold mb-0.5"
                    style={{
                      color: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, 90%)`,
                    }}
                  >
                    Dark
                  </div>
                  <div
                    className="text-[10px]"
                    style={{
                      color: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, 75%)`,
                    }}
                  >
                    Sample text
                  </div>
                  <div
                    className="mt-1.5 px-2 py-0.5 rounded text-[9px] text-white inline-block font-medium"
                    style={{
                      backgroundColor: `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, 60%)`,
                    }}
                  >
                    Button
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

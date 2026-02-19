import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Upload, Copy, Check, Trash2 } from "lucide-react";
import {
  type ColorFormat,
  type ColorData,
  colorDataFromRgba,
  formatColor,
  copyToClipboard,
  getTextColor,
} from "@/hooks/color-main";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ImageColorExtractor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ColorData[]>([]);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractColors = useCallback((img: HTMLImageElement) => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxSize = 200;
    const ratio = Math.min(maxSize / img.width, maxSize / img.height);
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const pixels = imageData.data;

    // Simple color quantization
    const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();
    const step = 4; // sample every 4 pixels
    for (let i = 0; i < pixels.length; i += 4 * step) {
      // Round to nearest 16 for grouping
      const r = Math.round(pixels[i] / 16) * 16;
      const g = Math.round(pixels[i + 1] / 16) * 16;
      const b = Math.round(pixels[i + 2] / 16) * 16;
      const key = `${r},${g},${b}`;
      const existing = colorMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        colorMap.set(key, { r, g, b, count: 1 });
      }
    }

    // Sort by frequency and take top 12
    const sorted = Array.from(colorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 16);

    // Remove very similar colors
    const unique: ColorData[] = [];
    for (const c of sorted) {
      const isDuplicate = unique.some((u) => {
        const dr = Math.abs(u.rgb.r - c.r);
        const dg = Math.abs(u.rgb.g - c.g);
        const db = Math.abs(u.rgb.b - c.b);
        return dr + dg + db < 60;
      });
      if (!isDuplicate && unique.length < 12) {
        unique.push(colorDataFromRgba(c.r, c.g, c.b));
      }
    }

    setExtractedColors(unique);
    setIsProcessing(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);
      const img = new window.Image();
      img.onload = () => extractColors(img);
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);
      const img = new window.Image();
      img.onload = () => extractColors(img);
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = async (idx: number) => {
    await copyToClipboard(formatColor(extractedColors[idx], format));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleClear = () => {
    setImageSrc(null);
    setExtractedColors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="glass-card overflow-hidden animate-slide-up" id="image-extractor">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Image className="h-5 w-5 text-emerald-500" />
            Image Color Extractor
          </CardTitle>
          <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
            <SelectTrigger className="w-[100px] rounded-xl" id="extractor-format-select">
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
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-file-input"
        />

        {!imageSrc ? (
          <div
            className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            id="image-drop-zone"
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Click to upload or drag & drop an image</p>
            <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, WEBP supported</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img src={imageSrc} alt="Uploaded" className="w-full max-h-60 object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-xl h-8 w-8 shadow-lg"
                onClick={handleClear}
                id="clear-image-btn"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {isProcessing && (
              <div className="text-center py-4">
                <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground mt-2">Extracting colors...</p>
              </div>
            )}

            {extractedColors.length > 0 && (
              <>
                <div className="flex h-14 rounded-xl overflow-hidden shadow-xl">
                  {extractedColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 cursor-pointer group relative transition-all hover:flex-[2] duration-300"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleCopy(idx)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedIdx === idx ? (
                          <Check
                            className="h-3.5 w-3.5"
                            style={{ color: getTextColor(color.hex) }}
                          />
                        ) : (
                          <Copy
                            className="h-3.5 w-3.5"
                            style={{ color: getTextColor(color.hex) }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {extractedColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 p-1.5 rounded-xl bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors"
                      onClick={() => handleCopy(idx)}
                    >
                      <div
                        className="w-7 h-7 rounded-lg shrink-0 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <code className="text-[9px] truncate flex-1">
                        {copiedIdx === idx ? "Copied!" : formatColor(color, format)}
                      </code>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

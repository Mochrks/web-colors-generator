import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCw, ArrowLeftRight, Eye, Check, X } from "lucide-react";
import {
  getContrastRatio,
  getWcagRating,
  isValidHex,
  generateRandomColor,
  getTextColor,
} from "@/hooks/color-main";

export default function ContrastChecker() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#7c3aed");

  const ratio = useMemo(() => {
    const fgHex = isValidHex(fg) ? fg : "#ffffff";
    const bgHex = isValidHex(bg) ? bg : "#000000";
    return getContrastRatio(fgHex, bgHex);
  }, [fg, bg]);

  const rating = useMemo(() => getWcagRating(ratio), [ratio]);

  const swap = () => {
    const temp = fg;
    setFg(bg);
    setBg(temp);
  };

  const randomize = () => {
    setFg(generateRandomColor());
    setBg(generateRandomColor());
  };

  const getScoreColor = (pass: boolean) => (pass ? "text-green-500" : "text-red-400");

  const getScoreIcon = (pass: boolean) =>
    pass ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />;

  const fgValid = isValidHex(fg) ? fg : "#ffffff";
  const bgValid = isValidHex(bg) ? bg : "#000000";

  return (
    <Card className="glass-card overflow-hidden animate-slide-up" id="contrast-checker">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5 text-green-500" />
          Contrast Checker (WCAG 2.1)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 flex-1 w-full">
            <input
              type="color"
              value={fgValid}
              onChange={(e) => setFg(e.target.value)}
              className="w-10 h-10 rounded-xl border-0 cursor-pointer"
            />
            <div className="flex-1">
              <Label className="text-[10px] text-muted-foreground">Foreground</Label>
              <Input
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="font-mono rounded-xl"
                id="contrast-fg-input"
              />
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              className="rounded-xl"
              id="contrast-swap-btn"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={randomize}
              className="rounded-xl"
              id="contrast-random-btn"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 flex-1 w-full">
            <input
              type="color"
              value={bgValid}
              onChange={(e) => setBg(e.target.value)}
              className="w-10 h-10 rounded-xl border-0 cursor-pointer"
            />
            <div className="flex-1">
              <Label className="text-[10px] text-muted-foreground">Background</Label>
              <Input
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="font-mono rounded-xl"
                id="contrast-bg-input"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: bgValid, color: fgValid }}
          >
            <h3 className="text-2xl font-bold mb-1">Title Text</h3>
            <p className="text-base mb-2">This is regular body text on the selected background.</p>
            <p className="text-xs">Small text for fine print and captions.</p>
          </div>
          <div
            className="p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: fgValid, color: bgValid }}
          >
            <h3 className="text-2xl font-bold mb-1">Reversed</h3>
            <p className="text-base mb-2">Colors swapped to show inverse contrast.</p>
            <p className="text-xs">Small text for fine print and captions.</p>
          </div>
        </div>

        {/* Ratio Display */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-black tracking-tight">
              {ratio.toFixed(2)}
              <span className="text-lg font-normal text-muted-foreground ml-1">: 1</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Contrast Ratio</p>
          </div>
        </div>

        {/* WCAG Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "AA Normal", pass: rating.aa, req: "≥ 4.5:1" },
            { label: "AA Large", pass: rating.aaLarge, req: "≥ 3:1" },
            { label: "AAA Normal", pass: rating.aaa, req: "≥ 7:1" },
            { label: "AAA Large", pass: rating.aaaLarge, req: "≥ 4.5:1" },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-3 rounded-xl text-center transition-colors ${
                item.pass
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-red-500/10 border border-red-500/20"
              }`}
            >
              <div className={`flex items-center justify-center gap-1 ${getScoreColor(item.pass)}`}>
                {getScoreIcon(item.pass)}
                <span className="font-semibold text-sm">{item.pass ? "Pass" : "Fail"}</span>
              </div>
              <p className="text-xs font-medium mt-1">{item.label}</p>
              <p className="text-[10px] text-muted-foreground">{item.req}</p>
            </div>
          ))}
        </div>

        {/* Suggestion */}
        {!rating.aa && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
            <p className="text-amber-600 dark:text-amber-400">
              💡 Tip: Try making the foreground darker or lighter to improve contrast. Suggested
              text color:{" "}
              <code
                className="px-1.5 py-0.5 rounded-md font-mono text-xs"
                style={{
                  backgroundColor: bgValid,
                  color: getTextColor(bgValid),
                }}
              >
                {getTextColor(bgValid)}
              </code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

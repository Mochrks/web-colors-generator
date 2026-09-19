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
import { CONTRAST_DEFAULT_BG, CONTRAST_DEFAULT_FG, WCAG_SCORES } from "@/constants";

export default function ContrastChecker() {
  const [fg, setFg] = useState(CONTRAST_DEFAULT_FG);
  const [bg, setBg] = useState(CONTRAST_DEFAULT_BG);

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

  const fgValid = isValidHex(fg) ? fg : "#ffffff";
  const bgValid = isValidHex(bg) ? bg : "#000000";

  return (
    <Card
      className="apple-card overflow-hidden bg-white dark:bg-neutral-900 border-none animate-fade-in"
      id="contrast-checker"
    >
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
          <Eye className="h-4 w-4 text-neutral-500" />
          Contrast Checker (WCAG 2.1)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-3 flex-1 w-full">
            <input
              type="color"
              value={fgValid}
              onChange={(e) => setFg(e.target.value)}
              className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer shrink-0 bg-transparent"
            />
            <div className="flex-1">
              <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Foreground
              </Label>
              <Input
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="font-mono rounded-2xl mt-1 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
                id="contrast-fg-input"
              />
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              className="rounded-2xl border-neutral-200 dark:border-neutral-800"
              id="contrast-swap-btn"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={randomize}
              className="rounded-2xl border-neutral-200 dark:border-neutral-800"
              id="contrast-random-btn"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3 flex-1 w-full">
            <input
              type="color"
              value={bgValid}
              onChange={(e) => setBg(e.target.value)}
              className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer shrink-0 bg-transparent"
            />
            <div className="flex-1">
              <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Background
              </Label>
              <Input
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="font-mono rounded-2xl mt-1 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
                id="contrast-bg-input"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="p-6 rounded-2xl shadow-sm border border-neutral-200/50 dark:border-neutral-800/50"
            style={{ backgroundColor: bgValid, color: fgValid }}
          >
            <h3 className="text-2xl font-bold mb-1">Title Text</h3>
            <p className="text-base mb-2">This is regular body text on the selected background.</p>
            <p className="text-xs">Small text for fine print and captions.</p>
          </div>
          <div
            className="p-6 rounded-2xl shadow-sm border border-neutral-200/50 dark:border-neutral-800/50"
            style={{ backgroundColor: fgValid, color: bgValid }}
          >
            <h3 className="text-2xl font-bold mb-1">Reversed</h3>
            <p className="text-base mb-2">Colors swapped to show inverse contrast.</p>
            <p className="text-xs">Small text for fine print and captions.</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className="text-5xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              {ratio.toFixed(2)}
              <span className="text-lg font-normal text-neutral-400 ml-1">: 1</span>
            </div>
            <p className="text-sm font-medium text-neutral-500 mt-1">Contrast Ratio</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {WCAG_SCORES.map((item) => {
            const pass = rating[item.key as keyof typeof rating];
            return (
              <div
                key={item.key}
                className={`p-3 rounded-2xl text-center transition-colors ${
                  pass
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                <div
                  className={`flex items-center justify-center gap-1 ${pass ? "text-green-500" : "text-red-400"}`}
                >
                  {pass ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  <span className="font-semibold text-sm">{pass ? "Pass" : "Fail"}</span>
                </div>
                <p className="text-xs font-medium mt-1 text-neutral-700 dark:text-neutral-300">
                  {item.label}
                </p>
                <p className="text-[10px] text-neutral-400">{item.req}</p>
              </div>
            );
          })}
        </div>

        {!rating.aa && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm">
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

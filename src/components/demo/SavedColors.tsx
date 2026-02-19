import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Copy, Check, Trash2, X } from "lucide-react";
import {
  type ColorFormat,
  getSavedColors,
  removeSavedColor,
  getColorHistory,
  colorDataFromHex,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SavedColors() {
  const [saved, setSaved] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      setSaved(getSavedColors());
      setHistory(getColorHistory());
    };
    loadData();
    window.addEventListener("storage", loadData);
    const interval = setInterval(loadData, 2000);
    return () => {
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = async (hex: string) => {
    const data = colorDataFromHex(hex);
    await copyToClipboard(formatColor(data, format));
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleRemove = (hex: string) => {
    removeSavedColor(hex);
    setSaved(getSavedColors());
  };

  const handleClearHistory = () => {
    localStorage.removeItem("color-generator-history");
    setHistory([]);
  };

  const renderColorGrid = (colors: string[], removable: boolean) => {
    if (colors.length === 0) {
      return (
        <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
          {removable
            ? "No saved colors yet. Use the Save button to add colors."
            : "No color history yet."}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {colors.map((hex, idx) => (
          <div
            key={`${hex}-${idx}`}
            className="relative group cursor-pointer animate-scale-in"
            onClick={() => handleCopy(hex)}
          >
            <div
              className="w-full aspect-square rounded-xl shadow-md color-swatch border border-white/10"
              style={{ backgroundColor: hex }}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className="p-1 rounded-lg backdrop-blur-sm"
                  style={{
                    backgroundColor:
                      getTextColor(hex) === "#ffffff" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {copiedHex === hex ? (
                    <Check className="h-4 w-4" style={{ color: getTextColor(hex) }} />
                  ) : (
                    <Copy className="h-4 w-4" style={{ color: getTextColor(hex) }} />
                  )}
                </div>
              </div>
              {/* Remove button */}
              {removable && (
                <button
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(hex);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <p className="text-[8px] text-center font-mono mt-1 text-muted-foreground truncate">
              {hex}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="glass-card overflow-hidden animate-slide-up" id="saved-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bookmark className="h-5 w-5 text-yellow-500" />
            Saved Colors & History
          </CardTitle>
          <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
            <SelectTrigger className="w-[100px] rounded-xl" id="saved-format-select">
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
      <CardContent>
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="saved" className="rounded-lg gap-1.5">
              <Bookmark className="h-3.5 w-3.5" />
              Saved ({saved.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              History ({history.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="saved" className="mt-4">
            {renderColorGrid(saved, true)}
          </TabsContent>
          <TabsContent value="history" className="mt-4 space-y-3">
            {history.length > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-xs text-muted-foreground hover:text-destructive rounded-xl"
                  id="clear-history-btn"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear History
                </Button>
              </div>
            )}
            {renderColorGrid(history, false)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

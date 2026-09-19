import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type ColorFormat,
  type ColorData,
  generateShades,
  formatColor,
  copyToClipboard,
  getTextColor,
} from "@/hooks/color-main";
import { COLOR_FORMAT_OPTIONS, COPIED_RESET_MS, PALETTE_INITIAL_VISIBLE } from "@/constants";
import {
  allPalettes,
  PALETTE_CATEGORIES,
  type PaletteCategory,
  type PaletteSection,
} from "@/data/palettes";

function PaletteRow({ palette, format }: { palette: PaletteSection; format: ColorFormat }) {
  const [expandedColor, setExpandedColor] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (color: ColorData, key: string) => {
    await copyToClipboard(formatColor(color, format));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), COPIED_RESET_MS);
  };

  return (
    <Card className="apple-card overflow-hidden bg-white dark:bg-neutral-900 border-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 shrink-0">
            {Object.values(palette.colors)
              .slice(0, 6)
              .map((hex, i) => (
                <span
                  key={i}
                  className="block rounded-full border border-white/10"
                  style={{
                    backgroundColor: hex,
                    width: i === 0 ? 18 : 12,
                    height: i === 0 ? 18 : 12,
                    marginLeft: i === 0 ? 0 : -4,
                    zIndex: 6 - i,
                    position: "relative",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                />
              ))}
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
              {palette.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {Object.keys(palette.colors).length} Essential Colors
              </p>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                {palette.category}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(palette.colors).map(([name, hex]) => {
            const shades = generateShades(hex, 11);
            const isExpanded = expandedColor === name;

            return (
              <div key={name} className="group/row">
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center gap-3 w-40 sm:w-52 shrink-0 cursor-pointer"
                    onClick={() => setExpandedColor(isExpanded ? null : name)}
                  >
                    <div
                      className="w-8 h-8 rounded-xl shadow-sm shrink-0 border border-neutral-200/50 dark:border-neutral-800/50 transition-transform duration-500 group-hover/row:scale-105"
                      style={{ backgroundColor: hex }}
                    />
                    <div className="min-w-0">
                      <span className="text-[13px] font-semibold capitalize block truncate text-neutral-800 dark:text-neutral-200">
                        {name.replace(/_/g, " ")}
                      </span>
                      <code className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">
                        {hex}
                      </code>
                    </div>
                  </div>

                  <div className="flex-1 flex h-8 rounded-xl overflow-hidden border border-neutral-200/30 dark:border-neutral-800/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    {shades.map((shade, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="flex-1 cursor-pointer relative group/shade transition-all hover:flex-[2.5] duration-500"
                              style={{ backgroundColor: shade.hex }}
                              onClick={() => handleCopy(shade, `${name}-${idx}`)}
                            >
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/shade:opacity-100 transition-opacity">
                                {copiedKey === `${name}-${idx}` ? (
                                  <Check
                                    className="h-3 w-3"
                                    style={{ color: getTextColor(shade.hex) }}
                                  />
                                ) : (
                                  <Copy
                                    className="h-3 w-3"
                                    style={{ color: getTextColor(shade.hex) }}
                                  />
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="font-mono text-[11px] font-bold">
                              {formatColor(shade, format)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>

                  <button
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 shrink-0"
                    onClick={() => setExpandedColor(isExpanded ? null : name)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 ml-0 sm:ml-52 grid grid-cols-11 gap-2 animate-fade-in">
                    {shades.map((shade, idx) => (
                      <div
                        key={idx}
                        className="text-center cursor-pointer group/detail"
                        onClick={() => handleCopy(shade, `${name}-detail-${idx}`)}
                      >
                        <div
                          className="w-full aspect-square rounded-lg shadow-sm border border-neutral-200/50 dark:border-neutral-800/50 group-hover/detail:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: shade.hex }}
                        />
                        <code className="text-[8px] font-bold text-neutral-400 mt-1.5 block truncate leading-tight uppercase">
                          {copiedKey === `${name}-detail-${idx}` ? "✓" : shade.hex}
                        </code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaletteShowcase() {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<PaletteCategory[]>([]);

  const toggleCategory = (cat: PaletteCategory) => {
    if (cat === "All") {
      setActiveCategories([]);
      return;
    }
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredPalettes = useMemo(() => {
    let result = allPalettes;

    if (activeCategories.length > 0) {
      result = result.filter((p) => activeCategories.includes(p.category as PaletteCategory));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          Object.keys(p.colors).some((name) => name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeCategories, searchQuery]);

  const isFiltering = activeCategories.length > 0 || searchQuery.trim().length > 0;
  const visiblePalettes = isFiltering
    ? filteredPalettes
    : showAll
      ? filteredPalettes
      : filteredPalettes.slice(0, PALETTE_INITIAL_VISIBLE);

  const clearFilters = () => {
    setActiveCategories([]);
    setSearchQuery("");
  };

  return (
    <div className="space-y-12" id="palette-showcase">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Curated Collections
            </h2>
            <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
              {allPalettes.length} professionally curated sets with dynamic shade generation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Format
            </span>
            <Select value={format} onValueChange={(v: ColorFormat) => setFormat(v)}>
              <SelectTrigger
                className="w-[120px] rounded-2xl h-10 text-xs font-semibold bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                id="palette-format-select"
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
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search palettes..."
              className="pl-9 h-9 rounded-2xl text-xs bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PALETTE_CATEGORIES.map((cat) => {
              const isAll = cat === "All";
              const isActive = isAll
                ? activeCategories.length === 0
                : activeCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                    isActive
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                      : "bg-white dark:bg-neutral-900 text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                  }`}
                >
                  {cat}
                  {!isAll && isActive && <X className="h-2.5 w-2.5" />}
                </button>
              );
            })}

            {isFiltering && (
              <button
                onClick={clearFilters}
                className="text-[11px] font-bold text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors underline underline-offset-2 ml-1"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {isFiltering && (
          <p className="text-[12px] text-neutral-500">
            Showing {filteredPalettes.length} of {allPalettes.length} collections
            {activeCategories.length > 0 && <span> in {activeCategories.join(", ")}</span>}
            {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {visiblePalettes.length > 0 ? (
          visiblePalettes.map((palette) => (
            <PaletteRow key={palette.title} palette={palette} format={format} />
          ))
        ) : (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-base font-semibold">No collections found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4 rounded-2xl text-xs">
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {!isFiltering && allPalettes.length > PALETTE_INITIAL_VISIBLE && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="rounded-2xl px-10 gap-2.5 h-12 text-[13px] font-bold border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all shadow-sm"
            id="show-more-palettes-btn"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Fewer Collections
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Explore All {allPalettes.length} Collections
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Copy, Plus } from "lucide-react";
import {
  copyToClipboard,
  generateGradation,
  generateRandomColor,
  getColorString,
} from "@/hooks/color-main";
import { initialTailwindColors } from "@/utils/color";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function Priview() {
  const [color, setColor] = useState({ h: 180, s: 50, l: 50 });
  const [format, setFormat] = useState<"hsl" | "rgb" | "hex">("hex");
  const [tailwindColors, setTailwindColors] = useState(initialTailwindColors);
  const [colorPalettes, setColorPalettes] = useState<{ h: number; s: number; l: number }[][]>([]);

  const addNewColor = () => {
    const newColor = generateRandomColor();
    const newColorName = `Custom ${Object.keys(tailwindColors).length + 1}`;
    setTailwindColors((prev) => ({ ...prev, [newColorName]: newColor }));
    setColorPalettes((prev) => [...prev, generateGradation(newColor)]);
  };

  return (
    <div>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>Color Generator</CardTitle>
          <CardDescription>Generate and explore colors in different formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-24 h-24 rounded-md shadow-md"
                style={{ backgroundColor: getColorString(color.h, color.s, color.l) }}
              ></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono">
                    {getColorString(color.h, color.s, color.l, format)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(getColorString(color.h, color.s, color.l, format))
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Select
                  value={format}
                  onValueChange={(value: "hsl" | "rgb" | "hex") => setFormat(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Color format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hsl">HSL</SelectItem>
                    <SelectItem value="rgb">RGB</SelectItem>
                    <SelectItem value="hex">HEX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Hue</Label>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[color.h]}
                  onValueChange={(value) => setColor({ ...color, h: value[0] })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Saturation</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[color.s]}
                  onValueChange={(value) => setColor({ ...color, s: value[0] })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Lightness</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[color.l]}
                  onValueChange={(value) => setColor({ ...color, l: value[0] })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
          <CardDescription>Preview generated colors in a theme</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="light" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
            </TabsList>
            <TabsContent value="light">
              <div
                className="p-4 space-y-4"
                style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, 95%)` }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: `hsl(${color.h}, ${color.s}%, 20%)` }}
                >
                  Light Theme
                </h2>
                <p style={{ color: `hsl(${color.h}, ${color.s}%, 30%)` }}>
                  This is how your theme might look in light mode.
                </p>
                <Button
                  style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, 50%)`, color: "white" }}
                >
                  Sample Button
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="dark">
              <div
                className="p-4 space-y-4"
                style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, 20%)` }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: `hsl(${color.h}, ${color.s}%, 90%)` }}
                >
                  Dark Theme
                </h2>
                <p style={{ color: `hsl(${color.h}, ${color.s}%, 80%)` }}>
                  This is how your theme might look in dark mode.
                </p>
                <Button
                  style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, 60%)`, color: "black" }}
                >
                  Sample Button
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tailwind Color Palettes</CardTitle>
          <CardDescription>
            Color palettes based on Tailwind CSS colors with 5 gradations each
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(tailwindColors).map(([name], paletteIndex) => (
              <div key={paletteIndex} className="space-y-2">
                <h3 className="text-lg font-semibold">{name}</h3>
                <div className="grid grid-cols-5 gap-2">
                  {colorPalettes[paletteIndex]?.map((color, colorIndex) => (
                    <TooltipProvider key={colorIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-1">
                            <div
                              className="h-12 rounded-md shadow-md cursor-pointer"
                              style={{
                                backgroundColor: getColorString(color.h, color.s, color.l, "hex"),
                              }}
                            ></div>
                            <div className="text-xs text-center font-mono">
                              {getColorString(color.h, color.s, color.l, format)}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>HEX: {getColorString(color.h, color.s, color.l, "hex")}</p>
                          <p>RGB: {getColorString(color.h, color.s, color.l, "rgb")}</p>
                          <p>HSL: {getColorString(color.h, color.s, color.l, "hsl")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="space-x-2">
              <Button onClick={addNewColor}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Color
              </Button>
            </div>
            <Select
              value={format}
              onValueChange={(value: "hsl" | "rgb" | "hex") => setFormat(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Color format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hsl">HSL</SelectItem>
                <SelectItem value="rgb">RGB</SelectItem>
                <SelectItem value="hex">HEX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Priview;

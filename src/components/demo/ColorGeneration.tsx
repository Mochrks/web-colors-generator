"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  christmasColors,
  coffeeColors,
  coldColors,
  creamColors,
  cyberpunkColors,
  galaxyColors,
  goldColors,
  halloweenColors,
  initialTailwindColors,
  kidsColors,
  neonColors,
  pastelColors,
  rainbowColors,
  ramadhanColors,
  retroColors,
  seaColors,
  skyColors,
  spaceXColors,
  summerColors,
  sunsetColors,
  vintageColors,
  warmColors,
  weddingColors,
} from "@/utils/color";
import { generateGradation, getColorString } from "@/hooks/color-main";
import Priview from "./Priview";

export default function ColorGenerator() {
  const [format, setFormat] = useState<"hsl" | "rgb" | "hex">("hex");
  const [colorPalettes, setColorPalettes] = useState<{ h: number; s: number; l: number }[][]>([]);

  useEffect(() => {
    generateColorPalettes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateColorPalettes = () => {
    const newPalettes = Object.values(initialTailwindColors).map((hex) => generateGradation(hex));
    setColorPalettes(newPalettes);
  };

  const renderColorPalette = (colors: Record<string, string>, title: string) => (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{title} Color Palette</CardTitle>
        <CardDescription>A selection of {title.toLowerCase()} colors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(colors).map(([name, hex], index) => {
            const gradation = generateGradation(hex);
            return (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-semibold">{name}</h3>
                <div className="grid grid-cols-5 gap-2">
                  {gradation.map((color, colorIndex) => (
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <Priview />
      </div>
      {renderColorPalette(pastelColors, "Pastel")}
      {renderColorPalette(retroColors, "Retro")}
      {renderColorPalette(vintageColors, "Vintage")}
      {renderColorPalette(neonColors, "Neon")}
      {renderColorPalette(goldColors, "Gold")}
      {renderColorPalette(warmColors, "Warm")}
      {renderColorPalette(coldColors, "Cold")}
      {renderColorPalette(summerColors, "Summer")}
      {renderColorPalette(sunsetColors, "Sunset")}
      {renderColorPalette(skyColors, "Sky")}
      {renderColorPalette(seaColors, "Sea")}
      {renderColorPalette(coffeeColors, "Coffee")}
      {renderColorPalette(creamColors, "Cream")}
      {renderColorPalette(kidsColors, "Kids")}
      {renderColorPalette(rainbowColors, "Rainbow")}
      {renderColorPalette(spaceXColors, "Space")}
      {renderColorPalette(galaxyColors, "Galaxy")}
      {renderColorPalette(cyberpunkColors, "Cyberpunk")}
      {renderColorPalette(weddingColors, "Wedding")}
      {renderColorPalette(halloweenColors, "Halloween")}
      {renderColorPalette(christmasColors, "Christmas")}
      {renderColorPalette(ramadhanColors, "Ramadhan")}
    </div>
  );
}

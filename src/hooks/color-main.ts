export function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)].map(Math.round);
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number = 0;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function generateGradation(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const [h, s, l] = rgbToHsl(...rgb);
  return [
    { h, s, l: Math.max(0, l - 30) },
    { h, s, l: Math.max(0, l - 15) },
    { h, s, l },
    { h, s, l: Math.min(100, l + 15) },
    { h, s, l: Math.min(100, l + 30) },
  ];
}

export function generateRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const getColorString = (
  h: number,
  s: number,
  l: number,
  format: "hsl" | "rgb" | "hex" = "hsl"
) => {
  const rgb = hslToRgb(h, s, l);
  const [r, g, b] = rgb;
  const hex = rgbToHex(r, g, b);
  switch (format) {
    case "hsl":
      return `hsl(${h}, ${s}%, ${l}%)`;
    case "rgb":
      return `rgb(${rgb.join(", ")})`;
    case "hex":
      return hex;
  }
};

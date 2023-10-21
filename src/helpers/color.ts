export function getHexColor(value: number, fromHex: string, toHex: string) {
  const maxValue = 50;
  const startColor = hexToRgb(fromHex); // [255, 255, 255];
  const endColor = hexToRgb(toHex); // [144, 61, 61];

  const ratio = value / maxValue;
  const rgb = startColor.map((start, index) =>
    Math.round(start - (start - endColor[index]) * ratio),
  ) as [number, number, number];

  const hex = rgbToHex(rgb);

  return `#${hex}`;
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b] as [number, number, number];
}

const rgbToHex = (rgb: [number, number, number]) =>
  rgb
    .map(component => {
      const hexValue = component.toString(16);
      return hexValue.length === 1 ? '0' + hexValue : hexValue;
    })
    .join('');

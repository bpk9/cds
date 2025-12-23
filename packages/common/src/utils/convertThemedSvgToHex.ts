export const convertThemedSvgToHex = (xml: string, illustrationPalette: Record<string, string>) => {
  const cssVarPattern = /var\(--illustration-([a-z0-9-]+)\)/gi;
  const normalizeToken = (token: string) => token.replace(/-/g, '');
  const channelToHex = (channel: number) =>
    Math.max(0, Math.min(255, Math.round(channel)))
      .toString(16)
      .padStart(2, '0');

  const convertColorToHex = (value: string) => {
    const match = value.match(/^rgba?\(([^)]+)\)$/i);
    if (!match) {
      return value;
    }

    const [rRaw, gRaw, bRaw, aRaw] = match[1].split(',').map((part) => part.trim());
    const r = Number(rRaw);
    const g = Number(gRaw);
    const b = Number(bRaw);

    if ([r, g, b].some((channel) => Number.isNaN(channel))) {
      return value;
    }

    const baseHex = `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
    if (aRaw === undefined) {
      return baseHex;
    }

    const alpha = Number(aRaw);
    return Number.isNaN(alpha) ? value : `${baseHex}${channelToHex(alpha * 255)}`;
  };

  return xml.replace(cssVarPattern, (_, token: string) => {
    const color = illustrationPalette[normalizeToken(token)];
    return color ? convertColorToHex(color) : `var(--illustration-${token})`;
  });
};

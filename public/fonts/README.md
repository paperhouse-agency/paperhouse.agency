# Fonts

This project uses three font families optimized for web performance.

## Font Stack

### Heading Font: Bianco Serif
- **Directory**: `BiancoSerif/`
- **Format**: WOFF2 only (optimized)
- **Weights**: 400 (Regular), 700 (Bold), 800 (Extra Bold)
- **Styles**: Normal, Italic
- **Usage**: `className="font-heading"`

### Body Font: IBM Plex Sans
- **Source**: Google Fonts (CDN)
- **Weights**: 400, 500, 600, 700
- **Styles**: Normal, Italic
- **Usage**: `className="font-body"`

### Monospace Font: PP Neue Montreal Mono
- **Directory**: `PPNeueMontrealMono/`
- **Format**: OTF (original files kept for best quality)
- **Weights**: 400 (Book), 500 (Medium), 700 (Bold)
- **Styles**: Normal, Italic
- **Usage**: `className="font-mono"`

## Optimization

- **Bianco Serif**: Old formats (EOT, TTF, WOFF) removed, keeping only WOFF2 for optimal performance
- **IBM Plex Sans**: Loaded from Google Fonts with `display: swap` for better loading experience
- **PP Neue Montreal Mono**: OTF files kept (can be converted to WOFF2 later if needed)

## CSS Variables

Fonts are exposed as CSS variables in Tailwind:
- `--font-heading`
- `--font-body`
- `--font-mono`

## Fallback Fonts

Each font has appropriate system font fallbacks:
- **Heading**: Georgia, Times New Roman, serif
- **Body**: system-ui, -apple-system, Segoe UI, sans-serif
- **Mono**: ui-monospace, SFMono-Regular, Consolas, Monaco, monospace

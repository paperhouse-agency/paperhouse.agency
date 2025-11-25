# Typography Classes

Reusable typography classes using Tailwind's `@apply` directive for consistency across the project.

## Headings (Bianco Serif Regular)

All headings use `font-heading` (Bianco Serif Regular) with `leading-none` (auto line height).

| Class | Font Size | Usage |
|-------|-----------|-------|
| `heading-1` | 58px | Main page titles |
| `heading-2` | 44px | Section headings |
| `heading-3` | 32px | Subsection headings |
| `heading-4` | 24px | Card/component titles |
| `heading-5` | 18px | Small headings |
| `heading-6` | 16px | Smallest headings |

**Example:**
```tsx
<h1 className="heading-1">Welcome to our site</h1>
<h2 className="heading-2">About us</h2>
```

## Body Text (IBM Plex Sans)

Body text uses `font-body` (IBM Plex Sans) with `leading-relaxed`.

| Class | Font Size | Usage |
|-------|-----------|-------|
| `body-large` | 18px | Large body text, introductions |
| `body` | 16px | Default body text |
| `body-small` | 14px | Small body text, captions |

**Example:**
```tsx
<p className="body-large">Introduction paragraph...</p>
<p className="body">Regular paragraph...</p>
<p className="body-small">Fine print or captions...</p>
```

## Monospace (PP Neue Montreal Mono)

Monospace text uses `font-mono` (PP Neue Montreal Mono) with `leading-relaxed`.

| Class | Font Size | Details | Usage |
|-------|-----------|---------|-------|
| `mono` | 16px | Regular | Code, technical text |
| `mono-wide` | 14px | Tracking 10%, uppercase | Labels, tags |

**Example:**
```tsx
<code className="mono">const x = 42;</code>
<span className="mono-wide">Label</span>
```

## Customization

To modify typography styles, edit `styles/css/typography.css`. The classes use `@apply` for easy maintenance.

## Modifiers

You can still add Tailwind modifiers to these classes:

```tsx
{/* Add color */}
<h1 className="heading-1 text-blue-500">Blue heading</h1>

{/* Add weight */}
<p className="body font-bold">Bold body text</p>

{/* Add responsive */}
<h2 className="heading-3 md:heading-2">Responsive heading</h2>
```

## Best Practices

1. **Use semantic HTML**: Always use proper HTML tags (`<h1>`, `<p>`, etc.)
2. **Consistent classes**: Use these classes instead of inline Tailwind utilities
3. **Heading hierarchy**: Follow proper heading order (h1 → h2 → h3)
4. **Body text default**: Use `.body` as your default paragraph style

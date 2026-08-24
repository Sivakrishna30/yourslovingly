# 03 - Element Capabilities, Styling Properties & Animations

## 1. Universal Element Capabilities
All canvas elements inherit a robust set of standard manipulation tools:
- **Geometry**: Position ($X, Y$), Dimensions (Width, Height), Rotation ($0^\circ–360^\circ$), Proportional Scaling.
- **Layering & Ordering**: Z-Index stack control (*Bring to Front*, *Send to Back*, *Bring Forward*, *Send Backward*).
- **Transformations**: Flip Horizontal, Flip Vertical, Lock Aspect Ratio, Element Locking.
- **Visual Filters & Effects**: Opacity ($0–100\%$), Drop Shadow, Border, Border Radius, Brightness, Contrast, Saturation, Blur.

---

## 2. Type-Specific Configuration Controls

### 2.1 Text Elements
- Font Family (curated display & body pairings)
- Font Size, Font Weight (100–900), Letter Spacing, Line Height
- Text Alignment (Left, Center, Right, Justify)
- Text Transformation (Uppercase, Lowercase, Title Case)
- Text Color, Background Highlight, Gradient Fills

### 2.2 Image Elements
- Source URL / Asset ID
- Object Fit (Cover, Contain, Fill), Focal Point Alignment
- Crop geometry and mask shapes
- Border radius and photo frame presets

### 2.3 SVG & Decorative Artwork Elements
- Vector asset source
- Multi-stop color fill overrides (recoloring vector layers dynamically)
- Stroke weight and stroke color overrides

### 2.4 Shapes & Lines
- Fill Color, Gradient Fill
- Stroke Style (Solid, Dashed, Dotted), Stroke Width
- Corner Rounding / Radius

---

## 3. Motion & Animation Model
- **Entrance Effects**: Fade In, Slide Up, Slide Down, Zoom In, Soft Bounce.
- **Timing Parameters**: Duration (ms), Delay (ms), Easing curve (ease-out, ease-in-out, spring).
- **Responsive Behavior**: Gracefully disables or simplifies on low-power devices and reduced-motion preferences.

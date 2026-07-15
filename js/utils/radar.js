

export const generateRadarSVG = (data, options = {}) => {
  const {
    size = 340,
    maxVal = 100,
    levels = 5,
    polyColor = "rgba(0, 242, 254, 0.15)",
    strokeColor = "var(--accent-cyan)"
  } = options;

  const center = size / 2;
  const radius = (size / 2) * 0.7; // Leave 30% margin for text labels
  const totalAxes = data.length;

  // 1. Generate concentric grid rings
  let gridRings = "";
  for (let i = 1; i <= levels; i++) {
    const r = (radius / levels) * i;
    gridRings += `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="2, 4" />\n`;
  }

  // 2. Generate Axis lines and Text Labels
  let axisLines = "";
  let textLabels = "";
  let polyPoints = [];

  data.forEach((d, i) => {
    const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;

    // Line Outer Coordinates
    const lineX = center + radius * Math.cos(angle);
    const lineY = center + radius * Math.sin(angle);
    axisLines += `<line x1="${center}" y1="${center}" x2="${lineX}" y2="${lineY}" stroke="var(--border-color)" stroke-width="1" />\n`;

    // Text placement
    const labelDistance = radius + 18;
    const labelX = center + labelDistance * Math.cos(angle);
    const labelY = center + labelDistance * Math.sin(angle) + 4;

    let anchor = "middle";
    if (Math.cos(angle) > 0.2) anchor = "start";
    if (Math.cos(angle) < -0.2) anchor = "end";

    textLabels += `<text x="${labelX}" y="${labelY}" fill="var(--text-muted)" font-family="monospace" font-size="11" text-anchor="${anchor}">${d.axis}</text>\n`;

    // 3. Map values to polygon points
    const valueRadius = (Math.min(d.value, maxVal) / maxVal) * radius;
    const valX = center + valueRadius * Math.cos(angle);
    const valY = center + valueRadius * Math.sin(angle);
    polyPoints.push(`${valX},${valY}`);
  });

  return `
    <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%">
      ${gridRings}
      ${axisLines}
      <polygon points="${polyPoints.join(" ")}" fill="${polyColor}" stroke="${strokeColor}" stroke-width="2" stroke-linejoin="round" />
       ${textLabels}
    </svg>
  `;
};
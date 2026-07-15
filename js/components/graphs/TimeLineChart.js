// ==========================================================================
// TIMELINE CHART COMPONENT (XP Progression SVG with axes & labels)
// ==========================================================================

export const renderTimelineChart = (transactions) => {
  const sortedTx = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  let runningTotalXp = 0;
  const chronologicalHistory = sortedTx.map(tx => {
    runningTotalXp += tx.amount;
    return {
      date: new Date(tx.createdAt),
      xpSnap: runningTotalXp
    };
  });

  const width = 600;
  const height = 300;
  const paddingLeft = 65;   // Room for vertical XP text tags
  const paddingBottom = 45; // Room for horizontal Date text tags
  const paddingTop = 20;
  const paddingRight = 30;

  if (chronologicalHistory.length === 0) {
    return `<div style="color:var(--text-muted); text-align:center; padding: 40px 0;">No logs found</div>`;
  }

  const minTime = chronologicalHistory[0].date.getTime();
  const maxTime = chronologicalHistory[chronologicalHistory.length - 1].date.getTime();
  const maxXp = chronologicalHistory[chronologicalHistory.length - 1].xpSnap;

  // Mapping formulas to find raw canvas coordinates
  const getX = (date) => paddingLeft + ((date.getTime() - minTime) / (maxTime - minTime || 1)) * (width - paddingLeft - paddingRight);
  const getY = (xp) => height - paddingBottom - (xp / (maxXp || 1)) * (height - paddingTop - paddingBottom);

  const pathPoints = chronologicalHistory.map(p => `${getX(p.date)},${getY(p.xpSnap)}`).join(" ");

  // 1. Generate Y-Axis Marks & Gridlines (XP)
  let yAxisElements = "";
  const ySegments = 4; // Generate 4 milestone text indicators
  for (let i = 0; i <= ySegments; i++) {
    const currentXp = (maxXp / ySegments) * i;
    const currentY = getY(currentXp);

    // Horizontal subtle guide mesh lines
    yAxisElements += `<line x1="${paddingLeft}" y1="${currentY}" x2="${width - paddingRight}" y2="${currentY}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`;

    // Formatting short value string handles (e.g. 25k)
    const displayXp = currentXp >= 1000 ? `${(currentXp / 1000).toFixed(0)}k` : currentXp.toFixed(0);

    // Axis text definitions
    yAxisElements += `<text x="${paddingLeft - 12}" y="${currentY + 4}" fill="var(--text-muted)" font-family="monospace" font-size="10" text-anchor="end">${displayXp}</text>`;
  }

  // 2. Generate X-Axis Marks & Gridlines (Time Tracker)
  let xAxisElements = "";
  const xSegments = 4;
  for (let i = 0; i <= xSegments; i++) {
    const currentTimeMs = minTime + ((maxTime - minTime) / xSegments) * i;
    const targetDate = new Date(currentTimeMs);
    const currentX = getX(targetDate);

    // Format shorthand date strings (MM/DD)
    const dateString = `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;

    // Axis ticks / lines
    xAxisElements += `<line x1="${currentX}" y1="${height - paddingBottom}" x2="${currentX}" y2="${height - paddingBottom + 5}" stroke="var(--border-color)" stroke-width="1" />`;
    // Axis labels
    xAxisElements += `<text x="${currentX}" y="${height - paddingBottom + 22}" fill="var(--text-muted)" font-family="monospace" font-size="10" text-anchor="middle">${dateString}</text>`;
  }

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      ${yAxisElements}
      ${xAxisElements}

      <line x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${height - paddingBottom}" stroke="var(--border-color)" stroke-width="1.5" />
      <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" stroke-width="1.5" />

      <polyline points="${pathPoints}" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 0px 6px rgba(0,242,254,0.3));" />

      ${chronologicalHistory.map((p, idx) => {
        if (idx === 0 || idx === chronologicalHistory.length - 1 || idx % 12 === 0) {
          return `<circle cx="${getX(p.date)}" cy="${getY(p.xpSnap)}" r="3.5" fill="var(--accent-teal)" />`;
        }
        return '';
      }).join('')}
    </svg>
  `;
};
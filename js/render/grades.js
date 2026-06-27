

 export const renderGrades = (projects, transactions) => {
  const formatedProjects=formatProjects(projects)
  const gradDiv = document.getElementById("grades");
  if (!gradDiv) return;

  gradDiv.innerHTML = "";

  const gradesLayout = document.createElement("div");
  gradesLayout.className = "grades-wrapper";
  gradesLayout.style.cssText = "display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; width: 100%; margin-top: 20px;";

  // ==========================================================================
  // TIMELINE LOGIC WITH AXES & LABELS
  // ==========================================================================
  const sortedTx = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  let runningTotalXp = 0;
  const chronologicalHistory = sortedTx.map(tx => {
    runningTotalXp += tx.amount;
    return {
      date: new Date(tx.createdAt),
      xpSnap: runningTotalXp
    };
  });

  // Expanded dimensions and wider paddings to make space for custom axis numbers
  const width = 600;
  const height = 300;
  const paddingLeft = 65;   // Room for vertical XP text tags
  const paddingBottom = 45; // Room for horizontal Date text tags
  const paddingTop = 20;
  const paddingRight = 30;

  let timelineSvg = "";
  
  if (chronologicalHistory.length > 0) {
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

    timelineSvg = `
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
  } else {
    timelineSvg = `<div style="color:var(--text-muted); text-align:center; padding: 40px 0;">No logs found</div>`;
  }

  // ==========================================================================
  // PROJECTS STACK HTML LOGIC
  // ==========================================================================
  const maxProjectXp = Math.max(...formatedProjects.map(p => p.xps || 0), 1);

  const projectsListHtml = formatedProjects.map(proj => {
    const isZeroXp = (proj.xps === 0);
    const percentageFill = isZeroXp ? 5 : Math.min((proj.xps / maxProjectXp) * 100, 100);
    const badgeMarkup = isZeroXp 
      ? `<span class="badge in-progress-pulse" style="background: rgba(155, 81, 224, 0.15); color: var(--accent-purple); border: 1px solid rgba(155,81,224,0.3);">In Progress</span>`
      : `<span class="badge badge-validated">Validated</span>`;

    const fillGradient = isZeroXp ? 'background: var(--accent-purple);' : '';
    const fillClass = isZeroXp ? '' : (proj.xps > maxProjectXp * 0.6 ? 'fill-teal' : 'fill-cyan');

    return `
      <div class="project-row" style="margin-bottom: 16px;">
        <div class="project-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="project-name" style="font-size:0.9rem; font-weight:500;">${proj.name}</span>
            ${badgeMarkup}
          </div>
          <span class="project-score" style="color: ${isZeroXp ? 'var(--text-muted)' : 'var(--text-main)'}; font-size: 0.85rem;">
            ${isZeroXp ? '0' : proj.xps.toLocaleString()} XP
          </span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-fill ${fillClass}" style="width: ${percentageFill}%; ${fillGradient}"></div>
        </div>
      </div>
    `;
  }).join("");

  // ==========================================================================
  // ASSEMBLE COMPONENTS INTO INJECTION MATRIX
  // ==========================================================================
  gradesLayout.innerHTML = `
    <div class="card timeline-chart-card" style="grid-column: span 7;">
      <div class="card-title" style="display:flex; justify-content:space-between; align-items:center;">
        <span>XP Progression Timeline</span>
        <span style="font-size:0.75rem; color:var(--accent-cyan); font-family:monospace; opacity:0.8;">Total Gains Plot</span>
      </div>
      <div class="timeline-svg-container" style="width:100%; height:auto;">
        ${timelineSvg}
      </div>
    </div>

    <div class="card projects-list-card" style="grid-column: span 5; display: flex; flex-direction: column;">
      <div class="card-title">Project Records</div>
      <div class="projects-scroll-container" style="flex: 1; overflow-y: auto; max-height: 280px; padding-right: 6px;">
        ${projectsListHtml}
      </div>
    </div>
  `;

  gradDiv.appendChild(gradesLayout);
};
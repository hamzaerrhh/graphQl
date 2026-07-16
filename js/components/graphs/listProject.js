// ==========================================================================
// PROJECTS LIST COMPONENT (Project Records with progress bars)
// ==========================================================================
import {formatXP} from "../../utils/formaData.js"
export const renderProjectsList = (data) => {
  const maxProjectXp = Math.max(...data.map(p => p.xps || 0), 1);

  return data.map(proj => {
    const isZeroXp = (proj.xps === 0);
    const percentageFill = isZeroXp ? 5 : Math.min((proj.xps / maxProjectXp) * 100, 100);
    const badgeMarkup = isZeroXp
      ? `<span class="badge in-progress-pulse" style="background: rgba(155, 81, 224, 0.15); color: var(--accent-purple); border: 1px solid rgba(155,81,224,0.3);">In Progress</span>`
      : `<span class="badge badge-validated">Validated</span>`;

    const fillGradient = isZeroXp ? 'background: var(--accent-purple);' : '';
    const fillClass = isZeroXp ? '' : (proj.xps > maxProjectXp * 0.6 ? 'fill-teal' : 'fill-cyan');

    const members = Array.isArray(proj.team_members) ? proj.team_members : [];
    const membersMarkup = members.length
      ? `<div class="project-members">
          ${members.map(m => `<span class="member-chip">${m}</span>`).join("")}
        </div>`
      : "";

    return `
      <div class="project-row" style="margin-bottom: 16px;">
        <div class="project-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="project-name" style="font-size:0.9rem; font-weight:500;">${proj.name}</span>
            ${badgeMarkup}
          </div>
          <span class="project-score" style="color: ${isZeroXp ? 'var(--text-muted)' : 'var(--text-main)'}; font-size: 0.85rem;">
            ${isZeroXp ? '0' : formatXP(proj.xps)} 
          </span>
        </div>
        ${membersMarkup}
        <div class="progress-bar-container">
          <div class="progress-fill ${fillClass}" style="width: ${percentageFill}%; ${fillGradient}"></div>
        </div>
      </div>
    `;
  }).join("");
};
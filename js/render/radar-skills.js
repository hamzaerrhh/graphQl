import { formatSkills } from "../utils/formaData.js";
import { generateRadarSVG } from "../utils/radar.js";
export const renderSkillsRadar = (skills) => {
  const formattedData = formatSkills(skills);

  // 1. Find the dynamic dashboard grid wrapper created by renderOverView
  const dashboardContainer = document.querySelector(".ui-root .dashboard-container");
  if (!dashboardContainer) return;

  // 2. Create ONE unified structural parent container for all skill radars
  const skillsContainer = document.createElement("div");
  skillsContainer.id = "skillsRadarContainer";
  // Setting CSS Grid span matching your desktop profile layout constraints
  skillsContainer.style.cssText = "grid-column: span 12; display: flex; gap: 20px; flex-wrap: wrap; width: 100%; justify-content: center;";

  // 3. Generate inner template rows for both card targets side by side
  skillsContainer.innerHTML = `
    <div class="card radar-card">
      <div class="card-title">Core Proficiencies</div>
      <div class="radar-svg-holder">
        ${generateRadarSVG(formattedData.radar1, {
          polyColor: "rgba(246, 56, 220, 0.12)",
          strokeColor: "var(--accent-magenta)"
        })}
      </div>
    </div>

    <div class="card radar-card">
      <div class="card-title">Technologies Stack</div>
      <div class="radar-svg-holder">
        ${generateRadarSVG(formattedData.radar2, {
          polyColor: "rgba(0, 242, 254, 0.12)",
          strokeColor: "var(--accent-cyan)"
        })}
      </div>
    </div>
  `;

  // 4. Append the single parent div directly behind your Level/XP/Audit components
  dashboardContainer.appendChild(skillsContainer);
};

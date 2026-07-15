import { formatProjects } from "../utils/formaData.js";
import { renderTimelineChart } from "../components/graphs/TimeLineChart.js";
import { renderProjectsList } from "../components/graphs/listProject.js";

export const renderGrades = (projects, transactions) => {
  const formatedProjects = formatProjects(projects);
  console.log(formatedProjects);

  const gradDiv = document.getElementById("grades");
  if (!gradDiv) return;

  gradDiv.innerHTML = "";

  const gradesLayout = document.createElement("div");
  gradesLayout.className = "grades-wrapper";
  // FIX: Force a max-height on the grid wrapper so it doesn't expand infinitely on big screens
  gradesLayout.style.cssText = "display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; width: 100%; margin-top: 20px; height: 500px; max-height: 80vh;";

  const timelineSvg = renderTimelineChart(transactions);
  const projectsListHtml = renderProjectsList(formatedProjects);

  // ==========================================================================
  // ASSEMBLE COMPONENTS INTO INJECTION MATRIX
  // ==========================================================================
  gradesLayout.innerHTML = `
    <!-- FIX: Ensure the chart card takes up 100% height and its SVG is contained -->
    <div class="card timeline-chart-card" style="grid-column: span 7; display: flex; flex-direction: column; height: 100%; overflow: hidden;">
      <div class="card-title" style="display:flex; justify-content:space-between; align-items:center; flex-shrink: 0;">
        <span>XP Progression Timeline</span>
        <span style="font-size:0.75rem; color:var(--accent-cyan); font-family:monospace; opacity:0.8;">Total Gains</span>
      </div>
      <div class="timeline-svg-container" style="flex: 1; min-height: 0; width:100%;">
        ${timelineSvg}
      </div>
    </div>

    <!-- FIX: Force the card to fit exactly inside the grid's height and enable scrolling -->
    <div class="card projects-list-card" style="grid-column: span 5; display: flex; flex-direction: column; height: 100%; overflow: hidden;">
      <div class="card-title" style="margin-bottom: 15px; flex-shrink: 0;">Project Records</div>
      <div class="projects-scroll-container" style="flex: 1; overflow-y: auto; padding-right: 6px;">
        ${projectsListHtml}
      </div>
    </div>
  `;

  gradDiv.appendChild(gradesLayout);
};
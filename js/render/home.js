import { homePage } from "../pages/home.js";
import { getData } from "../api/query.js";


const extractData = async (userID) => {
  try {
    const data = await getData(userID);
 


const stuctData = {
  id: data?.user?.[0]?.id,
  login: data?.user?.[0]?.login,
  auditRatio: data?.user?.[0]?.auditRatio,
  totalDown: data?.user?.[0]?.totalDown,
  totalUp: data?.user?.[0]?.totalUp,
  success: data?.user?.[0]?.success?.aggregate?.count,
  failed: data?.user?.[0]?.failed?.aggregate?.count,
  attrs:data?.user?.[0]?.attrs,
  cohort: data?.user?.[0]?.cohort?.[0]?.cohorts?.[0]?.labelName || "N/A",
  xp: data?.totalXP?.aggregate?.sum?.amount,
  level: data?.lvl?.aggregate?.max?.amount,
  skills: data?.skills,
  projects:data?.groups_per_project,
  transactions:data?.transactions
};

    return stuctData
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
};

export const renderHome = async (root,userID) => {
  root.innerHTML = "";
  root.innerHTML = homePage;

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  });

  const userData = await extractData(userID);
  const auditData={
  up:userData.totalUp,
  down:userData.totalDown,
  ration:userData.auditRatio,
  succed:userData.success,
  failed:userData.failed
}


if (!userData) {
  return renderNoData(root);
}
//render the headers
renderHeader(userData.attrs,userData.login,userData.cohort)
//render overview show this data 

renderOverView(userData.xp,userData.level,auditData)

//rnder the skills show the skills as radars
renderSkillsRadar(userData.skills)


//render all projects earns 
renderGrades(userData.projects,userData.transactions)
  // Example

};


const renderHeader = (user,username,cohort) => {
  const usernameEl = document.getElementById("headerUsername");
  const avatarEl = document.getElementById("headerAvatar");
  const locationEl = document.getElementById("headerLocation");
  const cohortNameId=document.getElementById("cohort_name")
  if (usernameEl) {
    usernameEl.textContent =
     username || "User";
  }

  if (avatarEl) {
    avatarEl.src = user?.avatarUrl || "/assets/avatar.webp";
  }

  if (locationEl) {
    locationEl.textContent = `${user?.city || ""}, ${user?.country || ""}`;
  }
  if(cohortNameId){
        cohortNameId.textContent = `${cohort || "c1"}`
  }
};

const renderNoData = (root) => {
  root.innerHTML = `
    <div class="no-data-container">
      <div class="no-data-card">
        <div class="no-data-icon">
          ⚡
        </div>

        <h2>No Data Available</h2>

        <p>
          We couldn't load your dashboard data right now.
          This may be caused by a network issue or the server is temporarily unavailable.
        </p>

        <button id="retryBtn" class="retry-btn">
          Try Again
        </button>
      </div>
    </div>
  `;

  document.getElementById("retryBtn")?.addEventListener("click", () => {
    window.location.reload();
  });
};

const renderOverView = (xps, levels, audits) => {
const overview = document.getElementById("overview");

const dashboard = document.createElement("div");
dashboard.className = "dashboard-container";

  const total = audits.up + audits.down;
  const ratio = audits.up / total;
  const dash = 2 * Math.PI * 54; // circle length

  dashboard.innerHTML = `
    <!-- LEVEL -->
 <div class="card metric-card big-metric">
  <div class="card-title">Level</div>
  <div class="metric-value big-value">${levels}</div>
</div>

<div class="card metric-card big-metric">
  <div class="card-title">Total XP</div>
  <div class="metric-value big-value">${formatXP(xps)}</div>
</div>


    <!-- AUDIT CHART -->
    <div class="card metric-card">

      <svg width="180" height="180" viewBox="0 0 120 120">
        <!-- background circle -->
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#1e2538"
          stroke-width="10"
          fill="none"
        />

     <!-- DOWN (red base) -->
<circle
  cx="60"
  cy="60"
  r="54"
  stroke="var(--accent-magenta)"
  stroke-width="10"
  fill="none"
  stroke-dasharray="${dash}"
  stroke-dashoffset="0"
>
  <title>Down: ${formatXP(audits.down)}</title>
</circle>

<!-- UP (green progress) -->
<circle
  cx="60"
  cy="60"
  r="54"
  stroke="var(--accent-teal)"
  stroke-width="10"
  fill="none"
  stroke-dasharray="${dash}"
  stroke-dashoffset="${dash * (1 - ratio)}"
  stroke-linecap="round"
  transform="rotate(-90 60 60)"
>
  <title>Up: ${formatXP(audits.up)}</title>
</circle>

        <text
          x="60"
          y="63"
          text-anchor="middle"
          font-size="14"
          fill="white"
          font-weight="600"
        >
         Ratio

          ${audits.ration.toFixed(2)}
        </text>
      </svg>

      <div class="metric-trend">
        <span class="trend-up">● Up: ${formatXP(audits.up)}</span><br/>
        <span class="trend-down">● Down: ${formatXP(audits.down)}</span>
      </div>
    </div>
  `;

  overview.appendChild(dashboard);
};
function formatXP(value) {
  if (value >= 1000000) return (value / 1000000).toFixed(2) + " MB";
  if (value >= 1000) return (value / 1000).toFixed(2) + " kB";
  return value + " B";
}

// Helper to clean up data and pick top value
const formatSkills = (skills) => {
  const radar1Keys = ["prog", "tcp", "algo", "game", "ai", "stats", "back", "front", "devops"];
  const radar2Keys = ["go", "js", "html", "css", "unix", "docker", "sql", "git"];

  const topValues = {};
  skills.forEach(item => {
    let name = item.type.replace("skill_", "").toLowerCase();
    if (name === "front-end") name = "front";
    if (name === "back-end") name = "back";
    if (name === "sys-admin") name = "devops";
    topValues[name] = Math.max(topValues[name] || 0, item.amount);
  });

  const mapToRadarStructure = (radarKeys) => {
    return radarKeys.map(key => ({
      axis: key.charAt(0).toUpperCase() + key.slice(1),
      value: topValues[key] || 0
    }));
  };

  return {
    radar1: mapToRadarStructure(radar1Keys),
    radar2: mapToRadarStructure(radar2Keys)
  };
};




/**
 * Generates an SVG string based on radar data config
 */

const generateRadarSVG = (data, options = {}) => {
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

// Injection function targeting your dynamic dashboard element
const renderSkillsRadar = (skills) => {
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

/*
 projects:{
 name:name_project.name,
 team_members:members_aggregate.team.userLogin
 xps:xp_per_project.transactions[0].amount
 total
 }
  
  
 */
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

function formatProjects(projects) {
  return projects.map((project) => ({
    name: project.name_project?.name || "",
    team_members: project.members_aggregate?.team?.map(
      (member) => member.userLogin
    ) || [],
    xps: project.xp_per_project?.transactions?.[0]?.amount || 0,
    total: project.members_aggregate?.total_members?.count || 0,
  }));
}





//get the data from apis graphQL
//render the hero section have the issential data like [profile overview name,nickname,profile avatar]
//total xp,audit ration and level

//2-section 2 have the progress 
//3-section have the projects u finish
//4-the skills
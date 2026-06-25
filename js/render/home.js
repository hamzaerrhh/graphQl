import { homePage } from "../pages/home.js";
import { getData } from "../api/query.js";


const extractData = async () => {
  try {
    const data = await getData();
    console.log("the data",data)
        console.log("user",data?.user?.[0].success.aggregate.count)

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
};

    return stuctData
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
};

export const renderHome = async (root) => {
  root.innerHTML = "";
  root.innerHTML = homePage;

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  });

  const userData = await extractData();
  const auditData={
  up:userData.totalUp,
  down:userData.totalDown,
  ration:userData.auditRatio,
  succed:userData.success,
  failed:userData.failed
}

  console.log(userData);

if (!userData) {
  return renderNoData(root);
}
//render the headers
renderHeader(userData.attrs,userData.login,userData.cohort)
//render overview show this data 

renderOverView(userData.xp,userData.level,auditData)

  // Example
  console.log("Login:", userData.login);
  console.log("Level:", userData.level);
  console.log("XP:", userData.xp);
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
    console.log(cohortNameId)
        cohortNameId.textContent = `${cohort || ""}`
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
  const container = document.querySelector(".ui-root");

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

  container.appendChild(dashboard);
};
function formatXP(value) {
  if (value >= 1000000) return (value / 1000000).toFixed(2) + " MB";
  if (value >= 1000) return (value / 1000).toFixed(2) + " kB";
  return value + " B";
}




//get the data from apis graphQL
//render the hero section have the issential data like [profile overview name,nickname,profile avatar]
//total xp,audit ration and level

//2-section 2 have the progress 
//3-section have the projects u finish
//4-the skills
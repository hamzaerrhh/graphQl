import { homePage } from "../pages/home.js";
import { renderOverView } from "./overView.js";
import { renderSkillsRadar } from "./radar-skills.js";
import { renderGrades } from "./grades.js";
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
  ratio:userData.auditRatio,
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










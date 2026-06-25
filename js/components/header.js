export const header = `
<header class="dashboard-header">
    <div class="header-glow"></div>

    <div class="header-left">
        <div class="avatar-wrapper">
            <img
                id="headerAvatar"
                class="header-avatar"
                src=""
                alt="User Avatar"
            />
        </div>

        <div class="welcome-section">
            <h2>
                Welcome back,
                <span class="username" id="headerUsername">User</span>
            </h2>
            <p id="headerLocation">
                city, country
            </p>
        </div>
    </div>

    <div class="header-right">
        <div class="progress-chip">
            <span class="progress-dot"></span>
            <div id="cohort_name">

            c_name
            </div>
        </div>

        <button class="logout-btn" id="logoutBtn">
            Logout
        </button>
    </div>
</header>
`;
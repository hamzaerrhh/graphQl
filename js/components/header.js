export const header = `
<header class="dashboard-header">
    <div class="header-glow"></div>

    <div class="header-left">
        <div class="logo-badge">
            <span>⚡</span>
        </div>

        <div class="welcome-section">
            <h2>
                Welcome back,
                <span class="username" id="headerUsername">Username</span>
            </h2>
            <p>Track your progress and stay ahead.</p>
        </div>
    </div>

    <div class="header-right">
        <div class="progress-chip">
            <span class="progress-dot"></span>
            Progress Active
        </div>

        <button class="logout-btn" id="logoutBtn">
            Logout
        </button>
    </div>
</header>
`;
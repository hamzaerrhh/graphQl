export const loginPage=`  <div class="login-main-container">

    <div class="glow-bg cyan-glow"></div>
    <div class="glow-bg magenta-glow"></div>

    <div class="login-container">
        <div class="login-header">
            <h1>Welcome Back</h1>
            <p>Access your student analytics profile</p>
        </div>

        <form id="loginForm" action="#" method="POST">
            <div class="form-group">
                <label for="username">Username or Email</label>
                <input type="text" id="username" name="username" placeholder="e.g., username" required autocomplete="username">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required autocomplete="current-password">
            </div>

            <div class="form-options">
             
                <a href="#" class="forgot-pass">Forgot Password?</a>
            </div>

            <button type="submit" class="btn-submit">Sign In</button>
        </form>

        <div class="login-footer">
            Don't have an account? <a href="#">Request Access</a>
        </div>
    </div>
    </div>
`
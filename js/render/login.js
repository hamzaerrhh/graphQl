import { login } from "../api/login.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        login: document.getElementById("username").value,
        password: document.getElementById("password").value,
    };

    const [status, result] = await login(data);

    if (status === 200) {
       localStorage.setItem("token", result)
        alert("Login Success!");
        console.log(result);
    } else {
        alert("Login Failed!");
        console.log(result);
    }
});
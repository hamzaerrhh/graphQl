import { login } from "../api/auth.js";
import { loginUi } from "../components/login.js";

export const renderLogin=(root)=>{
root.innerHTML=""
root.innerHTML=loginUi

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
    window.location.href = "/";
    } else {
        alert("Login Failed!");
        console.log(result);
    }
});


}






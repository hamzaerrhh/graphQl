import { login } from "../api/auth.js";
import { loginPage } from "../pages/login.js";
import { toast } from "./toast.js";
export const renderLogin=(root)=>{
root.innerHTML=""
root.innerHTML=loginPage

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
   toast({
    type: "success",
    message: "Login successful!"
});

setTimeout(() => {
    window.location.href = "/";
}, 250);
    } else {
        toast({
    type: "error",
    message: "Invalid email or password."
});
        console.log(result);
    }
});


}






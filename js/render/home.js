import { homePage } from "../pages/home.js"
export const renderHome=(root)=>{


    root.innerHTML=''
    root.innerHTML=homePage
//add a logout event listiner
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");

    // redirect to home page
    window.location.href = "/";
});



}
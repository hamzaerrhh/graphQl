import { renderLogin } from "./render/login.js";
import { renderHome } from "./render/home.js";
import { isAuthentificated } from "./api/auth.js";

export const renderApp=async ()=>{  
const root = document.querySelector('.ui-root')
const isAuth= await isAuthentificated()
const userID=isAuth?.userData?.user[0].id

isAuth.isLogged ?renderHome(root,userID) : renderLogin(root)
}

 await renderApp()

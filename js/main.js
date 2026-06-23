import { renderLogin } from "./render/login.js";
import { renderHome } from "./render/home.js";
import { isAuthentificated } from "./api/auth.js";

export const renderApp=async ()=>{
        const root = document.querySelector('.ui-root')

const isAuth= await isAuthentificated()
console.log(isAuth)
isAuth.isLogged ?renderHome(root) : renderLogin(root)

}

 await renderApp()

            
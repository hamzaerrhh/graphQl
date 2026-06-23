import { renderLogin } from "./render/login.js";
import { renderHome } from "./render/home.js";
const isAuth=false

    const root = document.querySelector('.ui-root')

isAuth ? renderHome(root) : renderLogin(root)
 
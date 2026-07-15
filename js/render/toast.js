export function toast({
    type = "info",
    message = "",
    duration = 3000
} = {}) {

    const container = document.querySelector(".toast-container");

    const element = document.createElement("div");

    element.className = `toast ${type}`;
    element.textContent = message;

    container.appendChild(element);

    setTimeout(() => {
        element.classList.add("hide");

        element.addEventListener("animationend", () => {
            element.remove();
        });
    }, duration);
}
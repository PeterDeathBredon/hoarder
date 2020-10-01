import "./app/app.ts"
import "./app/styles.sass"

window.addEventListener("load", () => {
    const app = document.getElementById("app");
    const headline = document.getElementById("animate");

    app.addEventListener("sync-error", () => {
        console.log("sync error");
    });
    app.addEventListener("sync-changed", () => {
        headline.classList.remove("creepy");
        void headline.offsetWidth;
        headline.classList.add("creepy");
        console.log("sync changed");
    });
})


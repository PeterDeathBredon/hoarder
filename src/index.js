import "./app/app.ts"
import "./app/styles.sass"
import "./assets/favicon.ico"
// import "./sw.js"

// import "./manifest.webmanifest"


window.addEventListener("load", () => {

    addServiceWorker();
    installSyncEvents();

})

async function addServiceWorker() {
  try {
    await(navigator.serviceWorker.register('./sw.js'));
  }
  catch(e) {
      alert(e);
      // alert(e);
  }
}

function installSyncEvents() {
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
}


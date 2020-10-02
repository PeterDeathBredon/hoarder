import "./app/app.ts"
import "./app/styles.sass"
import "./assets/favicon.ico"
import {registerRoutes} from "./app/routing";

// import "./sw.js"

// import "./manifest.webmanifest"


window.addEventListener("load", () => {

    configureRouter();
    addServiceWorker();

})

function configureRouter() {
    let el = document.getElementById("app-container");
    console.log("app-container: ", el);
    registerRoutes(el);
}

async function addServiceWorker() {
  try {
    await(navigator.serviceWorker.register('./sw.js'));
  }
  catch(e) {
      alert(e);
      // alert(e);
  }
}



import "./app/list-view.ts"
import "./app/app.ts"
import "./app/component-undefined-route.ts"
import "./app/styles.sass"
import "./assets/favicon.ico"
import {registerRoutes} from "./app/routing";

// import "./sw.js"

// import "./manifest.webmanifest"


window.addEventListener("load", () => {

    configureRouter();
    console.log(window.location.toString());
    if (!window.location.toString().startsWith("https://192.168"))
        addServiceWorker();

})

function configureRouter() {
    let el = document.getElementById("app-container");
    if (el === null) {
        alert("undefined element app-container!");
    } else {
        registerRoutes(el);
    }
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



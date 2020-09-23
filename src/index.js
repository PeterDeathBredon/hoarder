import {app} from './app/app.ts'
import "./app/styles.sass"

window.addEventListener('load', () => {
    app();
    console.log("sadfsadf");
    console.log("Do we have jquery index.js?");
    console.log($("body"));
});
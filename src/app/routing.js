import {Router} from '@vaadin/router'
import {developMode} from "./lib/const.js";

export let router = null;

export function registerRoutes(appContainer) {
    router = new Router(appContainer);
    console.log("setting routes ...")
    router.setRoutes([
        {path: '/', component: 'hoarder-app'},
        {path: '/index.html', component: 'hoarder-app'},
        {path: '/view/:id', component: 'list-view'},
        {path: '/attachmentsfor/:id', component: 'attachment-view'},
        {path: '(.*)', component: 'no-route'}
    ]).then(() => {
        console.log("rerouting...")
        if (developMode) {
            setTimeout(() => {
                Router.go("/attachmentsfor/1602674359304-wu7l7v13SsQs2syy9ZzD1");
            }, 100);
        }
    });
}
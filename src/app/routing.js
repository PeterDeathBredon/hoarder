import {Router} from '@vaadin/router'

let router = null;

export function registerRoutes(appContainer) {
    router = new Router(appContainer);
    router.setRoutes([
        {path: '/', component: 'hoarder-app'},
        {path: '', component: 'hoarder-app'},
        {path: '(.*)', component: 'no-route'}
    ]);
}
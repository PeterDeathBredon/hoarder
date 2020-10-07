import {Router} from '@vaadin/router'

export let router = null;

export function registerRoutes(appContainer) {
    router = new Router(appContainer);
    router.setRoutes([
        {path: '/', component: 'hoarder-app'},
        {path: '/index.html', component: 'hoarder-app'},
        {path: '/view/:id', component: 'list-view'},
        {path: '/attachmentsfor/:id', component: 'attachment-view'},
        {path: '(.*)', component: 'no-route'}
    ]);
}
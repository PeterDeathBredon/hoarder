import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import appStyle from './component_app.sass';
// @ts-ignore
import {ToDo, TYPE_TODO} from './store/todo.ts';
import './todolist.ts'
import 'wired-input';
// @ts-ignore
import {store} from './store/store.ts';
import {connect} from 'pwa-helpers/connect-mixin';
// @ts-ignore
import {addTodo, initList, toggleFilter} from './store/actions.ts'
// @ts-ignore
import {db, remoteCouch, sync} from './store/db.ts'
// @ts-ignore
import {State} from './store/reducer.ts'


@customElement('list-view')
class ListView extends connect(store)(LitElement) {
    state: State;
    db_initialized: boolean = false;
    sync_status: string = '';
    showSyncButton: boolean = false;

    constructor() {
        super();
        this._init();
    }

    static get properties() {
        return {
            state: {type: State},
            sync_status: {type: String},
            db_initialized: {type: Boolean},
            showSyncButton: {type: Boolean}
        }
    }

    static get styles() {
        return appStyle
    }

    _get_todos(rows: [{doc: Object}]) {
        return rows
            .map(row => {return {... new ToDo(), ...row.doc}})
            .filter(row => row.type==TYPE_TODO);
    }

    _init() {
        db.allDocs({include_docs: true})
            .then((response: any) => {
                let todos = this._get_todos(response.rows)
                store.dispatch(initList(todos));
                this.sync_status = 'collaborating...';
                sync(remoteCouch,
                    this._sync_changed.bind(this),
                    this._sync_error.bind(this));
                this.db_initialized = true;
            })
            .catch((response: any) => {
                console.log(response);
            });
    }

    _reload() {
        console.log('reloading...');
        let inEditMode = this.state.todos.filter((todo: ToDo) => todo.inEditMode);
        if (inEditMode.length > 0)
            return

        db.allDocs({include_docs: true})
            .then((response: any) => {
                let todos = this._get_todos(response.rows)
                store.dispatch(initList(todos));
            })
            .catch((response: any) => {
                console.log('error fetching all docs:', response);
            });
    }

    _sync_error(err: {}) {
        this.sync_status = 'alone for good.';
        console.log("error synching", err);
        this.dispatchEvent(new CustomEvent("sync-error", {bubbles: true, composed: true, detail: err}));
    }

    _sync_changed(err: {}) {
        console.log("data has changed remotely.", this);
        this.dispatchEvent(new CustomEvent("sync-changed", {bubbles: true, composed: true, detail: err}));
        this._reload();
    }

    stateChanged(state: State) {
        this.state = state;
    }

    _addTodo() {
        let todo = new ToDo("", false, true);
        store.dispatch(addTodo(todo));
        // db.put(todo)
        //     .then((response: Object) => {
        //         store.dispatch(addTodo(todo));
        //     })
        //     .catch((err: Object) => {
        //         console.log(err);
        //     });
    }

    _filter() {
        store.dispatch(toggleFilter());
    }

    _test() {
        db.allDocs({include_docs: true}).then((response: any) => {
            console.log(response);
        }).catch((response: any) => {
            console.log(response);
        });
    }

    render() {
        console.log("rendering list-view.ts");
        let filterButtonStyle = this.state.showFinished ?
            "--wired-fab-bg-color: var(--hoarder-show-finished-color)" :
            "--wired-fab-bg-color: var(--hoarder-omit-finished-color)";
        // let filterButtonStyle = `--wired-fab-bg-color: red`;
        return html`
                    <div class="center-div">
                        ${this.db_initialized
            ? html`
                                <todo-list .showFinished=${this.state.showFinished} .todos=${this.state.todos} >    
                                </todo-list>
                                <div class="button-list">
                                    <wired-fab id="add-button" 
                                        @click=${this._addTodo}><i class="material-icons">add_shopping_cart</i>
                                    </wired-fab>
                                    <wired-fab id="sync-button" 
                                        @click=${this._sync} style="${this.showSyncButton ? '--wired-fab-bg-color: #ff0000' : 'visibility:hidden; --wired-fab-bg-color: #ff0000'}"><i class="material-icons">sync</i>
                                    </wired-fab>
                                    <wired-fab id="cleanup-button" 
                                        @click=${this._filter} style="${filterButtonStyle}"><i class="material-icons">rule</i>
                                    </wired-fab>
                                </div>`
            : html`<div class="loading">let's see what we need ...</div>`}
                    </div>
                    `
    }

    onAfterEnter(location: any, commands:any , router: any) {
        console.log("OnAfterEnter", location, commands, router);
        this._installSyncEvents();
    }

    _installSyncEvents() {
        const appContainer = document.getElementsByTagName("hoarder-app")[0];
        appContainer.addEventListener("sync-error", () => {
            console.log("sync error");
            this._heartbeat();
            this.showSyncButton = true;
        });
        appContainer.addEventListener("sync-changed", () => {
            console.log("sync changed");
            this._heartbeat();
        });
    }

    _heartbeat() {
        const headline = document.getElementById("animate");
        headline.classList.remove("creepy");
        void headline.offsetWidth;
        headline.classList.add("creepy");
    }

    _sync() {
        this.showSyncButton = false;
        this._init();
    }

}


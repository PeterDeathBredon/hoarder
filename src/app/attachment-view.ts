import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import componentStyle from './component-todo-list.sass';
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
// @ts-ignore
import {router} from './routing.js'
import {Router} from "@vaadin/router";
// @ts-ignore
import 'wired-divider';


@customElement('attachment-view')
class AttachmentView extends connect(store)(LitElement) {
    db_initialized: boolean = false;
    sync_status: string = '';
    showSyncButton: boolean = false;
    todoTitle: string;
    todoId: string;
    todoListId: string;
    location: Object;

    static get properties() {
        return {
            sync_status: {type: String},
            db_initialized: {type: Boolean},
            showSyncButton: {type: Boolean},
            attachments: {type: Array},
            todoTitle: {type: String}
        }
    }

    static get styles() {
        return [appStyle, componentStyle];
    }

    onAfterEnter(location: any, commands:any , router: any) {
        try {
            this.location = router.location;
            this.todoId = router.location.params.id;
        } catch (err) {
            console.log(err);
        }
        this._init();
        this._installSyncEvents();
    }

    _init() {
        db.get(this.todoId)
            .then((response: any) => {
            this.todoTitle = (<ToDo>response).text;
            this.todoListId = (<ToDo>response).idList;

            console.log("todo title is", this.todoTitle);
        })

        console.log("todoId is", this.todoId);

        db.query('todos', {key: [TYPE_TODO, this.todoId], include_docs: true})
            .then((response: any) => {
                // let todos = response.rows.map((row: any) => {return {... new ToDo(), ...row.doc}})
                // store.dispatch(initList(todos));
                // sync(remoteCouch,
                //     this._sync_changed.bind(this),
                //     this._sync_error.bind(this));
                this.db_initialized = true;
                console.log("db initialized!");
            })
            .catch((response: any) => {
                console.log(response);
            });
    }

    _reload() {
        console.log('reloading...');

        // db.query('todos', {key: [TYPE_TODO, this.listId], include_docs: true})
        //     .then((response: any) => {
        //         let todos = response.rows.map((row: any) => {return {... new ToDo(), ...row.doc}})
        //         store.dispatch(initList(todos));
        //     })
        //     .catch((response: any) => {
        //         console.log('error fetching all docs:', response);
        //     });
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
        const todos = state.todos.filter((todo : ToDo) => {
            todo._id = this.todoId
        });
        if (todos.length == 1) {
            this.todoTitle = todos[0].text;
        }
    }

    _back() {
        Router.go(`/view/${this.todoListId}`);
    }

    render() {
        console.log("rendering attachment-view.ts");
        return html`
                    <div class="center-div">
                        
                        ${this.db_initialized
            ? html`
                                <div class="list">
                                    <div class="heading-container">
                                        <wired-divider></wired-divider>
                                        <div class="icon-with-text">
                                          <i @click="${this._back}" class="material-icons">arrow_back_ios</i>
                                          <div class="list-title">${this.todoTitle}</div>
                                        </div>
                                        <wired-divider style="top: 2em"></wired-divider>
                                    </div>
                                </div>
                                <div id="end-of-list"></div>
                                <div id="after-end-of-list"></div>
                                             
                                <div class="button-list">
                                    <wired-fab id="add-button" 
                                        ><i class="material-icons">add_a_photo</i>
                                    </wired-fab>
                                    <wired-fab id="sync-button" 
                                        @click=${this._sync} style="${this.showSyncButton ? '--wired-fab-bg-color: #ff0000' : 'visibility:hidden; --wired-fab-bg-color: #ff0000'}"><i class="material-icons">sync</i>
                                    </wired-fab>
                                </div>`
            : html`<div class="loading">fetching attachments ...</div>`}
                    </div>
                    `
    }

    _installSyncEvents() {
        const appContainer = document.getElementsByTagName("attachment-view")[0];
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


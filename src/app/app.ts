import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import appStyle from './component_app.sass';
// @ts-ignore
import {List, TYPE_LIST} from './store/list.ts';
import 'wired-input';
import 'wired-fab'
// @ts-ignore
import {store} from './store/store.ts';
import {connect} from 'pwa-helpers/connect-mixin';
// @ts-ignore
import {addList, initApp, editList} from './store/actions.ts'
// @ts-ignore
import {db, remoteCouch, sync, init_db} from './store/db.ts'
// @ts-ignore
import {State} from './store/reducer.ts'
import {Router} from "@vaadin/router";
import "./list-view.ts"
// @ts-ignore
import {developMode} from './lib/const.js'
import {TYPE_TODO} from "./store/todo";

(() => {
    console.log("development mode is " + developMode.toString());
})();

@customElement('hoarder-app')
class HoarderApp extends connect(store)(LitElement) {
    state: State;
    db_initialized: boolean = false;
    sync_status: string = '';
    showSyncButton: Boolean = false;
    editing: string = "";
    _pouchDbSync: any = undefined;
    upForDeletion: string = "";

    constructor() {
        super();
        console.log("HoarderApp.constructor");
        this._init();
    }

    static get properties() {
        return {
            state: {type: State},
            sync_status: {type: String},
            db_initialized: {type: Boolean},
            showSyncButton: {type: Boolean},
            upForDeletion: {type: Boolean},
            editing: {type: String}
        }
    }

    static get styles() {
        return appStyle
    }


    disconnectedCallback() {
        if (this._pouchDbSync) this._pouchDbSync.cancel();
        super.disconnectedCallback();
    }

    _init() {
        init_db()
            .then(() => {
                console.log("db initialized");
                db.query('lists',{key: [TYPE_LIST, false], include_docs: true})
                    .then((response: any) => {
                        let lists = response.rows.map((row:any) => row.doc);
                        if (lists.length > 0) {
                            store.dispatch(initApp(lists));
                        } else {
                            this._addDefaultList()
                                .then(() => {
                                    console.log("added default list")
                                })
                                .catch(e => {
                                    console.log("error adding default list", e);
                                });
                        }
                        this._pouchDbSync = sync(remoteCouch,
                            this._sync_changed.bind(this),
                            this._sync_error.bind(this),
                            this._sync_complete.bind(this),
                            this._sync_active.bind(this));

                        this.dispatchEvent(new CustomEvent("sync-started",
                            {bubbles: true, composed: true}));

                        this.db_initialized = true;
                        // Router.go("/view/1601816431143-YNvZSKq-iEHLRXS3y2Qgu");
                    })
            })
            .catch((response: any) => {
                console.log(response);
            });
    }

    _reload() {
        console.log('reloading...');
        // let inEditMode = this.state.todos.filter((todo: ToDo) => todo.inEditMode);
        // if (inEditMode.length > 0)
        //     return

        db.query('lists',{key: [TYPE_LIST, false], include_docs: true})
            .then((response: any) => {
                let lists = response.rows.map((row:any) => row.doc);
                store.dispatch(initApp(lists));
            })
            .catch((response: any) => {
                console.log('error fetching all docs:', response);
            });
    }

    _sync_error(err: {}) {
        this.sync_status = 'alone for good.';
        console.log("error syncing", err);
        this.dispatchEvent(new CustomEvent("sync-error", {bubbles: true, composed: true, detail: err}));
        this.showSyncButton = true;
    }

    _sync_changed(info: {}) {
        console.log("data has changed remotely.", this);
        this.dispatchEvent(new CustomEvent("sync-changed", {bubbles: true, composed: true, detail: info}));
        this._reload();
    }

    _sync_complete(info: {}) {
        if (this._pouchDbSync) this._pouchDbSync.cancel();
        console.log("firing sync complete");
        this.dispatchEvent(new CustomEvent("sync-complete", {bubbles: true, composed: true, detail: info}));
        this._pouchDbSync = sync(remoteCouch,
            this._sync_changed.bind(this),
            this._sync_error.bind(this)
            );
    }

    _sync_active(info: {}) {
        console.log("sync active", this);
        this.dispatchEvent(new CustomEvent("sync-active", {bubbles: true, composed: true, detail: info}));
    }

    stateChanged(state: State) {
        console.log("app.state_changed triggered")
        this.state = state;
    }

    async _addDefaultList() {
        return new Promise(resolve => {
            let list = new List("groceries");
            list._id = "default";
            db.put(list)
                .then(() => {
                    store.dispatch(addList(list));
                    resolve();
                })
                .catch((err: Object) => {
                    console.log(err);
                });
        });
    }

    _addList() {

        let list = new List("new List");
        console.log("trying to add List", list);
        db.put(list)
            .then(() => {
                store.dispatch(addList(list));
            })
            .catch((err: Object) => {
                console.log(err);
            });
    }

    _getElementListId(element: HTMLElement) {
        let listId: string = "";
        try {
            // @ts-ignore
            listId = element["list-id"];
            // @ts-ignore
            listId = listId || element.getElementsByTagName("i")[0]["list-id"]
        } catch (e){
            console.log(e)
        }
        return listId;
    }

    _editList(e: Event) {
        e.stopPropagation();
        if (this.upForDeletion)
            this.upForDeletion = "";
        else {
            this.editing = this._getElementListId(<HTMLElement>e.target);
            console.log(this.editing);
        }
    }
    _getListById(id: string) {
        return this.state.lists.find((l:List) => l._id === id)
    }


    _removeList(e: Event) {
        const removeId = this._getElementListId(<HTMLElement>e.target);
        e.stopPropagation();
        if (removeId !== this.upForDeletion) {
            this.upForDeletion = removeId;
            console.log(`List ${this.upForDeletion} is up for deletion.`);
        } else {
            const list = this._getListById(removeId);
            const updatedList = {...list};
            updatedList.finished = true;
            db.put(updatedList).then(() => {
                this.upForDeletion = "";
                store.dispatch(editList(updatedList));
            })
                .catch(() => {
                    alert("There was trouble saving this item.");
                })
        }
    }

    _cancelDeletion(e: Event) {
        e.stopPropagation();
        if (this.upForDeletion) {
            setTimeout(() => this.upForDeletion = "", 200);
        }
    }

    _gotoList(e: Event) {
        console.log(this);
        let inputs = Array.from(this.shadowRoot.querySelectorAll("input"));
        if (inputs.length === 0 && this.upForDeletion === "") {
            // console.log("inputs", inputs)
            // console.log("target", e.target);
            // console.log("current target", e.currentTarget);
            // @ts-ignore
            const listId = e.currentTarget["list-id"];
            console.log(listId);
            Router.go(`/view/${listId}`);
        }
        if (this.upForDeletion)
            this.upForDeletion = "";
        e.stopPropagation();
    }

    _update_list_name(e: Event) {
        const newTitle = (<HTMLInputElement>e.target).value;
        const list = this.state.lists.filter((l:List) => l._id === this.editing)[0]
        const updatedList = {...list};
        if (updatedList.text !== newTitle) {
            updatedList.text = newTitle;
            db.put(updatedList).then(() => {
                store.dispatch(editList(updatedList));
            })
            .catch(() => {
                alert("There was trouble saving this item.");
            })
        }
        setTimeout(() => {
            this.editing = "";
            console.log("editing reset.")
        }, 100);
    }

    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
        // if (developMode) {
        //     console.log("rerouting...")
        //     Router.go("/attachmentsfor/1602674359304-wu7l7v13SsQs2syy9ZzD1");
        // }
    }

    protected updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (this.editing !== "") {
            this.shadowRoot.getElementById("edit-list").focus();
        }

    }

    render() {
        console.log("rendering app.ts");
        return html`${developMode
                    ? html`<div class="development">development mode</div>`
                    : html``}
                    <div class="center-div" @click="${this._cancelDeletion}">
                        ${this.db_initialized
                        ? html`
                            <div class="todo-lists-list">
                              ${this.state.lists.map((list:List) => html`
                                <div @click=${this._gotoList} 
                                     class="list-item 
                                            ${this.upForDeletion === list._id?'about-to-go':''}" 
                                     .list-id="${list._id}">
                                    <i class="material-icons">format_list_bulleted</i>
                                    ${this.editing === list._id 
                                        ? html`<input @blur=${this._update_list_name} id="edit-list" type="text" 
                                                value="${list.text}"/>`
                                        : html`<span>${list.text}</span>
                                    <button @click=${this._editList}" class="edit-list-button">
                                        <i class="material-icons" .list-id="${list._id}">edit</i>
                                    </button>
                                    <button @click=${this._removeList}" @blur=${this._cancelDeletion}" 
                                            class="${this.upForDeletion === list._id?'bt-kill':'edit-list-button'}">
                                        <i class="material-icons" .list-id="${list._id}">delete</i>
                                    </button>`}
                                    
                                </div>`)} 
                                <div id="end-of-list"></div>
                            </div>
                                
                            <div class="button-list">
                                <wired-fab id="add-button" 
                                    @click=${this._addList}><i class="material-icons">playlist_add</i>
                                </wired-fab>
                                <wired-fab id="sync-button" 
                                    @click=${this._sync} style="${this.showSyncButton ? '--wired-fab-bg-color: #ff0000' : 'visibility:hidden; --wired-fab-bg-color: #ff0000'}"><i class="material-icons">sync</i>
                                </wired-fab>
                            </div>`
                        : html`<div class="loading">fetching lists ...</div>`}
                    </div>
                    `
    }

    onAfterEnter(location: any, commands: any, router: any) {
        console.log("OnAfterEnter", location, commands, router);
        // this._installSyncEvents();
    }

    _sync() {
        this.showSyncButton = false;
        this._init();
    }

}


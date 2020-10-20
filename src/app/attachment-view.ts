import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import componentStyle from './component-todo-list.sass';
// @ts-ignore
import appStyle from './component_app.sass';
// @ts-ignore
import {ToDo, TYPE_TODO} from './store/todo.ts';
import 'wired-input';
import './attachment-item.ts'

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
import {imgSrcToBlob} from "blob-util";
import {nanoid} from "nanoid";

interface IIndexableObject {
    [key: string] : any;
}

@customElement('attachment-view')
class AttachmentView extends connect(store)(LitElement) {
    db_initialized: boolean = false;
    sync_status: string = '';
    showSyncButton: boolean = false;
    todoTitle: string;
    todoId: string;
    todoListId: string;
    location: Object;
    attachments: IIndexableObject = {};
    markedId: String = "";

    static get properties() {
        return {
            sync_status: {type: String},
            db_initialized: {type: Boolean},
            showSyncButton: {type: Boolean},
            attachments: {type: Array},
            todoTitle: {type: String},
            markedId: {type: String}
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
                const todo: ToDo = response;
                this.todoTitle = (<ToDo>response).text;
                this.todoListId = (<ToDo>response).idList;
                if ("_attachments" in todo) {
                    this.attachments = todo._attachments;
                }

            console.log("todoId is", this.todoId);
            console.log("attachments: ", this.attachments);
            this.db_initialized = true;
            console.log("db initialized!");
        })
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

    async _addFileToDb(file: File) {
        const doc = await db.get(this.todoId);
        const attachmentId = nanoid();
        this.attachments[attachmentId] = await db.putAttachment(doc._id, attachmentId, doc._rev, file, file.type);
        this.attachments = {...this.attachments}
    }


    _addFile(e: Event) {
        const elFile = <HTMLInputElement>this.shadowRoot.querySelector("#add-file");
        console.log(`new file ${elFile.files[0].name}`);
        const file = elFile.files[0];
        this._addFileToDb(file)
            .then(() => {
                console.log(`added image ${file.name}`);
           })
            .catch((err) => {
                console.log(`Error adding file ${err}`);
            })
    }

    _triggerAddFile(e: Event) {
        const elFile = <HTMLInputElement> this.shadowRoot.querySelector("#add-file");
        elFile.click.bind(elFile)();
    }

    _markAttachment(e: CustomEvent) {
        console.log("marking ", e.detail);
        if (this.markedId === e.detail)
            this.markedId = ""
        else
            this.markedId = e.detail
    }

    async _deleteFileFromDb(attachmentId: string) {
        const doc = await db.get(this.todoId);
        if (attachmentId in doc._attachments) {
            return await db.removeAttachment(doc._id, attachmentId, doc._rev);
        } else {
            console.log("attachment not found", doc);
            return null;
        }
    }

    _deleteAttachment(e: CustomEvent) {
        console.log("deleting ", e.detail);
        const attachmentId = e.detail;
        this._deleteFileFromDb(attachmentId)
        .then( (result) => {
            if (result) {
                console.log(`File ${e.detail} deleted:`, result);
                delete this.attachments[attachmentId];
                this.attachments = {...this.attachments}
            }
        })
        .catch((err) => {
            console.log(`Error adding file ${err}`);
        })
    }

    _renderList() {
        return html`${(Object.keys(this.attachments).length ) > 0
            ? Object.keys(this.attachments).map((key: string) =>
                html`<attachment-item 
                        .todoId=${this.todoId}
                        .attachmentId=${key}
                        ?marked=${this.markedId === key}
                        @mark-attachment=${this._markAttachment}
                        @delete-attachment=${this._deleteAttachment}
                        >
                        
                    </attachment-item>`)
            : html`<div style="width: 100%"><p class="noimages">no images, yet.</p></div>`
        }`
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
                                ${this._renderList()}
                                <div id="end-of-list"></div>
                                <div id="after-end-of-list"></div>
                                             
                                <div class="button-list">
                                    <input type="file" id="add-file" accept="image/*" style="display:none"
                                           @change=${this._addFile}>
                                    <wired-fab id="add-button"   
                                           @click=${this._triggerAddFile}>
                                           <i class="material-icons">add_a_photo</i>
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


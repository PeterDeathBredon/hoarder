import {customElement, html, LitElement} from "lit-element"
// @ts-ignore
import {ToDo} from './store/todo.ts';
// @ts-ignore
import componentStyle from './component-todo-item.sass';
import 'wired-checkbox';
import 'wired-fab';
import 'wired-input';
// @ts-ignore
import {store} from './store/store.ts'
// @ts-ignore
import {changeTodo, deleteTodo} from './store/actions.ts'
// @ts-ignore
import {db} from './store/db.ts'
import {nanoid, random} from "nanoid";
import {Router} from "@vaadin/router";
// @ts-ignore
import {developMode} from './lib/const.js'


@customElement('todo-item')
class TodoItem extends LitElement {
    todo: ToDo;
    inEditMode: Boolean;
    private _instance_id: string;

    constructor() {
        super();
        this._instance_id = nanoid();
    }

    static get properties() {
        return {
            todo: {type: Object},
            inEditMode: {type: Boolean}
        }
    }

    static get styles() {
        // return appStyle;
        return componentStyle;
    }

    _removeTodo(e: Event) {
        console.log("todoitem._removeTodo");
        this.dispatchEvent(new CustomEvent("todo-item-deleted",
            {bubbles: true, composed: true, detail: this.todo}));
    }

    _changeTodoFinished(e: Event, todo: ToDo) {
        this.todo.finished = (<HTMLInputElement>e.target).checked;
        if (this.inEditMode)
            this._updateTodo();
        else
            this._notifyUpdate();
    }

    _editOk(e: Event) {
        this._updateTodo()
    }

    _updateTodo() {
        if (this.inEditMode) {
            // const edit = <HTMLInputElement>(this.shadowRoot.getElementById("edit-text"));
            const edit = <HTMLInputElement>(this.shadowRoot.querySelector("wired-input"));
            this.todo.text = edit.value;
            this._notifyUpdate();
        }
    }

    _notifyUpdate() {
        this.dispatchEvent(new CustomEvent("todo-item-changed",
            {bubbles: true, composed: true, detail: this.todo}));
    }

    _toEditMode(e: Event) {
        this.dispatchEvent(new CustomEvent("todo-item-edit",
            {bubbles: true, composed: true, detail: this.todo}));
    }


    _showAttachments() {
        Router.go(`/attachmentsfor/${this.todo._id}`);
    }

    updated() {
        console.log(`todoitem.updated: ${this.todo.text}`);
        const checkbox : HTMLInputElement = this.shadowRoot.querySelector("wired-checkbox");
        checkbox.checked = this.todo.finished;
        if (this.inEditMode) {
            // const el = <HTMLInputElement>(this.shadowRoot.getElementById("edit-text"));
            const el = <HTMLInputElement>(this.shadowRoot.querySelector("wired-input"));
            setTimeout(() => el.focus(), 0);
        }
    }

    render() {
        console.log(`rendering ${this.todo.text}: ${this.todo.finished}`);
        const valuestrEdit = html`<wired-input style="color: black;font-weight: bold" value="${this.todo.text}" 
                                               .autofocus></wired-input>
                         <wired-fab  
                            @click=${this._editOk}><i class="material-icons md-light">done</i>
                         </wired-fab>
                         <wired-fab
                            @click=${this._removeTodo}><i class="material-icons md-light">delete</i>
                         </wired-fab>
                        <wired-fab
                            @click=${this._showAttachments}><i class="material-icons md-light">attach_file</i>
                        </wired-fab>`
        const valuestrNormal = html`<span style="${this.todo.finished ? "color:var(--hoarder-color-checked)" : "color:var(--hoarder-color-unchecked)"}"
                        @click=${this._toEditMode}>${this.todo.text || 'whatchamacallit'}</span>`

        return (html`
            <div class="list-item"">
                ${developMode?html`<span>${this.inEditMode}</span>`:``}
                <wired-checkbox type="checkbox" 
                    .value=${this.todo.finished}
                    .checked=${this.todo.finished} 
                    style="${this.todo.finished ? "color:var(--hoarder-color-checked)" : "color:var(--hoarder-color-unchecked)"}"
                    @change=${(e: Event) => this._changeTodoFinished(<Event>e, this.todo)}  
                ></wired-checkbox>
                <div class="edit-and-buttons">
                    ${this.inEditMode ? valuestrEdit : valuestrNormal}
                    ${developMode?html`
                        <p style="color:white; font-family: Courier;font-size: 18px">
                            ${this.todo._id.substr(this.todo._id.length - 6)}
                        </p>
                        <p style="color:cornflowerblue; font-family: Courier;font-size: 18px">
                            ${this._instance_id.substr(this._instance_id.length - 6)}
                        </p>`:html``}
                </div>
                
            </div>
            `)
    }
}



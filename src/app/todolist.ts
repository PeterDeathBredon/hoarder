import {customElement, html, LitElement, PropertyValues} from 'lit-element';
// @ts-ignore
import componentStyle from './component-todo-list.sass';
// @ts-ignore
import {ToDo} from './store/todo.ts'
import './todoitem.ts'
import 'wired-divider';
import {Router} from "@vaadin/router";

@customElement('todo-list')
export class TodoList extends LitElement {

    todos: Array<ToDo>;
    showFinished: Boolean;
    listHeader: string = "";

    static get properties() {
        return {
            todos: {type: Array},
            listHeader: {type: String},
            showFinished: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.showFinished = false;
        this.listHeader = "None";
    }

    static get styles() {
        // return appStyle;
        return componentStyle;
    }

    _back() {
        Router.go("/");
    }


    render() {
        console.log(this.showFinished);
        const filteredTodos = this.todos.filter(todo => (this.showFinished && todo.finished) || !todo.finished);

        return html`
            <div class="list">
                <div class="heading-container">
                    <wired-divider></wired-divider>
                    <div class="icon-with-text">
                      <i @click="${this._back}" class="material-icons">arrow_back_ios</i><div class="list-title">${this.listHeader}</div>
                    </div>
                    <wired-divider style="top: 2em"></wired-divider>
                </div>
                ${(filteredTodos.length || 0) > 0  
                    ? filteredTodos.map(todo => html`<todo-item id="${todo._id}" .todo=${todo}></todo-item>`)
                    : html`<div style="width: 100%"><p style="text-align: center"><p>All is hoarded!</p></div>`
                }
                 
            </div>
            <div id="end-of-list"></div>
            <div id="after-end-of-list"></div>`
        ;
    }

    protected updated(_changedProperties: PropertyValues) {
        if (this.todos.length > 0 && this.todos[this.todos.length - 1].inEditMode === true) {
            const el = this.shadowRoot.getElementById("after-end-of-list");
            console.log("todo element:", el);
            el.scrollIntoView();
        }
        console.log("todolist updated");
        return super.updated(_changedProperties);
    }
}
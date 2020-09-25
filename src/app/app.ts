import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import appStyle from './component_app.sass';
// @ts-ignore
import {ToDo} from './structures/todo.ts';
import './todolist.ts'

@customElement('hoarder-app')
class App extends LitElement {
    todos: any[];

    constructor() {
        super();
        this.todos = [new ToDo("Gummy Stars"), new ToDo("Squishy Fish")];
    }

    static get properties() {
        return {
            todos: {type: Array}
        }
    }

    static get styles() {
        // return appStyle;
        return appStyle
    }

    _addTodo() {
        const input = <HTMLInputElement>this.shadowRoot.getElementById('addTodo');
        const text = input.value;
        input.value = "";
        this.todos = [...this.todos, new ToDo(text)];
    }

    _removeTodo(e: CustomEvent) {
        const todoToDel = e.detail;
        this.todos = this.todos.filter(todo => todo !== todoToDel);
    }

    _changeTodoFinished(e: CustomEvent) {
        const todo = e.detail.todo;
        const finished = e.detail.finished;
        todo.finished = finished;
        this.todos = [...this.todos];
    }

    render() {

        return html`
                    <div class="center-div">
                        <todo-list .todos=${this.todos} 
                            @change-todo-finished="${this._changeTodoFinished}" 
                            @remove-todo="${this._removeTodo}">    
                        </todo-list>
                        <input id="addTodo" type="text" /><button @click="${this._addTodo}">Add</button>} 
                    </div>
                    `
    }
}


import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import appStyle from './component_app.sass';
// @ts-ignore
import {ToDo} from './structures/todo.ts';
import './todolist.ts'
import 'wired-input';

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
        console.log("add todo");
        console.log("1", this.todos);
        let newTodos = [...this.todos]
        console.log("2", newTodos);
        newTodos.push(new ToDo("", false, true));
        this.todos = newTodos;
        console.log("3", this.todos);
    }

    _removeTodo(e: CustomEvent) {
        const todoToDel = e.detail;
        this.todos = this.todos.filter(todo => todo.id !== todoToDel.id);
    }

    _changeTodo(e: CustomEvent) {
        console.log("change todo");
        console.log(e.detail);
        const newTodo = e.detail.todo;
        const oldTodo = this.todos.filter(todo => todo.id === newTodo.id)[0];
        this.todos[this.todos.indexOf(oldTodo)] = {...newTodo}
        this.todos = [...this.todos];
        console.log(this.todos)
    }

    _filter() {
        this.todos = this.todos.filter(todo => !todo.finished);
    }

    render() {
        console.log("rendering app.ts");
        return html`
                    <div class="center-div">
                        <todo-list .todos=${this.todos} 
                            @change-todo="${this._changeTodo}" 
                            @remove-todo="${this._removeTodo}">    
                        </todo-list>
                        <div class="button-list">
                            <wired-fab id="add-button" 
                                @click=${this._addTodo}><i class="material-icons">add_shopping_cart</i>
                            </wired-fab>
                            <wired-fab id="cleanup-button" 
                                @click=${this._filter}><i class="material-icons">rule</i>
                            </wired-fab>
                        </div>
                    </div>
                    `
    }
}


import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import componentStyle from './component-todo-list.sass';
// @ts-ignore
import {ToDo} from './structures/todo.ts'
import './todoitem.ts'

@customElement('todo-list')
export class TodoList extends LitElement {

    todos: Array<ToDo>;
    showFinished: Boolean;

    static get properties() {
        return {
            todos: {type: Array},
            showFinished: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.showFinished = false;
    }

    static get styles() {
        // return appStyle;
        return componentStyle;
    }


    render() {
        console.log(this.showFinished);
        const filteredTodos = this.todos.filter(todo => (this.showFinished && todo.finished) || !todo.finished);

        return (filteredTodos.length || 0) > 0  ? html`
            <div class="list">
              ${filteredTodos.map(todo => html`<todo-item .todo=${todo}></todo-item>`)} 
            </div>
        ` : html`<p style="text-align: center">We\'re safe. We hoarded everything!<br>(Or is the list just empty?)</p>`;
    }
}
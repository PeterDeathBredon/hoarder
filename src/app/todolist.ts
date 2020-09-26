import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import componentStyle from './component-todo-list.sass';
// @ts-ignore
import {ToDo} from './structures/todo.ts'
import './todoitem.ts'

@customElement('todo-list')
class TodoList extends LitElement {

    todos: Array<ToDo>

    static get properties() {
        return {
            todos: {type: Array}
        }
    }

    static get styles() {
        // return appStyle;
        return componentStyle;
    }


    render() {

        return (this.todos.length || 0) ? html`
        <div class="list">
            ${this.todos.map(todo => html`
            <todo-item .todo=${todo} "></todo-item>`
        )}
        </div>
        ` : html`<p style="text-align: center">We\'re safe. We hoarded everything!<br>(Or is the list just empty?)</p>`;
    }
}
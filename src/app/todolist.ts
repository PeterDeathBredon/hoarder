import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import componentStyle from './component-todo-list.sass';
// @ts-ignore
import {ToDo} from './structures/todo.ts'
import 'wired-checkbox';


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

    _removeTodo(todoToDel : ToDo) {
        this.dispatchEvent(new CustomEvent('remove-todo', {detail: todoToDel}));
    }

    _changeTodoFinished(e: Event,  todo: ToDo) {
        const eventDetails = { todo, finished : (<HTMLInputElement>e.target).checked};
        this.dispatchEvent(new CustomEvent('change-todo-finished', {detail: eventDetails}));
    }

    render() {
        return this.todos ? html`
        <div class="list">
            ${this.todos.map(todo => html`
            <div class="list-item">
                <wired-checkbox 
                    .checked=${todo.finished}
                    style="${todo.finished ? "color:var(--hoarder-color-checked)" : "color:var(--hoarder-color-unchecked)"}"
                    @change=${(e: Event) => this._changeTodoFinished(<Event>e, todo)}
                >
                    ${todo.text}
                </wired-checkbox>
                <button @click=${() => this._removeTodo(todo)}>X</button>
            </div>
            `
        )}
        </div>
    ` : html`<p>We\'re safe. We hoarded everything! (Or is the list just empty?)</p>`;
    }
}
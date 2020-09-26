import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import appStyle from './component_app.sass';
// @ts-ignore
import {ToDo} from './structures/todo.ts';
import './todolist.ts'
import 'wired-input';
// @ts-ignore
import {store} from './store/store.ts';
import {connect} from 'pwa-helpers/connect-mixin';
// @ts-ignore
import {addTodo, changeTodo, deleteTodo} from './store/actions.ts'

@customElement('hoarder-app')
class App extends connect(store)(LitElement) {
    todos: Array<ToDo> = [];

    constructor() {
        super();
        this.todos = [new ToDo("Gummy Stars"), new ToDo("Squishy Fish")];
    }

    stateChanged(state: Array<ToDo>) {
        this.todos = state;
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
        store.dispatch(addTodo(new ToDo()));
    }

    _filter() {
        this.todos = this.todos.filter(todo => !todo.finished);
    }

    render() {
        console.log("rendering app.ts");
        return html`
                    <div class="center-div">
                        <todo-list .todos=${this.todos} >    
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


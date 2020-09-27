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
import {addTodo, changeTodo, deleteTodo, init} from './store/actions.ts'
// @ts-ignore
import {db} from './store/db.ts'



@customElement('hoarder-app')
class App extends connect(store)(LitElement) {
    todos: Array<ToDo> = [];
    db_initialized: boolean = false;

    constructor() {
        super();
        db.allDocs({include_docs: true})
            .then((response: { rows: any[]; }) => {
                let todos = response.rows.map(row => row.doc);
                store.dispatch(init(todos));
                this.db_initialized = true;
            })
            .catch((response: any) => {
                console.log(response);
            });
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
        let todo = new ToDo("",false,true);
        db.put(todo)
            .then((response: Object) => {
                store.dispatch(addTodo(todo));
            })
            .catch((err: Object) => {
                console.log(err);
            });
    }

    _filter() {
        this.todos = this.todos.filter(todo => !todo.finished);
    }

    _test() {
        db.allDocs({include_docs: true}).then((response: any) => {
            console.log(response);
        }).catch((response: any) => {
            console.log(response);
        });
    }

    render() {
        console.log("rendering app.ts");
        return html`
                    <div class="center-div">
                        ${this.db_initialized 
                            ? html`
                                <todo-list .todos=${this.todos} >    
                                </todo-list>
                                <div class="button-list">
                                    <wired-fab id="add-button" 
                                        @click=${this._addTodo}><i class="material-icons">add_shopping_cart</i>
                                    </wired-fab>
                                    <wired-fab id="cleanup-button" 
                                        @click=${this._filter}><i class="material-icons">rule</i>
                                    </wired-fab>
                                    <button id="test-button" @click=${this._test}>test</button>
                                </div>` 
                            : html`<div class="loading">let's see what we need ...</div>`}
                    </div>
                    `
    }
}


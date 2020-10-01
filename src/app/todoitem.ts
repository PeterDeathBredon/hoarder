import {customElement, html, LitElement} from "lit-element"
// @ts-ignore
import {ToDo} from './structures/todo.ts';
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


@customElement('todo-item')
class TodoItem extends LitElement {
    todo: ToDo;

    static get properties() {
        return {
            todo: {type: ToDo},
        }
    }

    static get styles() {
        // return appStyle;
        return componentStyle;
    }

    _removeTodo(e: Event) {
        db.get(this.todo._id)
            .then((doc: any) => {
                db.remove(doc)
                    .then((response: any) => {
                        store.dispatch(deleteTodo(this.todo));
                    })
            })
            .catch((err: any) => {
                console.log(err);
                store.dispatch(deleteTodo(this.todo));
            })
    }

    _changeTodoFinished(e: Event, todo: ToDo) {
        this.todo.finished = (<HTMLInputElement>e.target).checked;
        if (!this._updateTodo()) {
            this.todo = {
                ...this.todo,
            };
        }
        this._notifyUpdate();
    }

    _editOk(e: Event) {
        if (this._updateTodo())
            this._notifyUpdate();
    }

    _notifyUpdate() {
        db.put({...this.todo})
            .then((response: any) => {
                store.dispatch(changeTodo(this.todo));
            })
            .catch((response: any) => {
                console.log(response);
            });

    }

    _toEditMode(e: Event) {
        if (!this.todo.inEditMode) {
            this.todo = {...this.todo, inEditMode: true}
        }
        ;
    }

    _updateTodo() {
        if (this.todo.inEditMode) {
            const edit = <HTMLInputElement>(this.shadowRoot.getElementById("edit-text"));
            this.todo = {
                ...this.todo,
                text: edit.value,
                inEditMode: false
            };
            return true;
        } else
            return false;

    }


    updated() {
        if (this.todo.inEditMode) {
            const el = <HTMLInputElement>(this.shadowRoot.getElementById("edit-text"));
            setTimeout(() => el.focus(), 0);
        }
    }

    render() {
        console.log(`rendering ${this.todo.text}: ${this.todo.finished}`);
        const valuestrEdit = html`<wired-input style="color: black;font-weight: bold" id="edit-text" value="${this.todo.text}" 
                                               .autofocus></wired-input>
                         <wired-fab  
                            @click=${this._editOk}><i class="material-icons md-light">done</i></wired-fab>
                         <wired-fab
                            @click=${this._removeTodo}><i class="material-icons md-light">delete</i></wired-fab>`
        const valuestrNormal = html`<span style="${this.todo.finished ? "color:var(--hoarder-color-checked)" : "color:var(--hoarder-color-unchecked)"}"
                        @click=${(e: Event) => this._toEditMode(<Event>e)}>${this.todo.text || 'whatchamacallit'}</span>`

        return (html`
            <div class="list-item">
                <wired-checkbox type="checkbox"
                    .checked=${this.todo.finished}
                    style="${this.todo.finished ? "color:var(--hoarder-color-checked)" : "color:var(--hoarder-color-unchecked)"}"
                    @change=${(e: Event) => this._changeTodoFinished(<Event>e, this.todo)}  
                ></wired-checkbox>
                <div class="edit-and-buttons">
                    ${this.todo.inEditMode ? valuestrEdit : valuestrNormal}
                </div>
            </div>
            `)
    }
}



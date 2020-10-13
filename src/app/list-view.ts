import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import appStyle from './component_app.sass';
// @ts-ignore
import listStyle from './component-todo-list.sass';

// @ts-ignore
import {ToDo, TYPE_TODO} from './store/todo.ts';
// import './todolist.ts'
import 'wired-input';
// @ts-ignore
import './todoitem.ts'
// @ts-ignore
import {store} from './store/store.ts';
import {connect} from 'pwa-helpers/connect-mixin';
// @ts-ignore
import {addTodo, changeTodo, deleteTodo, initList, toggleFilter} from './store/actions.ts'
// @ts-ignore
import {db, remoteCouch, sync} from './store/db.ts'
// @ts-ignore
import {State} from './store/reducer.ts'
// @ts-ignore
import {router} from './routing.js'
import {Router} from "@vaadin/router";
// @ts-ignore

@customElement('list-view')
class ListView extends connect(store)(LitElement) {
    state: State;
    db_initialized: boolean = false;
    sync_status: string = '';
    showSyncButton: boolean = false;
    listHeader: string;
    listId: string;
    location: Object;
    todosInEditState: Array<ToDo> = [];

    static get properties() {
        return {
            state: {type: State},
            // newTodos: {type: Array},
            sync_status: {type: String},
            db_initialized: {type: Boolean},
            showSyncButton: {type: Boolean},
            listHeader: {type: String},
            todosInEditState: {type: Array}
        }
    }

    static get styles() {
        return [appStyle, listStyle];
    }

    stateChanged(state: State) {
        console.log(`list-view.stateChanged: ${state}`);
        this.state = state;

    }

    onAfterEnter(location: any, commands:any , router: any) {
        try {
            this.location = router.location;
            this.listId = router.location.params.id;
        } catch (err) {
            console.log(err);
        }
        store.dispatch(initList([]));
        this._init();
        this._installSyncEvents();
    }

    _init() {
        db.get(this.listId)
            .then((response: any) => {
            this.listHeader = response.text;
        })

        console.log("listHeader is", router.location.params.id);

        db.query('todos', {key: [TYPE_TODO, this.listId], include_docs: true})
            .then((response: any) => {
                let todos = response.rows.map((row: any) => {return {... new ToDo(), ...row.doc}})
                store.dispatch(initList(todos));
                // this.sync_status = 'collaborating...';
                // sync(remoteCouch,
                //     this._sync_changed.bind(this),
                //     this._sync_error.bind(this));
                this.db_initialized = true;
            })
            .catch((response: any) => {
                console.log(response);
            });
    }

    _reload() {
        console.log('reloading...');
        // let inEditMode = this.state.todos.filter((todo: ToDo) => todo.inEditMode);
        // if (inEditMode.length > 0) {
        //     console.log("list-view._reload can't be done because of ", inEditMode);
        //     return
        // }

        db.query('todos', {key: [TYPE_TODO, this.listId], include_docs: true})
            .then((response: any) => {
                let todos = response.rows.map((row: any) => {return {... new ToDo(), ...row.doc}})
                console.log("_reload with", todos);
                store.dispatch(initList(todos));
            })
            .catch((response: any) => {
                console.log('error fetching all docs:', response);
            });
    }

    _sync_error(err: {}) {
        this.sync_status = 'alone for good.';
        console.log("error synching", err);
        this.dispatchEvent(new CustomEvent("sync-error", {bubbles: true, composed: true, detail: err}));
    }

    _sync_changed(err: {}) {
        console.log("data has changed remotely.", this);
        this.dispatchEvent(new CustomEvent("sync-changed", {bubbles: true, composed: true, detail: err}));
        this._reload();
    }


    _addTodo() {
        console.log("adding a todo.")
        let todo = new ToDo("", false, true, this.listId);
        this.todosInEditState = [...this.todosInEditState, todo]
    }

    _editTodo(e: CustomEvent) {
        console.log("list-view._editTodo", e.detail);
        const todo: ToDo = this.state.todos.find((todo: ToDo) => todo._id === (<ToDo>e.detail)._id);
        if (typeof(todo) != "undefined") {
            this.todosInEditState = [...this.todosInEditState, todo];
        }
        else
            alert("Error editing ToDo");
    }

    _isInEditState(todo: ToDo) {
        return !!this.todosInEditState.find(t => t._id === todo._id);  //!! converts to true or false
    }

    _toDoItemChanged(event: CustomEvent) {
        console.log("list-view._toDoItemChanged: ", event.detail);
        event.stopPropagation();
        let aNewOne = false;
        const todo = <ToDo>event.detail;
        const updatedTodo = {...new ToDo(), ...todo};
        if (this._isInEditState(todo)) {
            this.todosInEditState = this.todosInEditState.filter(t => t._id !== todo._id)
            aNewOne = (todo._rev === undefined);
        }

        db.put(updatedTodo)
            .then((response: any) => {
                updatedTodo._rev = response.rev;
                if (aNewOne)
                    store.dispatch(addTodo(updatedTodo))
                else
                    store.dispatch(changeTodo(updatedTodo));
            })
            .catch((response: any) => {
                alert(response);
                store.dispatch(changeTodo(updatedTodo));
            });
    }

    _removeTodo(e: CustomEvent) {
        const todo = <ToDo> e.detail;

        e.stopPropagation();
        console.log("list-view._removeTodo");
        if (typeof todo._rev === 'undefined') {
            console.log("That was a new one: ", todo);
            this.todosInEditState = this.todosInEditState.filter(t => t._id !== todo._id);
            return
        }

        db.get(todo._id)
            .then((doc: any) => {
                db.remove(doc)
                    .then((response: any) => {
                        store.dispatch(deleteTodo(todo));
                    })
            })
            .catch((err: any) => {
                console.log(err);
                store.dispatch(deleteTodo(todo));
            })
    }


    _filter() {
        store.dispatch(toggleFilter());
    }

    _test() {
        db.allDocs({include_docs: true}).then((response: any) => {
            console.log(response);
        }).catch((response: any) => {
            console.log(response);
        });
    }

    _back() {
        Router.go("/");
    }

    _renderList() {
        console.log("rendering todolist", this.state.todos);

        const todosNotInEditState = this.state.todos.filter((todo: ToDo) => !this._isInEditState(todo))
        const todos=[...todosNotInEditState, ...this.todosInEditState]
        const filteredTodos = todos.filter((todo: ToDo) => (this.state.showFinished && todo.finished)
                                                        || !todo.finished).sort((a,b) => a._id.localeCompare(b._id) );

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
                    ? filteredTodos.map((todo: ToDo) =>
                        html`<todo-item 
                                .todo=${todo} 
                                .inEditMode=${this._isInEditState(todo)}
                                @todo-item-changed=${this._toDoItemChanged}  
                                @todo-item-deleted=${this._removeTodo} 
                                @todo-item-edit=${this._editTodo}>
                             </todo-item>`
                    )
                    : html`<div style="width: 100%"><p style="text-align: center"><p>All is hoarded!</p></div>`
                }
            </div>
            <div id="end-of-list"></div>
            <div id="after-end-of-list"></div>
        `
    }

    render() {
        console.log("rendering list-view.ts");
        let filterButtonStyle = this.state.showFinished ?
            "--wired-fab-bg-color: var(--hoarder-show-finished-color)" :
            "--wired-fab-bg-color: var(--hoarder-omit-finished-color)";
        // let filterButtonStyle = `--wired-fab-bg-color: red`;
        return html`
            <div class="center-div">
                ${this.db_initialized
                ? html`             
                    ${this._renderList()}            
                    <div class="button-list">
                        <wired-fab id="add-button" 
                            @click=${this._addTodo}><i class="material-icons">add_shopping_cart</i>
                        </wired-fab>
                        <wired-fab id="sync-button" 
                            @click=${this._sync} 
                            style="${this.showSyncButton 
                                     ? '--wired-fab-bg-color: #ff0000' 
                                     : 'visibility:hidden; --wired-fab-bg-color: #ff0000'}">
                            <i class="material-icons">sync</i>
                        </wired-fab>
                        <wired-fab id="cleanup-button" 
                            @click=${this._filter} style="${filterButtonStyle}"><i class="material-icons">rule</i>
                        </wired-fab>
                    </div>`
                : html` <div class="loading">let's see what we need ...</div>`}
            </div>`
    }

    _installSyncEvents() {
        const appContainer = document.getElementsByTagName("list-view")[0];
        appContainer.addEventListener("sync-error", () => {
            console.log("sync error");
            this._heartbeat();
            this.showSyncButton = true;
        });
        appContainer.addEventListener("sync-changed", () => {
            console.log("sync changed");
            this._heartbeat();
        });
    }

    _heartbeat() {
        const headline = document.getElementById("animate");
        headline.classList.remove("creepy");
        void headline.offsetWidth;
        headline.classList.add("creepy");
    }

    _sync() {
        this.showSyncButton = false;
        this._init();
    }

}


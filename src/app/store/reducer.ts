// @ts-ignore
import {ToDo} from '../structures/todo.ts'
// @ts-ignore
import {Action, ADD_TODO, CHANGE_TODO, DEL_TODO, INIT, InitAction, ToDoAction, TOGGLE_FILTER} from './actions.ts'

export class State {
    todos: ToDo[] = []
    showFinished: Boolean = false
}

const INITIAL_STATE = new State();


export const reducer = (state: State = INITIAL_STATE, action: Action): State => {
    switch (action.type) {
        case INIT: {
            console.log('initializing store with', (<InitAction>action).todos);
            let newState = {...state};
            newState.todos = (<InitAction>action).todos.map((todo: ToDo) => {
                return {...todo}
            });
            return newState;
        }
        case TOGGLE_FILTER: {
            console.log('toggling filter');
            let newState = {...state}
            newState.showFinished = !newState.showFinished;

            return newState;
        }
        case ADD_TODO: {
            console.log("reducer: ADD_TODO", (<ToDoAction>action).todo);
            let newState = {...state};
            newState.todos = [...state.todos];
            newState.todos.push((<ToDoAction>action).todo);

            return newState;
        }
        case CHANGE_TODO: {
            console.log("reducer: CHANGE_TODO", (<ToDoAction>action).todo);
            const newTodo = (<ToDoAction>action).todo;
            let newState = {...state};
            newState.todos = state.todos.map((todo: ToDo) => {
                return todo._id === newTodo._id ? {...newTodo} : {...todo}
            });
            // const oldTodo = newState.filter(todo => todo._id === newTodo._id)[0];
            // newState[newState.indexOf(oldTodo)] = {...newTodo}
            return newState;
        }
        case DEL_TODO: {
            let newState = {...state};
            newState.todos = state.todos.map((todo: ToDo) => {
                return {...todo}
            });
            newState.todos = newState.todos.filter((todo: ToDo) => todo._id !== (<ToDoAction>action).todo._id);
            return newState;

        }

        default:
            console.log("Unknown action received in reducer.");
            return state;
    }
}



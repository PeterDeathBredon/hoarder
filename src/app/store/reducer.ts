// @ts-ignore
import {ToDo} from '../structures/todo.ts'
// @ts-ignore
import {Action, ADD_TODO, CHANGE_TODO, DEL_TODO, INIT} from './actions.ts'


// @ts-ignore
import {db} from './db.ts'

let INITIAL_STATE:Array<ToDo> = [];



export const reducer = (state: ToDo[] = INITIAL_STATE, action: Action) => {
    switch(action.type) {
        case INIT: {
            return action.todos;
        }
        case ADD_TODO: {
            console.log("reducer: ADD_TODO", action.todo);
            let newState = [...state]
            newState.push(action.todo);
            return newState;
        }
        case CHANGE_TODO: {
            console.log("reducer: CHANGE_TODO");
            const newTodo = action.todo;
            let newState = [...state]
            const oldTodo = newState.filter(todo => todo._id === newTodo._id)[0];
            newState[newState.indexOf(oldTodo)] = {...newTodo}
            return newState;
        }
        case DEL_TODO: {
            return state.filter(todo => (todo)._id !== action.todo._id);

        }

        default:
            console.log("Unknown action received in reducer.");
            return state;
    }
}



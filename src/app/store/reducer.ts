// @ts-ignore
import {ToDo} from '../structures/todo.ts'
// @ts-ignore
import {Action, ADD_TODO, CHANGE_TODO, DEL_TODO} from './actions.ts'

const INITIAL_STATE: Array<ToDo> =  []


export const reducer = (state = INITIAL_STATE, action: Action) => {
    switch(action.type) {
        case ADD_TODO: {
            console.log("reducer: ADD_TODO");
            let newState = [...state]
            newState.push(new ToDo("", false, true));
            return newState;
        }
        case CHANGE_TODO: {
            console.log("reducer: CHANGE_TODO");
            const newTodo = action.todo;
            let newState = [...state]
            const oldTodo = newState.filter(todo => todo.id === newTodo.id)[0];
            newState[newState.indexOf(oldTodo)] = {...newTodo}
            return newState;
        }
        case DEL_TODO: {

            return state.filter(todo => (todo).id !== action.todo.id);

        }

        default:
            return state;
    }
}



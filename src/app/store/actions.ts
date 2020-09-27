import {nanoid} from 'nanoid'
// @ts-ignore
import { ToDo } from '../structures/todo.ts';

export const INIT = 'INIT';
export const ADD_TODO = 'ADD_TODO';
export const CHANGE_TODO = 'CHANGE_TODO';
export const DEL_TODO = 'DEL_TODO';

interface Action {
    type: string,
    todo: ToDo
}


export const addTodo = (todo: ToDo): Action => {
    return {
        type: ADD_TODO,
        todo: todo
    }
}

export const changeTodo = (todo: ToDo) => {
    return {
        type: CHANGE_TODO,
        todo: todo
    }
}

export const deleteTodo = (todo: ToDo) => {
    return {
        type: DEL_TODO,
        todo: todo
    }
}

export const init = (todos: ToDo[]) => {
    return {
        type: INIT,
        todos: todos
    }
}
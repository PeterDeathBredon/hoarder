import {nanoid} from 'nanoid'
// @ts-ignore
import { ToDo } from '../structures/todo.ts';

export const INIT = 'INIT';
export const ADD_TODO = 'ADD_TODO';
export const CHANGE_TODO = 'CHANGE_TODO';
export const DEL_TODO = 'DEL_TODO';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';

export interface Action {
    type: string,
}
export interface ToDoAction extends Action {
    todo: ToDo
}
export interface InitAction extends Action {
    todos: ToDo[]
}

export const addTodo = (todo: ToDo): ToDoAction => {
    return {
        type: ADD_TODO,
        todo: todo
    }
}

export const changeTodo = (todo: ToDo): ToDoAction => {
    return {
        type: CHANGE_TODO,
        todo: todo
    }
}

export const deleteTodo = (todo: ToDo): ToDoAction => {
    return {
        type: DEL_TODO,
        todo: todo
    }
}

export const init = (todos: ToDo[]): InitAction => {
    return {
        type: INIT,
        todos: todos
    }
}

export const toggleFilter = (): Action => {
    return {
        type: TOGGLE_FILTER,
    }
}
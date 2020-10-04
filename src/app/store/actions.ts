// @ts-ignore
import { ToDo } from './todo.ts';
// @ts-ignore
import { List } from './list.ts';

export const INIT_LIST_VIEW = 'INIT_LIST_VIEW';
export const ADD_TODO = 'ADD_TODO';
export const CHANGE_TODO = 'CHANGE_TODO';
export const DEL_TODO = 'DEL_TODO';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const INIT_APP = 'INIT_APP';
export const ADD_LIST = 'ADD_LIST';
export const EDIT_LIST = 'EDIT_LIST';

export interface Action {
    type: string,
}
export interface ToDoAction extends Action {
    todo: ToDo
}
export interface InitAction extends Action {
    todos: ToDo[]
}

export interface ListInitAction extends Action {
    lists: List[]
}

export interface ListItemAction extends Action {
    list: List
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

export const initList = (todos: ToDo[]): InitAction => {
    return {
        type: INIT_LIST_VIEW,
        todos: todos
    }
}

export const toggleFilter = (): Action => {
    return {
        type: TOGGLE_FILTER,
    }
}

export const initApp = (lists: List[]): ListInitAction => {
    return {
        type: INIT_APP,
        lists: lists
    }
}

export const addList = (list: List): ListItemAction => {
    return {
        type: ADD_LIST,
        list: list
    }
}

export const editList = (list: List): ListItemAction => {
    return {
        type: EDIT_LIST,
        list: list
    }
}

import {createStore} from 'redux';
// @ts-ignore
import {reducer} from './reducer.ts';

export const store = createStore(reducer);

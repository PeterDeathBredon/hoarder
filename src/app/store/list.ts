// @ts-ignore
import {DbRecord} from './dbrecord.ts'

export const TYPE_LIST = "list";

export class List extends DbRecord{
    text: string;

    constructor(text = '') {
        super(TYPE_LIST);
        this.text = text;
    }
}

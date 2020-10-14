// @ts-ignore
import {DbRecord} from './dbrecord.ts'

export const TYPE_LIST = "list";

export class List extends DbRecord{
    text: string;
    finished: boolean=false;

    constructor(text = '', finished = false) {
        super(TYPE_LIST);
        this.text = text;
        this.finished = finished;
    }
}

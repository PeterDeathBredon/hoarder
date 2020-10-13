// @ts-ignore
import {DbRecord} from './dbrecord.ts'

export const TYPE_TODO = "todo";

export class ToDo extends DbRecord{
    text: string;
    idList: string;
    finished: boolean;

    constructor(text = '', finished=false, inEditMode=false, idList="default") {
        super(TYPE_TODO);
        this.idList = idList;
        this.text = text;
        this.finished = finished;
    }
}

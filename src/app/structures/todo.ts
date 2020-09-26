import {nanoid} from 'nanoid'

export class ToDo {
    id: string;
    text: string;
    finished: boolean;
    inEditMode: boolean;

    constructor(text = '', finished=false, inEditMode=false) {
        this.id = nanoid();
        this.text = text;
        this.finished = finished;
        this.inEditMode = inEditMode;
    }
}

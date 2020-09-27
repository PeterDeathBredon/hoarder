import {nanoid} from 'nanoid'

export class ToDo {
    _id: string;
    text: string;
    finished: boolean;
    inEditMode: boolean;

    constructor(text = '', finished=false, inEditMode=false) {
        this._id = new Date().getTime().toString() + "-" + nanoid();
        this.text = text;
        this.finished = finished;
        this.inEditMode = inEditMode;
    }
}

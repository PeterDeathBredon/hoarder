import {nanoid} from "nanoid";

export class DbRecord{
    _id: string;
    _rev: string = undefined;
    type: string;

    constructor(type: string, id: any = null) {
        this.type = type;
        if (id == null) {
            this._id = new Date().getTime().toString() + "-" + nanoid();
        }
    }
}
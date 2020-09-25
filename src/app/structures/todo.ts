export class ToDo {
    text: string;
    finished: boolean;

    constructor(text = '', finished=false) {
        this.text = text;
        this.finished = finished;
    }
}

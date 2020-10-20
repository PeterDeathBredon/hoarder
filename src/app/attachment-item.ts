import {customElement, html, LitElement} from "lit-element"
// @ts-ignore
import componentStyle from "./component-attachment-item.sass";

@customElement('attachment-item')
class AttachmentItem extends LitElement {
    attachmentId: string = "";
    toDoId: string = "";

    static get properties() {
        return {
            toDoId: {type: String},
            attachmentId: {type: String}
        }
    }

    static get styles() {
        // return appStyle;
        return componentStyle;
    }

    render() {
        return html`${this.attachmentId}`;
    }
}

import {customElement, html, LitElement, PropertyValues} from "lit-element"
// @ts-ignore
import componentStyle from "./component-attachment-item.sass";

// @ts-ignore
import {db, remoteCouch, sync, init_db} from './store/db.ts'

@customElement('attachment-item')
class AttachmentItem extends LitElement {
    attachmentId: string = "";
    todoId: string = "";
    attachment: Object = null;
    marked: Boolean = false;

    static get properties() {
        return {
            todoId: {type: String},
            attachmentId: {type: String},
            attachment: {type: Object},
            marked: {type: Boolean}
        }
    }

    static get styles() {
        // return appStyle;
        return componentStyle;
    }

    private async _load_images() {
        console.log(`loading ${this.todoId}/${this.attachmentId}`)
        this.attachment = await db.getAttachment(this.todoId, this.attachmentId);
    }

    protected update(changedProperties: PropertyValues) {
        super.update(changedProperties);
        if (changedProperties.has("todoId") || changedProperties.has("attachmentId")) {
            this.attachment = null;
            this._load_images();
        } else {
            console.log(`attachment ${this.attachmentId} loaded.`)
        }
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("attachment") && this.attachment !== null) {
            console.log("assigning attachment to image", _changedProperties);
            const el: HTMLImageElement = this.shadowRoot.querySelector("img");
            console.log(this.attachment);
            // @ts-ignore
            el.src = URL.createObjectURL(this.attachment);
        }
    }
    _click(e: Event) {
        this.dispatchEvent(new CustomEvent("mark-attachment",
            {bubbles: true, composed: true, detail: this.attachmentId}));
    }

    _deleteThis(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent("delete-attachment",
            {bubbles: true, composed: true, detail: this.attachmentId}));
    }

    render() {
        return html`${this.attachment === null
                        ? html`<p>loading</p>`
                        : html`<div @click=${this._click} class="attachment-container">
                                <img alt="an attachment" src=""/>
                                <div class="center-button">
                                    <wired-fab class="delete-button" 
                                        @click=${this._deleteThis} 
                                        style="${this.marked ? 'visibility: visible' : 'visibility:hidden'}">
                                            <i class="material-icons">delete</i>
                                    </wired-fab>
                                </div>
                               </div>`
                    }`
    }
}

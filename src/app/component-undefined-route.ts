import {customElement, html, LitElement, PropertyValues} from 'lit-element';
// import {connect} from "pwa-helpers/connect-mixin";
// import {store} from "./store/store";
// @ts-ignore
import errStyle from "./component-undefined-route.sass";
import {Router} from '@vaadin/router'


@customElement('no-route')
class NoRoute extends (LitElement) {

    constructor() {
        super();
    }

    static get styles() {
        return errStyle
    }

    _back(){
        // alert("back!");
        Router.go("/");
    }

    render() {
        console.log("rendering component-undefined-route.ts");
        return html`
                    <div class="center-div">
                        <div>
                            <div class="error">Ooops. That page does not exist ...</div>
                            <div>
                               <wired-fab id="home-button" 
                                     @click=${this._back} style="color: var(--wired-fab-bg-color)">
                                     <i class="material-icons">home</i>
                               </wired-fab>                    
                            </div>
                        </div>
                    </div>
                    `
    }

}

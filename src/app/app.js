import { html, LitElement } from 'lit-element';
// @ts-ignore
import appStyle from './component_app.sass';

console.log(appStyle);

class App extends LitElement {

    static get styles() {
        // return appStyle;
        return appStyle
    }


    render() {
        return html`
                    <div class="center-div">
                        <h1>The Dizzy Turtle</h1>
                        <div id="turtle"></div>
                    </div>
`
    }
}
customElements.define('turtle-app', App);


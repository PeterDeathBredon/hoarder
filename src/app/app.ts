import { html, LitElement, customElement } from 'lit-element';
import '@material/mwc-checkbox';
import 'wired-checkbox';
// @ts-ignore
import appStyle from './component_app.sass';

console.log(appStyle);

@customElement('hoarder-app')
class App extends LitElement {


    static get styles() {
        // return appStyle;
        return appStyle
    }

    render() {
        return html`
                    <div class="center-div">
                    <wired-checkbox checked style="color: darkgreen">squishy fish</wired-checkbox>
                    <wired-checkbox >gummy stars</wired-checkbox>
                    <wired-checkbox >kayak cookies</wired-checkbox>
                    <wired-checkbox >rugelach, but only from Zaro's</wired-checkbox>
                    </div>
`
    }
}


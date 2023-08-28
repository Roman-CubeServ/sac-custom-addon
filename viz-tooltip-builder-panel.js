/* The line `const tooltipFormTemplate = document.createElement("template");` is creating a new HTML
template element called `tooltipFormTemplate`. This template will be used to define the structure
and content of the tooltip form in the custom element `VizTooltipBuilderPanel`. */
const tooltipFormTemplate = document.createElement("template");
tooltipFormTemplate.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Tooltip Header Properties</legend>
            <table>
                <tr>
                    <td>Max</td>
                    <td><input id="bps_max" type="number" size="10" maxlength="10">Millian</td>
                </tr>
                <tr>
                    <td>Color</td>
                    <td><input id="bps_color" type="text" size="10" maxlength="10"></td>
                </tr>
            </table>
            <input type="submit" style="display:none;">
        </fieldset>
    </form>
    <style>
    :host {
        display: block;
        padding: 1em 1em 1em 1em;
    }
    </style>
`;

/* The VizTooltipBuilderPanel class is a custom HTML element that represents a tooltip builder panel
and allows users to set color and max properties. */
class VizTooltipBuilderPanel extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: "open"});
        this._shadowRoot.appendChild(tooltipFormTemplate.content.cloneNode(true));
       /* This line of code is adding an event listener to the form element with the id "form" inside
       the shadow root of the `VizTooltipBuilderPanel` custom element. The event listener is
       listening for the "submit" event, which is triggered when the form is submitted. */
        this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
    }

    /**
     * The _submit function prevents the default form submission behavior and dispatches a custom event
     * with updated properties.
     * @param e - The parameter "e" is an event object that represents the event that triggered the
     * submit function. It is typically passed as an argument when the submit function is called. In
     * this case, it is used to prevent the default behavior of the event, which is to submit a form
     * and refresh the page.
     */
    _submit(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        color: this.color,
                        max: this.max
                    }
                }
        }));
    }

    /**
     * The function sets the value of an input element with the id "bps_color" to a new color.
     * @param newColor - The newColor parameter is the value that you want to set for the color. It can
     * be any valid color value, such as a hexadecimal color code (#RRGGBB) or a named color (e.g.,
     * "red", "blue", "green").
     */
    set color(newColor) {
        (this._shadowRoot.getElementById("bps_color")).value = newColor;
    }

    /**
     * The function returns the value of the "bps_color" element inside the shadow root.
     * @returns The value of the element with the ID "bps_color" in the shadow root.
     */
    get color() {
        return (this._shadowRoot.getElementById("bps_color")).value;
    }

    /**
     * The "max" function sets the value of an element with the ID "bps_max" to the given value.
     * @param value - The value parameter is the maximum value that you want to set for the input field
     * with the id "bps_max".
     */
    set max(value) {
        (this._shadowRoot.getElementById("bps_max")).value = value;
    }

   /**
    * The function returns the value of the element with the id "bps_max" in the shadow root.
    * @returns The value of the element with the ID "bps_max" in the shadow root.
    */
    get max() {
        return (this._shadowRoot.getElementById("bps_max")).value;
    }

    /**
     * The function sets the color and max properties of an object based on the provided settings
     * object.
     * @param settings - The `settings` parameter is an object that contains properties for color and
     * max.
     */
    set settings(settings) {
        this.color = settings?.color || this.color;
        this.max = settings?.max || this.max;
    }
}

/* The `customElements.define("viz-tooltip-build", VizTooltipBuilderPanel);` line is defining a new
custom HTML element called "viz-tooltip-build". This element is associated with the
`VizTooltipBuilderPanel` class, which represents a tooltip builder panel. */
customElements.define("viz-tooltip-build", VizTooltipBuilderPanel);
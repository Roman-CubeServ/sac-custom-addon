/* The line `const plotareaFormTemplate = document.createElement("template");` is creating a new HTML
template element called `plotareaFormTemplate`. This template will be used to define the structure
and content of the custom element's shadow DOM. */
const plotareaFormTemplate = document.createElement("template");
plotareaFormTemplate.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Plotarea Properties</legend>
            <table>
                <tr>
                    <td>Rounded Marker</td>
                    <td><input id="bps_rounded" type="checkbox" checked></td>
                </tr>
                <tr>
                    <td>Increate Size</td>
                    <td><input id="bps_size_increment" type="number" value="0">%</td>
                </tr>
                <tr>
                    <td>Axis Label Color</td>
                    <td><input id="bps_axis_label_color" type="text" size="10" maxlength="10" value="#333"></td>
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

/* The `VizPlotareaBuilderPanel` class is a custom HTML element that represents a form panel for
configuring properties of a visualization plot area. */
class VizPlotareaBuilderPanel extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: "open"});
        this._shadowRoot.appendChild(plotareaFormTemplate.content.cloneNode(true));
        this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
        this._shadowRoot.getElementById('bps_rounded').addEventListener('change', this._submit.bind(this));
        this._shadowRoot.getElementById('bps_size_increment').addEventListener('change', this._submit.bind(this));
        this._shadowRoot.getElementById('bps_axis_label_color').addEventListener('change', this._submit.bind(this));
    }

    /**
     * The _submit function prevents the default form submission behavior, dispatches a custom event
     * with updated properties, and includes the rounded, sizeIncrement, and axisLabelColor values.
     * @param e - The parameter "e" is an event object that is passed to the function. It is typically
     * used to prevent the default behavior of an event, such as submitting a form or following a link.
     * In this case, the `e.preventDefault()` method is called to prevent the default form submission
     * behavior.
     */
    _submit(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        rounded: this.rounded,
                        sizeIncrement: this.sizeIncrement,
                        axisLabelColor: this.axisLabelColor,
                    }
                }
        }));
    }

    /**
     * The function sets the value of a checkbox element to true or false based on the input value.
     * @param value - The value parameter is a boolean value that determines whether the "bps_rounded"
     * element should be checked or not.
     */
    set rounded(value) {
        (this._shadowRoot.getElementById("bps_rounded")).checked = !!value;
    }

    /**
     * The function returns the value of the "checked" property of an element with the ID "bps_rounded"
     * in the shadow root.
     * @returns The value of the checkbox with the id "bps_rounded" in the shadow root.
     */
    get rounded() {
        return (this._shadowRoot.getElementById("bps_rounded")).checked;
    }

    /**
     * The function sets the value of an input element with the id "bps_size_increment" to the given
     * value.
     * @param value - The value parameter is the new value that you want to set for the size increment.
     */
    set sizeIncrement(value) {
        (this._shadowRoot.getElementById("bps_size_increment")).value = value;
    }

    /**
     * The function returns the value of the "bps_size_increment" element in the shadow root.
     * @returns The value of the element with the ID "bps_size_increment" in the shadow root.
     */
    get sizeIncrement() {
        return (this._shadowRoot.getElementById("bps_size_increment")).value;
    }

    /**
     * The function sets the value of a color input field in the shadow DOM.
     * @param value - The value parameter is the color value that you want to set for the axis label.
     */
    set axisLabelColor(value) {
        (this._shadowRoot.getElementById("bps_axis_label_color")).value = value;
    }

    /**
     * The function returns the value of the "bps_axis_label_color" element in the shadow root.
     * @returns The value of the element with the ID "bps_axis_label_color" in the shadow root.
     */
    get axisLabelColor() {
        return (this._shadowRoot.getElementById("bps_axis_label_color")).value;
    }

    /**
     * The function sets the settings for a JavaScript object, with default values if not provided.
     * @param settings - The `settings` parameter is an object that contains various properties that
     * can be used to configure the settings of an object.
     */
    set settings(settings) {
        this.rounded = settings?.rounded || this.rounded;
        this.sizeIncrement = settings?.sizeIncrement || this.sizeIncrement;
        this.axisLabelColor = settings?.axisLabelColor || this.axisLabelColor;
    }
}

/* The `customElements.define("viz-plotarea-build", VizPlotareaBuilderPanel);` line is defining a new
custom HTML element called "viz-plotarea-build". This element is associated with the
`VizPlotareaBuilderPanel` class, which represents a form panel for configuring properties of a
visualization plot area. Once defined, this custom element can be used in the HTML markup of a web
page like any other built-in HTML element. */
customElements.define("viz-plotarea-build", VizPlotareaBuilderPanel);
/* The line `const rowTemplate = document.createElement('template');` is creating a new HTML template
element. This template element can be used to define a reusable piece of HTML code that can be
cloned and inserted into the document later. */
const rowTemplate = document.createElement('template');
rowTemplate.innerHTML = `
    <div class="tooltip-row">
        <img class="entry-icon"
            width="22"
            height="22"
        >
        <div class="tooltip-row-label">
            <span class="entry-label"></span>
        </div>
    </div>
`;

/* The line `const containerTemplate = document.createElement('template');` is creating a new HTML
template element. This template element can be used to define a reusable piece of HTML code that can
be cloned and inserted into the document later. In this specific code, the template is used to
define the structure and styling of a tooltip container. */
const containerTemplate = document.createElement('template');
containerTemplate.innerHTML = `
    <style>
        :host {
            display: block;
            min-width: 80px;
            max-width: 250px;
            min-height: 24px;
        }

        .tooltip-container {
            padding: 12px;
            display: flex;
            min-width: 80px;
            min-height: 24px;
            flex-flow: column nowrap;
        }

        .price::before {
            font-family: SAP-icons;
            content: "\\E026";
        }

        .manager::before {
            font-family: SAP-icons;
            content: "\\E036";
        }

        .product::before {
            font-family: SAP-icons;
            content "\\E16D";
        }

        .location::before {
            font-family: SAP-icons;
            content "\\E021\";
        }

        .store::before {
            font-family: SAP-icons;
            content "\\E00F";
        }

        .tooltip-row {
            display: flex;
            min-height: 30px;
            flex-flow: row nowrap;
            align-items: center;
        }

        .tooltip-row-label {
            display: flex;
            flex-flow: column nowrap;
            flex: auto;
        }

        .tooltip-row-label progress {
            height: 6px;
            width: 100%;
            border-radius: 0;
        }

        .tooltip-row-label progress::-webkit-progress-bar {
            color: lightblue;
            background-color: #eee;
        }

        .tooltip-row-label progress::-webkit-progress-value {
            background-color: red;
        }

        .tooltip-row:not(:last-of-type) {
            border-bottom: solid 1px #e6e7e8;
        }

        .entry-icon {
            display: inline-block;
            padding-right: 12px;
        }

        .entry-label {
            display: inline-block;
            flex: auto;
            vertical-align: middle;
        }
    </style>
    <div class="tooltip-container">
    </div>

`;

/* The `tooltipIconMap` is an object that maps specific tooltip entries to their corresponding icon
URLs. Each key-value pair in the object represents an entry and its associated icon URL. For
example, the key `'Location'` maps to the URL
`'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png'`. */
const tooltipIconMap = {
    'Location': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Product': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Product.png',
    'Sales Manager': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/SalesManager.png',
    'Date': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Date.png',
    'Store': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Store.png',
    'Category': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Category.png',
    'Price (fixed)': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Price.png',
    'Quantity Sold': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Quantity.png',
    'California': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Nevada': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Oregon': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Carbonated Drinks': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/CarbonatedDrinks.png',
    'Juices': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Juices.png',
    'Alcohol': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Alcohol.png',
    'Others': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Others.png',
    'Gross Margin': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/GrossMargin.png',
    'Discount': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Discount.png',
    'Original Sales Price': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Price.png',
    'City': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/City.png',
    'Info': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Info.png',
};

/**
 * The function `tooltipEntryToRow` creates a row element for a tooltip entry, with an optional
 * percentage bar.
 * @param entry - The `entry` parameter is an object that contains information about a tooltip entry.
 * It typically has the following properties:
 * @param [withPercentageBar=false] - A boolean value indicating whether to display a percentage bar or
 * not. If set to true, a percentage bar will be displayed based on the value of the entry.
 * @param [max=100] - The `max` parameter is the maximum value for the percentage bar. It determines
 * the maximum value that the progress bar can reach.
 * @returns The function `tooltipEntryToRow` returns a cloned row element with the appropriate values
 * and attributes set based on the `entry` parameter. If `withPercentageBar` is true, it also adds a
 * progress bar element to the row element.
 */
const tooltipEntryToRow = (
    entry,
    withPercentageBar = false,
    max = 100,
) => {
    const rowElement = rowTemplate.content.cloneNode(true);
    const iconEl = (rowElement).querySelector('.entry-icon');
    const labelEl = (rowElement).querySelector('.entry-label');
    iconEl.setAttribute('src', tooltipIconMap[entry.value] || tooltipIconMap[entry.title] || tooltipIconMap['Info']);
    iconEl.setAttribute('title', entry.title);
    labelEl.textContent = entry.value;

    if (withPercentageBar) {
        const numberRegexp = /[.0-9]+/;
        if (!numberRegexp.test(entry.value)) {
            return;
        }
        const percentageBar = document.createElement('progress');
        percentageBar.value = Number(/[.0-9]+/.exec(entry.value)[0]);
        percentageBar.max = max;
        const rowLabelDiv = (rowElement).querySelector('.tooltip-row-label');
        // (percentageBar as HTMLElement).style['width'] = '100%';
        rowLabelDiv.appendChild(percentageBar);
    }

    return rowElement;
}

/* The VizTooltip class is a custom HTML element that displays a tooltip with header and details, and
allows customization of the maximum value and color. */
class VizTooltip extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(containerTemplate.content.cloneNode(true));

        this._tooltipContainer = this._shadowRoot.querySelector('.tooltip-container');

        this._props = { };
        this._max = 100;
        this._color = 'lightblue';

        this.render();
    }

    /**
     * The `render` function updates the content and styling of a tooltip container based on the
     * provided props and color.
     */
    render() {
        this._tooltipContainer.innerHTML = '';

        if (this._props.header) {
            this._tooltipContainer.appendChild(tooltipEntryToRow(this._props.header, true, this._max));
        }

        if (this._props.details) {
            this._props.details?.forEach(detailsRow => {
                this._tooltipContainer.appendChild(tooltipEntryToRow(detailsRow));
            })
        }

        if (this._color) {
            const percentageColorReg = /progress::\-webkit\-progress\-value\s+\{\s+background-color:\s+[#a-z0-9]+\s?;\s+}/;
            const styleElement = this._shadowRoot.querySelector('style');
            const styleContent = styleElement.textContent.replace(
                percentageColorReg,
                `progress::-webkit-progress-value { background-color: ${this._color}; }`
            );
            styleElement.innerHTML = styleContent;
        }
    }

    /**
     * The function sets the extension data to a given value and then renders the updated data.
     * @param value - The value parameter is the data that you want to set as the extension data.
     */
    setExtensionData (value) {
        this._props = value;
        this.render();
    }

   /**
    * The function sets the maximum value and triggers a render.
    * @param value - The value parameter represents the maximum value that you want to set.
    */
    set max(value) {
        this._max = value;
        this.render();
    }

    /**
     * The function sets the color value and triggers a render.
     * @param value - The value parameter is the new color value that you want to set for the object.
     */
    set color(value) {
        this._color = value;
        this.render();
    }
}

customElements.define('viz-tooltip', VizTooltip);

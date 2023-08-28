/* The line `const OverlayContainerTemplate = document.createElement('template');` is creating a new
HTML template element called `OverlayContainerTemplate`. This template will be used to define the
structure and content of the overlay container element in the chart overlay component. */
const OverlayContainerTemplate = document.createElement('template');
OverlayContainerTemplate.innerHTML = `
    <style>
        .chart-overlay-container {
            position: relative;
            pointer-events: none;
            overflow: hidden;
        }
        .series-bar-column-container {
            background-color: transparent;
        }
        .series-bar-column {
            width: 100%;
            height: 100%;
        }
        .axis-label-container {
            position: absolute;
            display: flex;
            height: 18px;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: flex-end;
            background-color: transparent;
        }
        .axis-label {
            text-overflow: ellipsis;
        }
        .axis-label-icon {
            padding-left: 4px;
        }
        .common-label {
            position: absolute;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
        }
    </style>
    <div class="chart-overlay-container"/>
`;

/* The above code is creating a new HTML template element using JavaScript. */
const BarColumnTemplate = document.createElement('template');
BarColumnTemplate.innerHTML = `<div class="series-bar-column-container">
</div>`;

/* The above code is creating a new HTML template element called "AxisLabelTemplate" using JavaScript. */
const AxisLabelTemplate = document.createElement('template');
AxisLabelTemplate.innerHTML = `
    <span class="axis-label-container">
        <span class="axis-label"></span>
        <img class="axis-label-icon"
            width="22"
            height="22"
        >
    </span>
`;

/* The above code is defining a JavaScript object called `iconMap`. This object maps certain strings
(such as 'California', 'Nevada', 'Carbonated Drinks', etc.) to corresponding URLs of icons. These
icons are likely used for displaying visual representations or symbols associated with the mapped
strings in a user interface. */
const iconMap = {
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

// For PoC
/* The `ChartOverlayComponent` class is a JavaScript class that represents a chart overlay component
with various rendering options. */
class ChartOverlayComponent extends HTMLElement {

    constructor() {
        super();

        this._rounded = true;
        this._sizeIncrement = 0;
        this._axisLabelColor = '#333';

        this._shadowRoot = this.attachShadow({mode: 'open'});
        const container = OverlayContainerTemplate.content.cloneNode(true);
        this._containerElement = container.querySelector('.chart-overlay-container');
        this._shadowRoot.appendChild(container);
    }


    /**
     * The `render` function is responsible for rendering a chart on a container element with specified
     * dimensions and clip path.
     * @returns If the chart type is not included in the supportedChartTypes array, nothing is being
     * returned.
     */
    render() {
        /* The above code is setting the innerHTML property of the _containerElement to an empty
        string, effectively clearing its contents. */
        this._containerElement.innerHTML = '';

        const supportedChartTypes = [
            'barcolumn',
            'stackedbar',
            'line',
            'area',
        ];

        if (!supportedChartTypes.includes(this._chartType)) {
            return;
        }

        const { width: chartWidth, height: chartHeight } = this._size;
        const { y: clipPathY, height: clipPathHeight } = this._clipPath;
        this._containerElement.setAttribute(
            'style',
            `position: relative; pointer-events: none; overflow: hidden; width: ${chartWidth}px; height: ${chartHeight}px; clip-path: inset(${clipPathY}px 0 ${chartHeight - clipPathY - clipPathHeight}px 0);`
        );

       /* The above code is iterating over each element in the `_series` array and calling the
       `renderASeries` function for each element. It passes an object `options` as an argument to
       the `renderASeries` function, which contains properties such as `color`, `showAsTriangle`,
       and `isLast`. The purpose of this code is to render a series of data, with each series having
       its own color and display options. */
        this._series.forEach((singleSeries, index) => {
            const options = {
                color: singleSeries.color,
                showAsTriangle: singleSeries.showAsTriangle,
                isLast: index === 0,
            };
            this.renderASeries(singleSeries, options);
        });

        this.renderAxisLabels(this._xAxisLabels);
        this.renderAxisLabels(this._yAxisLabels);
        this.renderAxisStackLabels(this._xAxisStackLabels);
        this.renderAxisStackLabels(this._yAxisStackLabels);

   /* The above code is a JavaScript code snippet. However, it is incomplete and does not perform any
   specific task. It appears to be a closing curly brace without any corresponding opening curly
   brace, which makes it invalid syntax. */
    }

   /**
    * The function "renderASeries" iterates over each data point in a single series and calls two other
    * functions, "renderData" and "renderLabel", passing in the data and label information along with
    * some options.
    * @param singleSeries - The `singleSeries` parameter is an object that represents a series of data
    * points. It contains an array called `dataPoints` which holds individual data points.
    * @param options - The `options` parameter is an object that contains additional configuration
    * options for rendering the series. It can include properties such as color, size, font, and any
    * other styling or formatting options that are relevant to the rendering process.
    */
    renderASeries(singleSeries, options) {
        singleSeries.dataPoints.forEach((dataPoint) => {
            const { dataInfo, labelInfo } = dataPoint;
            this.renderData(dataInfo, options);
            this.renderLabel(labelInfo, options);
        });
    }

    /**
     * The `renderData` function is used to render data elements on a chart, applying various styles
     * and positioning based on the provided data and options.
     * @param dataInfo - An object containing information about the data to be rendered. It includes
     * the following properties:
     * @param options - The `options` parameter is an object that contains additional configuration
     * options for rendering the data. It can have the following properties:
     * @returns The function does not have a return statement.
     */
    renderData(dataInfo, options) {
        if (!dataInfo) {
            return;
        }
        let { x, y, width, height } = dataInfo;
        const dataElement = BarColumnTemplate.content.cloneNode(true);
        const barColumnContainer = dataElement.querySelector('.series-bar-column-container');
        const increment = this._sizeIncrement / 100;
        let roundedStyle = '';
        if (options?.showAsTriangle) {
            const originalWidth = width;
            const originalHeight = height;
            width = height = (Math.min(originalWidth, originalHeight) / 2) * (1 + increment);
            x = width === originalWidth ? x : x + (originalWidth - width) / 2;
            y = height === originalHeight ? y : y + (originalHeight - height) / 2;
            roundedStyle = `border-radius: ${height/2 + 3}px;`;
        } else {
            switch(this._chartType) {
            case 'barcolumn':
            case 'stackedbar':
                if (this._isHorizontal) {
                    height = height * (1 + increment);
                    y = y - height * increment / 2;
                    if (this._chartType === 'stackedbar' && !options.isLast) {
                        break;
                    }
                    roundedStyle = `border-radius: 0 ${height / 2}px ${height / 2}px 0;`;
                } else {
                    width = width * (1 + increment);
                    x = x - width * increment / 2;
                    if (this._chartType === 'stackedbar' && !options.isLast) {
                        break;
                    }
                    roundedStyle = `border-radius: ${width / 2}px ${width / 2}px 0 0;`;
                }
                break;
            case 'line':
            case 'area':
                width = width * (1 + increment);
                height = height * (1 + increment);
                x = x - width * increment / 2;
                y = y - height * increment / 2;
                roundedStyle = `border-radius: ${height/2}px;`;
                break;
            }
        }

        const color = dataInfo.color || options.color;
        const backgroundStyle = options?.showAsTriangle ?
            `border: ${color} solid 3px;` :
            `background-color: ${color};`;
        const barStyle = this._rounded ? `${backgroundStyle} ${roundedStyle}` : backgroundStyle;
        barColumnContainer.setAttribute(
            'style',
            `${barStyle} position: absolute; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px;${dataInfo.opacity !== undefined ? `opacity: ${dataInfo.opacity};` : ''}`
        );
        this._containerElement.appendChild(dataElement);
    }

    /**
     * The `renderLabel` function creates and appends a label element to a container element with
     * specified properties.
     * @param labelInfo - An object containing information about the label to be rendered. It should
     * have the following properties:
     * @param options - The `options` parameter is an object that contains additional configuration
     * options for rendering the label. It may include properties such as `color`, which specifies the
     * color of the label text.
     * @returns The function does not return anything if `labelInfo` is falsy.
     */
    renderLabel(labelInfo, options) {
        if (!labelInfo) {
            return;
        }
        if (Array.isArray(labelInfo)) {
            labelInfo.forEach((label) => {
                this.renderLabel(label, options);
            });
            return;
        }
        const { x, y, width, height, varianceLabelType, color, fontSize } = labelInfo;
        const labelSpan = document.createElement('span');
        const bgColor = 'transparent';
        let labelColor = this._chartType.startsWith('stacked') ? '#666' : options.color;
        if (varianceLabelType !== undefined) {
            labelColor = color;
        }
        labelSpan.classList.add('common-label');
        labelSpan.setAttribute(
            'style',
            `background-color: ${bgColor}; position: absolute; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px; color: ${labelColor}; font-size: ${fontSize};`
        );
        labelSpan.innerHTML = labelInfo.formattedValue;

        this._containerElement.appendChild(labelSpan);
    }

   /* The above code is a JavaScript function called `_renderAxisLabel` that is responsible for
   rendering an axis label on a chart. */
    _renderAxisLabel(label) {
        if (!label) {
            return;
        }
        const { x, y, width, height, pointValue, formattedValue, fontSize } = label;
        const labelEl = AxisLabelTemplate.content.cloneNode(true);
        const labelContainer = labelEl.querySelector('.axis-label-container');
        const bgColor = 'transparent';
        labelContainer.setAttribute('style', `background-color: ${bgColor}; width: ${width + 36}px; left: ${x - 30}px; top: ${y - 2}px; font-size: ${fontSize};`);
        this._containerElement.appendChild(labelEl);

        const labelSpan = labelContainer.querySelector('.axis-label');
        const _axisLabelColor = this._axisLabelColor;
        labelSpan.setAttribute('style', `color: ${_axisLabelColor}`);
        labelSpan.innerHTML = formattedValue;

        const iconImg = labelContainer.querySelector('img');
        iconImg.setAttribute('src', iconMap[pointValue] || iconMap.City || iconMap.Info);
    };

    /**
     * The function "renderAxisLabels" recursively renders axis labels, either individually or as
     * nested arrays.
     * @param axisLabels - The `axisLabels` parameter is an array of labels for an axis. Each element
     * in the array represents a set of labels for a specific level or category on the axis.
     */
    renderAxisLabels(axisLabels) {
        if (axisLabels && !Array.isArray(axisLabels)) {
            this._renderAxisLabel(axisLabels);
        } else {
            axisLabels.forEach((labels) => this.renderAxisLabels(labels));
        }
    }

    /**
     * The function `renderAxisStackLabel` creates and appends a span element with a formatted value as
     * its text content, and applies styling based on the provided stackLabelInfo.
     * @param stackLabelInfo - An object containing information about the stack label to be rendered.
     * It has the following properties:
     * @returns nothing if `stackLabelInfo` is falsy.
     */
    renderAxisStackLabel(stackLabelInfo) {
        if (!stackLabelInfo) {
            return;
        }
        const stackLabelSpan = document.createElement('span');
        stackLabelSpan.classList.add('common-label');
        const axisLabelColor = this._axisLabelColor;
        const bgColor = 'transparent';
        const {
            x, y, width, height, formattedValue, fontSize
        } = stackLabelInfo;
        stackLabelSpan.setAttribute(
            'style',
            `background-color: ${bgColor}; color: ${axisLabelColor}; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px; font-size: ${fontSize};`
        );
        stackLabelSpan.textContent = formattedValue;
        this._containerElement.appendChild(stackLabelSpan);
    }

    /**
     * The function recursively renders axis stack labels, either individually or as an array.
     * @param axisStackLabels - The parameter `axisStackLabels` is an array of stack labels for an
     * axis. Each stack label represents a group of data points that are stacked together on the axis.
     * @returns If `axisStackLabels` is falsy (e.g. `null`, `undefined`, `false`, or an empty string),
     * nothing is returned. Otherwise, if `axisStackLabels` is not falsy and is not an array, the
     * function `renderAxisStackLabel` is called with `axisStackLabels` as an argument. If
     * `axisStackLabels` is an array, the
     */
    renderAxisStackLabels(axisStackLabels) {
        if (!axisStackLabels) {
            return;
        }
        if (axisStackLabels && !Array.isArray(axisStackLabels)) {
            this.renderAxisStackLabel(axisStackLabels);
        } else {
            axisStackLabels.forEach((stackLabels) => {
                this.renderAxisStackLabels(stackLabels);
            });
        }
    }

    /**
     * The function sets the extension data and then renders the chart.
     * @param extensionData - extensionData is an object that contains various properties related to a
     * chart extension. These properties include:
     */
    setExtensionData(extensionData) {
        const {
            chartType,
            isHorizontal,
            chartSize,
            clipPath,
            series,
            xAxisLabels,
            xAxisStackLabels,
            yAxisLabels,
            yAxisStackLabels,
        } = extensionData;
        this._size = chartSize;
        this._clipPath = clipPath;
        this._series = series;
        this._xAxisLabels = xAxisLabels;
        this._yAxisLabels = yAxisLabels;
        this._xAxisStackLabels = xAxisStackLabels;
        this._yAxisStackLabels = yAxisStackLabels;
        this._chartType = chartType;
        this._isHorizontal = isHorizontal;
        this.render();
    }

    /**
     * The function sets the value of the "rounded" property and triggers a render.
     * @param value - The value parameter is the new value that you want to set for the rounded
     * property.
     */
    set rounded(value) {
        this._rounded = value;
        this.render();
    }

    /**
     * The function sets the size increment value and triggers a render.
     * @param value - The value parameter is the new value that you want to set for the sizeIncrement
     * property.
     */
    set sizeIncrement(value) {
        this._sizeIncrement = value;
        this.render();
    }

    /**
     * The function sets the color of the axis labels and triggers a render.
     * @param value - The value parameter is the new color value that you want to set for the axis
     * label.
     */
    set axisLabelColor(value) {
        this._axisLabelColor = value;
        this.render();
    }
}

/* The above code is defining a custom element called 'viz-overlay' using the JavaScript
customElements.define() method. It is associating this custom element with a class called
ChartOverlayComponent, which is likely a custom component for displaying overlays on a chart or
visualization. */
customElements.define('viz-overlay', ChartOverlayComponent);

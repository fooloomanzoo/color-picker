import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, htmlLiteral } from '@polymer/polymer/lib/utils/html-tag.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';;
import { ColorMixin } from '@fooloomanzoo/property-mixins/color-mixin.js';
import { InputPickerPattern } from '@fooloomanzoo/input-picker-pattern/input-picker-pattern.js';
import { resetButtonTemplate } from '@fooloomanzoo/input-picker-pattern/form-element-mixin.js';
import { getBoundingClientRectByRelative } from '@fooloomanzoo/input-picker-pattern/input-pattern.js';
import { ColorBadgePattern } from '@fooloomanzoo/color-input/color-badge.js';
import { ColorTextInputPattern, ColorFormMixin } from '@fooloomanzoo/color-input/color-text-input.js';
import { ColorInputPattern } from '@fooloomanzoo/color-input/color-input.js';
import { ColorElementPattern } from './color-element.js';
import { style as dropdownStyle } from '@fooloomanzoo/input-picker-pattern/dropdown-style.js';

/**
 * Mixin for color-picker
 *
 * @mixinFunction
 * @polymer
 */
export const ColorPickerPattern = dedupingMixin(superClass => {
  return class extends superClass {

    /**
     * the expected input type, that should be polyfilled, if not available
     * @type {string}
     */
    static get expectedNativeInputType() {
      return htmlLiteral`color`;
    }

    static get styleTemplate() {
      return html`
        ${super.styleTemplate || html``}
        <style>
          input.native {
            --input-background: transparent;
            --input-focus-background: transparent;
            border-radius: var(--input-border-radius, var(--color-badge-radius, 0.2em));
            height: var(--color-badge-height, 100%);
            width: var(--color-badge-width, 1.5em);
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            border-width: var(--input-border-width, thin);
            border-style: solid;
            border-color: var(--input-border-color, rgba(0,0,0,0.2));
          }
          #buttons #colorBadgeContainer {
            position: relative;
            display: inline-flex;
            min-width: var(--color-badge-width, 1.5em);
            align-self: stretch;
            flex: 1;
            margin-right: var(--input-picker-padding);
            box-sizing: border-box;
          }
          #buttons #colorBadge {
            background-color: rgba(255,255,255,0.8);
            position: relative;
            border-radius: var(--input-icon-border-radius);
            height: 100%;
            width: 100%;
            border-bottom-left-radius: inherit;
            pointer-events: none;
          }
          #buttons #colorBadge:hover {
            border-color: var(--inner-input-focus-background);
          }
          #buttons #formats {
            font-size: 0.9em;
            margin-right: var(--input-picker-padding);
          }
          #buttons :first-child {
            border-bottom-left-radius: var(--computed-inner-border-radius);
          }
          #buttons :last-child {
            border-bottom-right-radius: var(--computed-inner-border-radius);
          }
          ::-webkit-color-swatch {
            border-radius: var(--input-border-radius, var(--color-badge-radius, 0.2em));
            border: none;
          }
          ::-webkit-color-swatch-wrapper {
            padding: 0;
          }
          ::-moz-color-swatch {
            border-radius: var(--input-border-radius, var(--color-badge-radius, 0.2em));
            border: none;
          }
        </style>
      `;
    }

    /**
     * template for native input element
     * @type {string}
     */
    static get nativeInputTemplate() {
      return html`
        <template is="dom-if" if="[[_computeShouldNative(native)]]" restamp>
          <div id="input">
            <input class="native" type="color" disabled$="[[disabled]]" readonly="[[disabled]]" required="[[required]]" value="{{hex::input}}">
            ${this.textInputTemplate}
            ${resetButtonTemplate}
          </div>
        </template>
      `;
    }

    static get buttonTemplate() {
      // draw in the button area a badge with the current color
      return html`
        <div id="colorBadgeContainer" hidden$="[[autoConfirm]]" on-tap="confirm">
          ${super.colorBadgeTemplate}
        </div>
        <select id="formats" value="{{format::change}}" on-keydown="_stopPropagation">
          <option value="auto">auto</option>
          <option value="rgb">rgb</option>
          <option value="hex">hex</option>
          <option value="hsl">hsl</option>
        </select>
        <template is="dom-if" if="[[autoConfirm]]">
          <div style="flex:1;"></div>
        </template>
        ${super.buttonTemplate || html``}
      `;
    }

    static get pickerTemplate() {
      return html`
        <div id="picker" class="dropdown">
          ${this.colorElementTemplate}
        </div>
      `;
    }

    static get colorBadgeTemplate() {
      // replace color-inputs badge with a badge that draws the confirmed value
      return html`
        <button id="confirmedColorBadge" class="transparency badge" on-tap="_resetValue">
          <canvas id="confirmedColor" width$="[[_confirmedColorWidth]]" height$="[[_confirmedColorHeight]]"></canvas>
        </button>
      `;
    }

    static get properties() {
      return {
        _confirmedColorHeight: {
          type: Number
        },

        _confirmedColorWidth: {
          type: Number
        },

        _confirmedColorCanvasContext: {
          type: CanvasRenderingContext2D
        }
      }
    }

    static get observers() {
      return [
        '_drawConfimedColorBadge(_confirmedColorCanvasContext, confirmedValue, _confirmedColorWidth, _confirmedColorHeight)'
      ]
    }

    ready() {
      super.ready();
      this._computeConfirmedColorContext();
    }

    connectedCallback() {
      super.connectedCallback();
      this._computeConfirmedColorSizeProperties();
    }

    render() {
      super.render();
      this._drawConfimedColorBadge(this._confirmedColorCanvasContext, this.confirmedValue, this._confirmedColorWidth, this._confirmedColorHeight);
    }

    resize() {
      super.resize();
      this._computeConfirmedColorSizeProperties();
    }

    /**
     * reset the color properties
     */
    reset(value) {
      super.reset(value);
      this._setConfirmedValue();
    }

    /**
     * computes the canvas context of the recent color badge
     */
    _computeConfirmedColorContext() {
      const confirmedColorCanvas = this.shadowRoot.querySelector('#confirmedColor');
      if (confirmedColorCanvas) {
        const confirmedColorCanvasContext = confirmedColorCanvas.getContext("2d");
        confirmedColorCanvasContext.beginPath();
        this._confirmedColorCanvasContext = confirmedColorCanvasContext;
      }
    }

    /**
     * computes the size properties for the confirmed color badge canvas
     */
    _computeConfirmedColorSizeProperties() {
      // use the container of the badge to define its draw area
      requestAnimationFrame(() => {
        const confirmedColorBadgeContainer = this.shadowRoot.querySelector('#confirmedColorBadge');
        if (confirmedColorBadgeContainer) {
          const box = getBoundingClientRectByRelative(confirmedColorBadgeContainer, true);
          if (box.width !== this._confirmedColorHeight || box.height !== this._confirmedColorWidth) {
            this.setProperties({
              _confirmedColorWidth: Math.ceil(box.width) || 28,
              _confirmedColorHeight: Math.ceil(box.height) || 28
            });
          }
        }
      });
    }

    _drawConfimedColorBadge(confirmedColorCanvasContext, value, width, height) {
      if (confirmedColorCanvasContext === undefined || width === undefined || height === undefined) {
        return;
      }
      this._draw(confirmedColorCanvasContext, typeof value === 'string' ? value : 'rgba(0,0,0,0)', width, height);
    }

    _openedChanged(opened) {
      super._openedChanged(opened);
      if (opened) {
        this.resize();
        requestAnimationFrame(() => {
          this.render();
        });
      }
    }

    _onDblClick() {
      this.confirm();
    }

    _addClickListenerForBadge() {}

    _removeClickListenerForBadge() {}

    _resetValue(e) {
      this._activeProperty = null;
      super._resetValue(e);
      this.$.saturation.focus();
    }
  }
});
/**
 *  `color-picker` is a picker for color for **[Polymer](https://github.com/Polymer/polymer)** that can use the native input, too. If the **native** picker is choosen and is not supported, this element uses the **polyfill** datetime-picker. The `<calendar-element>` and the `<time-element>` will come in place if the native picker is not available or is not explicitly wanted. `css-value` will give you directly the css-string.
 *
 *  ```html
 *    <color-picker value="{{value}}"></color-picker>
 *  ```
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--transparency-pattern` | background pattern for the transparency layer | linear-gradient(45deg, rgba(0,0,0,0.15) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.15)), linear-gradient(45deg, rgba(0,0,0,0.15) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.15)))
 * `--transparency-pattern-size` | size transparency pattern | 12px
 * `--color-element-badge-radius` | border-radius of the badge | --input-picker-border-radius, 6px
 * `--color-element-height` | height of the selector badge and the alpha- and the hue-slider| 184px
 * `--color-element-width` | width of the selector badge | 184px
 * `--color-slider-width` | width of the alpha- and the hue-slider | 16px
 * `--color-slider-padding` | padding of the alpha- and the hue-slider | 2px
 * `--color-pin-radius` | radius of the color pin | 3px
 * `--color-selector-mix-blend-mode` | mix-blend-mode of the selectors (sliders and color pin) | exclusion
 * `--color-element` | mixin applied to the color element | {}
 *
 *  Have a look at `<color-element>` and [input-picker-pattern#input-shared-style](https://github.com/fooloomanzoo/input-picker-pattern#input-shared-style) to see the used style-properties.
 *
 *  @polymer
 *  @customElement
 *
 *  @appliesMixin ColorPickerPattern
 *  @appliesMixin ColorElementPattern
 *  @appliesMixin ColorInputPattern
 *  @appliesMixin ColorTextInputPattern
 *  @appliesMixin ColorBadgePattern
 *  @appliesMixin ColorFormMixin
 *  @appliesMixin ColorMixin
 *  @appliesMixin InputPickerPattern
 *
 *  @demo demo/color-picker.html Color Picker
 *  @demo demo/form.html In A Form
 **/
export class ColorPicker extends ColorPickerPattern(ColorElementPattern(ColorInputPattern(ColorTextInputPattern(ColorBadgePattern(ColorFormMixin(ColorMixin(InputPickerPattern(PolymerElement)))))))) {

  static get is() {
    return 'color-picker';
  }

  get _hasNative() {
    return ColorPicker._hasNative;
  }

  static get styleTemplate() {
    return html`
      ${super.styleTemplate || html``}
      ${dropdownStyle}
    `;
  }
}

if (!customElements.get(ColorPicker.is)) {
  customElements.define(ColorPicker.is, ColorPicker);
}

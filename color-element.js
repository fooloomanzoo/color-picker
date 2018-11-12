import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { ColorMixin, normalizeHsl } from '@fooloomanzoo/property-mixins/color-mixin.js';
import { normalizedClamp, mathMod, safeAdd } from '@fooloomanzoo/property-mixins/number-utilities.js';
import { FormElementMixin } from '@fooloomanzoo/input-picker-pattern/form-element-mixin.js';
import { getBoundingClientRectByRelative } from '@fooloomanzoo/input-picker-pattern/input-pattern.js';
import { ColorFormMixin } from '@fooloomanzoo/color-input/color-text-input.js';
import { style as inputPickerStyle } from '@fooloomanzoo/input-picker-pattern/input-picker-shared-style.js';
import { style as transpenrencyPatternStyle } from '@fooloomanzoo/color-input/transparency-pattern-style.js';

/**
 * Mixin for color-element
 *
 * @mixinFunction
 * @polymer
 */
export const ColorElementPattern = dedupingMixin(superClass => {
  return class extends superClass {

    static get styleTemplate() {
      return html`
        ${inputPickerStyle}
        ${transpenrencyPatternStyle}
        ${super.styleTemplate || html``}
        <style>
          :host {
            --computed-inner-border-radius: calc(var(--color-element-badge-radius, var(--input-picker-border-radius, 0.3em)) - var(--input-picker-padding, 0.5em)/2);
          }
          #colorElement {
            color: var(--input-picker-color);
            background-color: var(--input-picker-background);
            border-radius: var(--color-element-badge-radius, var(--input-picker-border-radius, 0.3em));
            padding: var(--input-picker-padding, 0.5em);
            display: inline-flex;
            flex-direction: column;
            position: relative;
          }
          #colorElement .selectors {
            display: inline-flex;
            flex-direction: row;
            flex-wrap: nowrap:
            position: relative;
            box-sizing: content-box;
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            outline: none;
          }
          #colorElement .selectors > * {
            position: relative;
            height: var(--color-element-height, 184px);
            background: transparent;
            cursor: pointer;
            box-sizing: border-box;
            border-radius: 0;
            overflow: visible;
          }
          #colorElement .selectors > :first-child {
            border-top-left-radius: var(--computed-inner-border-radius);
          }
          #colorElement .selectors > :last-child {
            border-top-right-radius: var(--computed-inner-border-radius);
          }
          #colorElement canvas {
            pointer-events: all;
            position: absolute;
            border-radius: inherit;
            outline: none;
            left: 0;
            top: 0;
          }
          #colorElement .selectors > :not(:first-child) {
            margin-left: var(--input-picker-padding);
          }
          #colorElement .badge {
            margin: 0;
            background: transparent;
            box-shadow: none;
          }
          #colorElement #saturationBadge {
            cursor: crosshair;
            width: var(--color-element-width, 184px);
            flex: 1 0 auto;
          }
          #colorElement #hueBadge,
          #colorElement #alphaBadge {
            width: var(--color-slider-width, 16px);
          }
          #colorElement #alphaBadge {
            background: #fff;
          }
          #colorElement .selector {
            position: absolute;
            top: 0; left: 0;
            border-width: thin;
            border-style: solid;
            border-color: #fff;
            z-index: 1;
            box-sizing: border-box;
            overflow: hidden;
            background-color: transparent;
            transition-property: background-color;
            transition-duration: 150ms;
            transition-timing-function: var(--input-transition-timing-function, cubic-bezier(0.6, 1, 0.2, 1));
            mix-blend-mode: difference;
            pointer-events: none;
          }
          #colorElement .selectors canvas.active ~ .selector,
          #colorElement .selectors canvas:focus ~ .selector {
            background-color: rgba(255,255,255,0.3);
          }
          #colorElement .slider {
            padding: var(--color-slider-padding, 2px);
            width: 100%;
            border-radius: 2px;
            transform: translateY(-50%);
          }
          #colorElement .pin {
            padding: var(--color-pin-radius, 3px);
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }
          #colorElement canvas.active {
            cursor: none;
          }
          #colorElement #buttons {
            display: inline-flex;
            flex-direction: row;
            position: relative;
            align-items: flex-end;
            align-self: stretch;
            flex: 0 0 auto;
            margin-top: var(--input-picker-padding);
          }
          #colorElement #buttons #formats {
            align-self: stretch;
          }
          @media (pointer:coarse) {
            canvas.active ~ .pin {
              opacity: 1;
            }
            #colorElement #hueBadge,
            #colorElement #alphaBadge {
              width: var(--color-slider-width, 20px);
            }
          }
        </style>
      `;
    }

    static get colorElementTemplate() {
      return html`
        <div id="colorElement">
          <div class="selectors" tabindex>
            <div id="saturationBadge">
              <canvas id="saturation" prop="color" tabindex="0" width$="[[_saturationWidth]]" height$="[[_saturationHeight]]" on-dblclick="_onDblClick" on-track="_onTrack" on-down="_onDown" on-up="_onUp" on-blur="_onColorElementBlur" on-focus="_onColorElementFocus" on-keydown="_onKeyDown"></canvas>
              <div id="colorPin" class="selector pin" prop="color" hidden$=[[!valueIsSet]]></div>
            </div>
            <div id="alphaBadge" class="transparency" hidden$="[[withoutAlpha]]">
              <canvas id="alpha" prop="alpha" tabindex="0" width$="[[_sliderWidth]]" height$="[[_saturationHeight]]" on-track="_onTrack" on-down="_onDown" on-tap="_onUp" on-blur="_onColorElementBlur" on-focus="_onColorElementFocus" on-keydown="_onKeyDown"></canvas>
              <div id="alphaSlider" class="selector slider" prop="alpha"></div>
            </div>
            <div id="hueBadge">
              <canvas id="hue" prop="hue" tabindex="0" width$="[[_sliderWidth]]" height$="[[_saturationHeight]]" on-track="_onTrack" on-down="_onDown" on-tap="_onUp" on-blur="_onColorElementBlur" on-focus="_onColorElementFocus" on-keydown="_onKeyDown"></canvas>
              <div id="hueSlider" class="selector slider" prop="hue"></div>
            </div>
          </div>
          <div id="buttons">
            ${this.buttonTemplate}
          </div>
        </div>
      `;
    }

    /**
     * template for control buttons
     * @type {string}
     */
    static get buttonTemplate() {
      return html`
        <button id="random" class="icon random" on-click="randomColor" on-keydown="_stopPropagation" hidden$="[[hideRandomButton]]">
          <svg viewBox="0 0 24 24">
            <g><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></g>
          </svg>
        </button>
        ${super.buttonTemplate || html``}
      `;
    }

    static get properties() {
      return {
        _sliderWidth: {
          type: Number
        },

        _saturationHeight: {
          type: Number,
          value: 184
        },

        _saturationWidth: {
          type: Number,
          value: 184
        },

        _hueContext: {
          type: CanvasRenderingContext2D
        },

        _saturationContext: {
          type: CanvasRenderingContext2D
        },

        _alphaContext: {
          type: CanvasRenderingContext2D
        },

        /**
         * if true the random button is hidden
         */
        hideRandomButton: {
          type: Boolean
        }
      };
    }

    static get observers() {
      return [
        '_initializeHueSlider(_hueContext, _sliderWidth, _saturationHeight, withoutAlpha)',
        '_drawColorElement(_alphaContext, _saturationContext, h, _sliderWidth, _saturationWidth, _saturationHeight)',
        '_moveHueSlider(h, _saturationHeight)',
        '_moveAlphaSlider(alpha, _saturationHeight, withoutAlpha)',
        '_moveColorPin(s, l, _saturationWidth, _saturationHeight)'
      ]
    }

    ready() {
      super.ready();
      this._computeColorElementContexts();
    }

    connectedCallback() {
      super.connectedCallback();
      this._computeColorElementSizeProperties();
    }

    /**
     * render the element
     */
    render() {
      super.render && super.render();
      this._drawColorElement(this._alphaContext, this._saturationContext, this.h, this._sliderWidth, this._saturationWidth, this._saturationHeight);
      this._moveHueSlider(this.h, this._saturationHeight)
      this._moveAlphaSlider(this.alpha, this._saturationHeight);
      this._moveColorPin(this.s, this.l, this._saturationWidth, this._saturationHeight);
    }

    /**
     * resize the element
     */
    resize() {
      super.resize && super.resize();
      this._computeColorElementSizeProperties();
    }

    /**
     * computes the canvas contexts of the color element
     */
    _computeColorElementContexts() {
      let toSet = {};

      const alphaCanvas = this.shadowRoot.querySelector('#alpha');
      const saturationCanvas = this.shadowRoot.querySelector('#saturation');
      const hueCanvas = this.shadowRoot.querySelector('#hue');

      if (alphaCanvas) {
        toSet._alphaContext = alphaCanvas.getContext("2d");
        toSet._alphaContext.beginPath();
      }
      if (saturationCanvas) {
        toSet._saturationContext = saturationCanvas.getContext("2d");
        toSet._saturationContext.beginPath();
      }
      if (hueCanvas) {
        toSet._hueContext = hueCanvas.getContext("2d");
        toSet._hueContext.beginPath();
      }
      this.setProperties(toSet);
    }

    /**
     * computes the size properties for the color element canvas
     */
    _computeColorElementSizeProperties() {
      // use the container of the badge to define its draw area
      requestAnimationFrame(() => {
        let toSet = {},
          box;
        const alphaBadge = this.shadowRoot.querySelector('#alphaBadge');
        if (alphaBadge) {
          box = getBoundingClientRectByRelative(alphaBadge, true);
          if (box.width !== this._sliderWidth) {
            toSet._sliderWidth = Math.ceil(box.width) || 16;
          }
        }
        const saturationBadge = this.shadowRoot.querySelector('#saturationBadge');
        if (saturationBadge) {
          box = getBoundingClientRectByRelative(saturationBadge, true);
          if (box.width !== this._saturationWidth || box.height !== this._saturationHeight) {
            toSet._saturationWidth = Math.ceil(box.width) || 184;
            toSet._saturationHeight = Math.ceil(box.height) || 184;
          }
        }
        this.setProperties(toSet);
      });
    }

    /**
     * draw hue-sliders background
     */
    _initializeHueSlider(hueContext, sliderWidth, saturationHeight) {
      if (hueContext === undefined || sliderWidth === undefined || saturationHeight === undefined) {
        return;
      }
      let gradient = hueContext.createLinearGradient(0, 0, 1, saturationHeight);

      hueContext.clearRect(0, 0, sliderWidth, saturationHeight);
      for (let step = 0; step < 360; step += 30) {
        gradient.addColorStop(step / 360, `hsl(${step},100%,50%)`);
      }
      gradient.addColorStop(1, `hsl(0,100%,50%)`);
      hueContext.fillStyle = gradient;
      hueContext.fillRect(0, 0, sliderWidth,
        saturationHeight);
    }

    _drawColorElement(alphaContext, saturationContext, h, sliderWidth, saturationWidth, saturationHeight, withoutAlpha) {
      if (alphaContext === undefined || saturationContext === undefined || sliderWidth === undefined || saturationWidth === undefined || saturationHeight === undefined) {
        return;
      }
      let gradient;
      h = Math.round(h || 0);
      // alpha
      if (!withoutAlpha) {
        alphaContext.clearRect(0, 0, sliderWidth, saturationHeight);
        gradient = alphaContext.createLinearGradient(0, 0, 1, saturationHeight);
        gradient.addColorStop(0, `hsla(${h},100%,50%,1)`);
        gradient.addColorStop(1, `hsla(${h},100%,50%,0)`);
        alphaContext.fillStyle = gradient;
        alphaContext.fillRect(0, 0, sliderWidth, saturationHeight);
      }
      // saturation & lightness
      gradient = saturationContext.createLinearGradient(0, 0, saturationWidth, 1);
      gradient.addColorStop(0, `hsl(${h},100%,100%)`);
      gradient.addColorStop(1, `hsl(${h},100%,50%)`);
      saturationContext.fillStyle = gradient;
      saturationContext.fillRect(0, 0, saturationWidth, saturationHeight);
      gradient = saturationContext.createLinearGradient(0, 0, 1, saturationHeight);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,1)');
      saturationContext.fillStyle = gradient;
      saturationContext.fillRect(0, 0, saturationWidth, saturationHeight);
    }

    _moveHueSlider(h, height) {
      this._moveSelector(this.$.hueSlider, 0, height * (h || 0) / 360);
    }

    _moveAlphaSlider(alpha, height, withoutAlpha) {
      if (withoutAlpha) {
        return;
      }
      this._moveSelector(this.$.alphaSlider, 0, (1 - (isNaN(alpha) ? 1 : alpha)) * height);
    }

    _moveColorPin(s, l, width, height) {
      if (this._activeProperty === 'color') {
        return;
      }
      // convert saturation and lightness to (x,y) coordinates
      const c = s * (l < .5 ? l : 1 - l);
      const s2 = ((2 * c) / (l + c)) || 0;
      const v = 1 - (l + c);
      this._moveSelector(this.$.colorPin, width * s2, height * v);
    }

    _moveSelector(element, x, y) {
      if (element === undefined) {
        return;
      }
      element.style.left = `${Math.round(x || 0)}px`;
      element.style.top = `${Math.round(y || 0)}px`;
    }

    _onDown(e) {
      this._stopPropagation(e);
      this._onSelectEnd(e);
      this._activeProperty = null;
      this._onTrack(e);
    }

    _onTrack(e) {
      this._stopPropagation(e);
      this._getActiveProperty(e)
      if (!this._activeSelectionCanvas) {
        this._defineActiveCanvas();
      }
      const rect = this._activeSelectionRect;

      let offsetY = (e.detail.y || e.clientY) - rect.top;
      // check if vertically out of bounds
      if (offsetY > rect.height) {
        offsetY = rect.height;
      } else if (offsetY < 0) {
        offsetY = 0;
      }

      switch (this._activeProperty) {
        case 'alpha':
          this.alpha = +normalizedClamp((rect.height - offsetY) / rect.height).toFixed(2);
          break;
        case 'hue':
          this.h = mathMod(Math.floor(359 * offsetY / rect.height), 360);
          break;
        case 'color':
          let offsetX = (e.detail.x || e.clientX) - rect.left;
          // check if horizontal out of bound
          if (offsetX > rect.width) {
            offsetX = rect.width;
          } else if (offsetX < 0) {
            offsetX = 0;
          }

          const s = offsetX / rect.width;
          const v = 1 - offsetY / rect.height;
          const c = (2 - s) * v;

          this.setProperties(normalizeHsl({
            h: this.h || 0,
            s: c === 0 ? 0 : +(s * v / (c < 1 ? c : 2 - c)),
            l: +(c / 2)
          }));
          // move color pin so that the position is garanteed to be defined by the last cursor position (black defines in hsl the complete lower area)
          this._moveSelector(this.$.colorPin, offsetX, offsetY);
      }
      if (e.detail.state && e.detail.state === 'end') {
        this._onSelectEnd(e);
      }
    }

    _onKeyDown(e) {
      if (this._activeProperty) {
        switch (this._activeProperty) {
          case 'alpha':
            if (!this.alphaMode) {
              this.alphaMode = true;
            }
            if (e.keyCode === 38) { // up
              this.alpha = normalizedClamp(safeAdd(this.alpha, 0.01));
              e.preventDefault(); e.stopPropagation();
            } else if (e.keyCode === 40) { // down
              this.alpha = normalizedClamp(safeAdd(this.alpha, -0.01));
              e.preventDefault(); e.stopPropagation();
            }
            break;
          case 'hue':
            if (e.keyCode === 38) { // up
              this.h = Math.round(this.h - 1);
              e.preventDefault(); e.stopPropagation();
            } else if (e.keyCode === 40) { // down
              this.h = Math.round(this.h + 1);
              e.preventDefault(); e.stopPropagation();
            }
            break;
          case 'color':
            if (!this._activeSelectionRect) {
              this._activeSelectionCanvas = this.$.saturation;
              this._activeSelectionRect = this._activeSelectionCanvas.getBoundingClientRect();
              // this._activeSelectionCanvas.classList.add('active');
            }
            let ev = {
              detail: this.$.colorPin.getBoundingClientRect()
            };
            // get the the center of the pin
            ev.detail.x = ev.detail.x + ev.detail.width / 2;
            ev.detail.y = ev.detail.y + ev.detail.height / 2;
            // walk throught canvas in percent step
            if (e.keyCode === 38) { // up
              ev.detail.y = ev.detail.y - (Math.floor(this._activeSelectionRect.height / 100) || 1);
            } else if (e.keyCode === 40) { // down
              ev.detail.y = ev.detail.y + (Math.floor(this._activeSelectionRect.height / 100) || 1);
            } else if (e.keyCode === 37) { // left
              ev.detail.x = ev.detail.x - (Math.floor(this._activeSelectionRect.width / 100) || 1);
            } else if (e.keyCode === 39) { // right
              ev.detail.x = ev.detail.x + (Math.floor(this._activeSelectionRect.width / 100) || 1);
            } else {
              return;
            }
            e.preventDefault(); e.stopPropagation();
            this._onTrack(ev);
        }
      }
    }

    _onUp(e) {
      this._stopPropagation(e);
      this._onTrack(e);
      this._onSelectEnd(e);
    }

    _onDblClick() {}

    _onSelectEnd(e) {
      this._stopPropagation(e);
      if (this._activeSelectionCanvas) {
        this._activeSelectionCanvas.classList.remove('active');
      }
      this._activeSelectionCanvas = null;
      this._activeSelectionRect = null;
    }

    _onColorElementBlur(e) {
      this._onSelectEnd(e);
      this._activeProperty = null;
    }

    _onColorElementFocus(e) {
      this._onSelectEnd(e);
      this._getActiveProperty(e);
    }

    _stopPropagation(e) {
      e && e.stopPropagation && e.stopPropagation();
      e && e.detail && e.detail.sourceEvent && e.detail.sourceEvent.stopPropagation && e.detail.sourceEvent.stopPropagation();
    }

    _getActiveProperty(e) {
      if (!this._activeProperty) {
        this._activeProperty = this._checkSelectorForProperty(e)
      }
      return this._activeProperty;
    }

    _checkSelectorForProperty(e) {
      if (e.target.hasAttribute('prop')) {
        return e.target.getAttribute('prop');
      } else if (e.path) {
        for (let i = 0; i < e.path.length; i++) {
          if (e.path[i] && e.path[i].hasAttribute && e.path[i].hasAttribute('prop')) {
            return e.path[i].getAttribute('prop');
          }
        }
      }
    }

    _defineActiveCanvas() {
      switch (this._activeProperty) {
        case 'alpha':
          this._activeSelectionCanvas = this.$.alpha;
          break;
        case 'hue':
          this._activeSelectionCanvas = this.$.hue;
          break;
        default:
          this._activeSelectionCanvas = this.$.saturation;
      }
      this._activeSelectionRect = this._activeSelectionCanvas.getBoundingClientRect();
      this._activeSelectionCanvas.classList.add('active');
    }
  }
});
/**
* `<color-element>` adds a color selector to your page using Polymer.
*
* ```html
* <color-element value="{{color}}"></color-element>
* ```
* Custom property | Description | Default
* ----------------|-------------|----------
* `--transparency-pattern` | background pattern for the transparency layer | linear-gradient(45deg, rgba(0,0,0,0.15) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.15)),
linear-gradient(45deg, rgba(0,0,0,0.15) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.15)))
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
* Have a look at [input-picker-pattern#input-shared-style](https://github.com/fooloomanzoo/input-picker-pattern#input-shared-style) to see the used style-properties.
*
* @customElement
* @polymer
*
* @appliesMixin Polymer.GestureEventListeners
* @appliesMixin ColorElementPattern
* @appliesMixin ColorFormMixin
* @appliesMixin ColorMixin
* @appliesMixin FormElementMixin
*
* @demo demo/color-element.html Color Element
**/
export class ColorElement extends GestureEventListeners(ColorElementPattern(ColorFormMixin(ColorMixin(FormElementMixin(PolymerElement))))) {

  static get is() {
    return 'color-element';
  }

  static get template() {
    return html`
      ${this.styleTemplate}
      <style>
        :host {
          display: inline-flex;
        }
      </style>
      ${this.colorElementTemplate}
    `;
  }

  /**
   * template for control buttons
   * @type {string}
   */
  static get buttonTemplate() {
    return html`
      <div style="flex:1;"></div>
      ${super.buttonTemplate || html``}
    `;
  }
}

if (!customElements.get(ColorElement.is)) {
  customElements.define(ColorElement.is, ColorElement);
}

import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';;
import { ColorMixin } from '@fooloomanzoo/property-mixins/color-mixin.js';
import { InputPickerPattern } from '@fooloomanzoo/input-picker-pattern/input-picker-pattern.js';
import { OverlayPickerMixin } from '@fooloomanzoo/input-picker-pattern/overlay-picker-mixin.js';
import { ColorBadgePattern } from '@fooloomanzoo/color-input/color-badge.js';
import { ColorTextInputPattern, ColorFormMixin } from '@fooloomanzoo/color-input/color-text-input.js';
import { ColorInputPattern } from '@fooloomanzoo/color-input/color-input.js';
import { ColorElementPattern } from './color-element.js';
import { ColorPickerPattern } from './color-picker.js';
/**
 *  `<overlay-color-picker>` extends `color-picker` in an overlay.
 *
 *  ```html
 *    <overlay-color-picker value="{{value}}"></overlay-color-picker>
 *  ```
 *
 *  @polymer
 *  @customElement
 *
 *  @appliesMixin OverlayPickerMixin
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
export class OverlayColorPicker extends OverlayPickerMixin(ColorPickerPattern(ColorElementPattern(ColorInputPattern(ColorTextInputPattern(ColorBadgePattern(ColorFormMixin(ColorMixin(InputPickerPattern(PolymerElement)))))))) ) {

  static get is() {
    return 'overlay-color-picker';
  }

  get _hasNative() {
    return OverlayColorPicker._hasNative;
  }
}

if (!customElements.get(OverlayColorPicker.is)) {
  customElements.define(OverlayColorPicker.is, OverlayColorPicker);
}

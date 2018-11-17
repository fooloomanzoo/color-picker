[![Published on NPM](https://img.shields.io/npm/v/@fooloomanzoo/color-input.svg)](https://www.npmjs.com/package/@fooloomanzoo/color-picker)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@fooloomanzoo/color-picker)
[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/fooloomanzoocolor-picker)

_[API & Demo](https://fooloomanzoo.github.io/color-picker)_

## &lt;color-picker&gt;

### What is it for?

`color-picker` is a picker for color for **[Polymer](https://github.com/Polymer/polymer)** that can use the **native** input, too. It has the same approach like in [&lt;datetime-picker&gt;](https://fooloomanzoo.github.io/datetime-picker/components/datetime-picker/). If the **native** picker is choosen and is not supported, this element use the **polyfill** color-picker. The `<color-element>` will come in place if the native picker is not available or is not explicitly wanted.  The `value` and `color-string` will give you directly the css-string in the selected `format`.

### Motivation

Internally it tests the browser, if native input-type `color` is supported. You can decide to use the native or the replacements during runtime. `color-element` can also be used separately. By default, the polyfilled version is used.

It might be useful for you to use, if you like to keep the native approach of Browsers on Mobile Devices, or you like to have a different look or you would like to have a guaranteed working **color-picker**. Another use case could be for example, if you want on _mobile devices_ use the native picker, when supported, and on _desktop devices_ this polyfill.

For that purposes the attributes **native** and **native-on-mobile** are provided.

```html
  <datetime-picker native></datetime-picker>
  <datetime-picker native-on-mobile></datetime-picker>
```

### How?

The **[component page](https://fooloomanzoo.github.io/color-picker/components/color-picker/)** explains, which of the attributes you can use and how. You can see there a **[demo](https://fooloomanzoo.github.io/color-picker/components/color-picker/#/elements/color-picker/demos/demo/color-picker.html)**, too.

Examples:

#### color-picker
```html
<color-picker r="{{r}}" g="{{g}}" b="{{b}}" default="green" native="[[native]]" auto-confirm="[[autoConfirm]]"></color-picker>  
<p>
  <span> red: [[r]] </span>
  <br>
  <span> green: [[g]] </span>
  <br>
  <span> blue: [[b]] </span>  
  <br>
  <br>
  <input type="checkbox" checked="{{native::change}}">native color picker
  <br>
  <br>
  <input type="checkbox" checked="{{autoConfirm::change}}">auto confirm
</p>
```

#### Stand-alone color-element
```html
  <color-element alpha="{{alpha}}" r="{{r}}" g="{{g}}" b="{{b}}" h="{{h}}" s="{{s}}" l="{{l}}" format="{{format}}"></color-element><br>
  <p>
    <span>format </span>
    <select id="formats" value="{{format::change}}">
      <option value="auto">auto</option>
      <option value="rgb">rgb</option>
      <option value="hex">hex</option>
      <option value="hsl">hsl</option>
    </select>
    <br>
    <input type="range" min="0" max="1" step="0.01" value="{{alpha::change}}"><span> alpha: [[alpha]] </span>
    <br>
    <input type="range" min="0" max="255" step="1" value="{{r::input}}"><span> red: [[r]] </span>
    <br>
    <input type="range" min="0" max="255" step="1" value="{{g::input}}"><span> green: [[g]] </span>
    <br>
    <input type="range" min="0" max="255" step="1" value="{{b::input}}"><span> blue: [[b]] </span>
    <br>
    <input type="range" min="0" max="359" step="1" value="{{h::input}}"><span> hue: [[h]] </span>
    <br>
    <input type="range" min="0" max="1" step="0.001" value="{{s::input}}"><span> saturation: [[s]] </span>
    <br>
    <input type="range" min="0" max="1" step="0.001" value="{{l::input}}"><span> lightness: [[l]] </span>
    <br>
  </p>
```

#### Use the polyfill or the native picker
By default it checks if `color` is supported for a native input. If it is not and you have set `native`, the polyfill will be used instead of the native input. Additionally there is the attribute `native-on-mobile`.

### Styling
Have a look at [input-picker-pattern#input-shared-style](https://github.com/fooloomanzoo/input-picker-pattern#input-shared-style) to see how to style the element.

### Installation
```
npm install --save @fooloomanzoo/color-picker
```

### Contribute?
Feel free to send a new issue, a commit, a pull request or just fork it!

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/fooloomanzoo/color-picker)
[![API](https://img.shields.io/badge/API-available-green.svg)](https://www.webcomponents.org/element/fooloomanzoo/color-picker/elements/color-picker)
[![Demo](https://img.shields.io/badge/demo-available-red.svg)](https://www.webcomponents.org/element/fooloomanzoo/color-picker/demo/demo/color-picker.html)

_[Demo and API docs](https://fooloomanzoo.github.io/color-picker/components/color-picker/)_
## &lt;color-picker&gt;

### What is it for?

`color-picker` is a picker for color for **[Polymer](https://github.com/Polymer/polymer)** that can use the **native** input, too. It has the same approach like in [&lt;datetime-picker&gt;](https://fooloomanzoo.github.io/datetime-picker/components/datetime-picker/). If the **native** picker is choosen and is not supported, this element use the **polyfill** color-picker. The `<color-element>` will come in place if the native picker is not available or is not explicitly wanted.  The `value` and `color-string` will give you directly the css-string in the selected format.

### Motivation

Internally it tests the browser, if **native** input-types `color` is supported. If it is not, a `<color-element>` or a `<color-element>` will be displayed instead, according to the kind of picker you choose. You can decide to use the native or the replacements during runtime. `color-element` can also be used separately.

It might be useful for you to use, if you like to keep the native approach of Browsers like in Chrome for Desktop or Mobile, you like to have a different look or you would like to have a guaranteed working **color-picker**.

### How?

The **[component page](https://fooloomanzoo.github.io/color-picker/components/color-picker/)** explains, which of the attributes you can use and how. You can see there a **[demo](https://fooloomanzoo.github.io/color-picker/components/color-picker/#/elements/color-picker/demos/demo/color-picker.html)**, too.

Examples:

#### color-picker

<!--
```
<custom-element-demo height="300">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="color-picker.html">
    <style>
      html {
        font-family: 'Source Sans Pro', sans-serif;
      }
    </style>
    <dom-bind>
      <template is="dom-bind">
        <next-code-block></next-code-block>
      </template>
    </dom-bind>
  </template>
</custom-element-demo>
```
-->

```html
<color-picker r="{{r}}" g="{{g}}" b="{{b}}" default="green"></color-picker>  
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

<!--
```
<custom-element-demo height="300">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="color-picker.html">
    <style>
      html {
        font-family: 'Source Sans Pro', sans-serif;
      }
    </style>
    <dom-bind>
      <template is="dom-bind">
        <next-code-block></next-code-block>
      </template>
    </dom-bind>
  </template>
</custom-element-demo>
```
-->

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
bower install --save fooloomanzoo/color-picker
```
or
```
npm install --save @fooloomanzoo/color-picker
```


### Contribute?
Feel free to send a new issue, a commit, a pull request or just fork it!

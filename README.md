[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/fooloomanzoo/color-picker)
[![API](https://img.shields.io/badge/API-available-green.svg)](https://www.webcomponents.org/element/fooloomanzoo/color-picker/elements/color-picker)
[![Demo](https://img.shields.io/badge/demo-available-red.svg)](https://www.webcomponents.org/element/fooloomanzoo/color-picker/demo/demo/color-picker.html)

_[Demo and API docs](https://fooloomanzoo.github.io/color-picker/components/color-picker/)_
## &lt;color-picker&gt;

### What is it for?

`color-picker` is a picker for color for **[Polymer](https://github.com/Polymer/polymer)** that can use the **native** input, too. the approach is the same like in [&lt;datetime-picker&gt;](https://fooloomanzoo.github.io/datetime-picker/components/datetime-picker/). If the **native** picker is choosen and is not supported, this element use the **polyfill** color-picker. The `<color-element>` will come in place if the native picker is not available or is not explicitly wanted.  The `value` represents the selected `hex-color` and `alpha` the opacity of the color. `css-value` will give you directly the css-string.

### Motivation

Internally it tests the browser, if **native** input-types `color` is supported. If it is not, a `<color-element>` or a `<color-element>` will be displayed instead, according to the kind of picker you choose. You can decide to use the native or the replacements during runtime. `color-element` can also be used separately.

It might be useful for you to use, if you like to keep the native approach of Browsers like in Chrome for Desktop or Mobile, you like to have a different look or you would like to have a guaranteed working **color-picker**.

Another use case could be for example, if you want on *mobile devices* use the native picker, when supported, and on *desktop devices* this polyfill.

```html
  <color-picker native="[[isMobile]]"></color-picker>
  ...
    isMobile() {
      const ua = window.navigator.userAgent;
      return (/[mM]obi/i.test(ua) || /[tT]ablet/i.test(ua) || /[aA]ndroid/i.test(ua));
    }
  ...
```

### How?

The **[component page](https://fooloomanzoo.github.io/color-picker/components/color-picker/)** explains, which of the attributes you can use and how. You can see there a **[demo](https://fooloomanzoo.github.io/color-picker/components/color-picker/#/elements/color-picker/demos/demo/color-picker.html)**, too.

Examples:

#### Stand-alone color

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
<color-element value="{{color}}" css-value="{{cssValue}}"></color-element>
<p>value: [[color]]</p>
<p>css-value: [[cssValue]]</p>
```

#### Stand-alone color-picker

<!--
```
<custom-element-demo height="100">
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
<color-element value="{{color}}"></color-element>
```

#### Use the polyfill or the native picker
By default it checks if `color` is supported as input. If it is not and you had set `native`, the polyfill will be used instead of the native input.

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

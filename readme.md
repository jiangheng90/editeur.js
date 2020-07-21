<h1 align="center">
  <a href="https://github.com/jiangheng90/editeur.js">Editeur</a>
</h1>
<h3 align="center">
  <a href="https://github.com/jiangheng90/editeur.js">A Simple Rich Text Editor</a>
</h3>
<p align="center">
  <a title="CDN"><strong>CDN</strong></a>
  &#x2022;
  <a title="Module"><strong>Module</strong></a>
  &#x2022;
  <a title="Usage Sample"><strong>Usage Sample</strong></a>
  &#x2022;
  <a title="Note"><strong>Note</strong></a>
</p>
<p align="center">
  <a href="https://npmjs.com/package/editeurjs" title="Version">
    <img src="https://img.shields.io/npm/v/editeurjs.svg" alt="Version">
  </a>
  <a href="https://npmjs.com/package/editeurjs" title="Downloads">
    <img src="https://img.shields.io/npm/dm/editeurjs.svg" alt="Downloads">
  </a>
    <a href="https://npmjs.com/package/editeurjs" title="License">
    <img src="https://img.shields.io/npm/l/editeurjs.svg" alt="License">
  </a>
  </a>
    <a href="https://npmjs.com/package/editeurjs" title="Types">
    <img src="https://img.shields.io/npm/types/editeurjs.svg" alt="Types">
  </a>
  </a>
    <a href="https://github.com/jiangheng90/editeur.js" title="LastCommite">
    <img src="  https://img.shields.io/github/last-commit/jiangheng90/editeur.js/dev" alt="LastCommite">
  </a>
</p>

### Editeur is a rich text editor. It is build just for improving my coding skill. At begining I want to design it as a mvvm component in vue.js framwork, but when I working on it, I found many of my idea was very hard to fullfill. When I finish it I found it is no different from WYSIWYG Editor such as Quill or TinyMCE. Some of its methods such as the update document function has may problems, it may be rewrited later. I think as a tool it is far from being available to use for most users.

## CDN
import in html
```html
<script src="https://unpkg.com/editeurjs@0.2.0/dist/editeur.js"></script>

<!--in body-->
<div id="content"></div>

<!--improt in javascript-->
<script type="text/javascript">
  const ele = document.getElementById('content')
  const editor = new editeur.Editor(ele)
</script>
```

## Module

### install in npm

```Bash
npm install editeurjs
```

### use as a Module

```Javascript
import { Editor } from 'editeurjs;

const ele = document.getElementById('content');
const editor = new Editor(ele);
```

## API Reference
// In Editor class

|Methods|Instruction|Prams|
|----|----|----|
|SetFontSize|Set Font Size. You can use it to set font size in 'px' 'pt' '%' the other way to set font size is placed in SetFontStyle|size(string/number) type(string/number && option)|
|SetFontColor|Set Font Color. You can use it to set font color in rgba or Hexadecimal or other ways, just as what you can set in stylesheet|color (string)|
|
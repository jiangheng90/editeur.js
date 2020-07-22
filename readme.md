<h1 align="center">
  <a href="https://github.com/jiangheng90/editeur.js">Editeur</a>
</h1>
<h3 align="center">
  <a href="https://github.com/jiangheng90/editeur.js">A Simple Rich Text Editor</a>
</h3>
<p align="center">
  <a title="CDN" href="#cdn"><strong>CDN</strong></a>
  &#x2022;
  <a title="Module" href="#module"><strong>Module</strong></a>
  &#x2022;
  <a title="Usage" href="#usage"><strong>Usage</strong></a>
</p>
<p align="center">
  <a href="https://npmjs.com/package/editeurjs" title="Version">
    <img src="https://img.shields.io/npm/v/editeurjs.svg" alt="Version">
  </a>
  <a href="https://npmjs.com/package/editeurjs" title="Downloads">
    <img src="https://img.shields.io/npm/dm/editeurjs.svg" alt="Downloads">
  </a>
    <a href="https://www.mit-license.org/" title="License">
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

   Editeur is a rich text editor. It was designed as a component in vue.js and must be work on it. But during development, some  solution in it was fialed, so it was no need to be design like that, and I changed it into js module, and the package type is umd.there is no different in document operation from WYSIWYG Editor such as Quill or TinyMCE. But Some methods has may problems and not efficient, it may be changed later maybe. For now, I think as a tool it is far from being available for production. it just for reference only.

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
it also support es5 commonjs module import

## Usage
I have write a example of the usage. most function can be found. If you want to import it into a mvvm framework such as vue, you can see <a href="https://github.com/jiangheng90/editeur-vue">this</a>

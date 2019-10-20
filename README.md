# 介绍 

这是一款为sugar-design使用者提供代码自动提示的vscode plugin
目前支持`javascript` 和 `stylus`两种语言.
能够方便开发者在组件种通过变量`sdf`来引入各种foundation class


## 使用方法 
js:
```javascript
  import * as sdf from 'sugar-design/foundation/foundation.js';
  import classnames from 'classnames';

  <span className={classnames(sdf.c90, sdf.bodyPrimary)}>
```

颜色输入,可以支持直接输入HEX值来获得代码提示
```js
 sdf.fff // 直接属于值, 不需要输入#号 
```

stylus:
```s
@import 'sugar-design/foundation/variable.styl'

.test
  color C90
  font-weight font-weight-regular 
  body-primary()
```


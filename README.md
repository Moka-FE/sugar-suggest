# 介绍 

这是一款为sugar-design使用者提供代码自动提示的vscode extension
目前支持`javascript` 和 `stylus`两种语言.
能够方便开发者在组件种通过变量`sdf`来引入各种foundation class
或者在stylus文件中之间引入变量


## 使用方法 
js:
```javascript
  import * as sdf from 'sugar-design/foundation/foundation.js';
  import classnames from 'classnames';

  <span className={classnames(sdf.c90, sdf.bodyPrimary)}>
```


stylus:
```scss
@import 'sugar-design/foundation/variable.styl'

.test
  color c90
  font-weight fontWeightRegular 
  bodyPrimary()
```

支持直接输入HEX值来获得代码提示

## 自动引入
js: 
输入sdf,自动在文件内引入foundation文件

stylus:
输入任意变量,自动在文件内引入 variable文件

## 一些约定

建议使用默认值为foundation的挂载变量, 如果有特殊情况可以在setting中配置

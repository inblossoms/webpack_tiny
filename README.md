# miniWebPack

理解 webpack 核心思想

> WebPack 实现梳理：

- 如何读取文件的内容？
- 如何获取依赖关系？
  - 通过 @babel/parser 将读取到的文件内容解析为 AST。
  - 通过 @babel/traverse 解析 AST ，获取文件依赖
- 如何将 esm 转换成 cjs 的模块导入方式？
  - 因为 esm 文件导入 需要被放置在文件顶部，所以会有引入文件无法识别
  - 通过 babel/core 把 esm 转为 cjs.（案例实现时配置了 bundle.ejs 文件模板，从而生成组合后的 js 文件）

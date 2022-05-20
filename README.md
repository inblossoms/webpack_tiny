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

> loader 实现梳理：

- webpack 本身只能理解 js 代码，loader 就是让所有类型文件转换为 webpack 可以处理的有效模块（转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块）。
- 怎样实现 loader 机制？
  - 通过 babel 使得类型文件和 js 文件之间的一个转换 (案例中是 JSON - JS)

> plugin 实现梳理：

- 背景：webpack 在不同的阶段会发出不同的事件，通过插件编写者对事件进行监听得到插件为我们暴露出来的数据（对象），通过操作对象上的方法来改变我们打包的行为。
- 怎样实现 一个插件？
  - 底层运用了 webpack 的 tapable。（案例中实现了一个 修改目标文件的打包路径）

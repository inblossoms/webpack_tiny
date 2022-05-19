; (function (modules) {
	function require(id) {
		// 对应的路径映射函
		const [fn, mapping] = modules[id]; // 通过id获取相应的模块，解构拿到参数

		const module = {
			exports: {}
		}

		function localRequire(filePath) {
			const id = mapping[filePath];
			return require(id); // 通过模块id去查找对应的fn,之后执行fn(当前函数)
		} // 装饰器：  require获取到的是一个fileName，基于模块路径获取模块id

		fn(localRequire, module, module.exports);

		return module.exports;
	}


	// 执行入口js
	require(1);
})({
	1: [function (require, module, exports) {
		// import 必须在文件顶部。
		// 通过cjs 格式 来出来
		const { foo } = require("./foo.js");

		foo();

		console.log("main")
	}, {
		"./foo.js": 2
	}],
	2: [function (require, module, exports) {
		function foo() {
			console.log("foo");
		}

		module.exports = {
			foo
		}
	}, {}]
});
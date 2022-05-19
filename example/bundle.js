; (function (modules) {
	function require(id) {
		// 对应的路径映射函
		const [fn, mapping] = modules[id];

		const module = {
			exports: {}
		}

		function localRequire(filePath) {
			const id = mapping[filePath];
			return require(id);
		}

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
;(function(modules){
function require(id){
// 对应的路径映射函
const [fn, mapping] = modules[id];

const module = {
exports: {}
}

function localRequire(filePath){
const id = mapping[filePath];
return require(id);
}

fn(localRequire, module, module.exports);

return module.exports;
}


// 执行入口js
require(0);
})({

	0: [function (require, module, exports){
		"use strict";

var _foo = require("./foo.js");

// import user from "./user.json";
(0, _foo.foo)(); // console.log(user, "user");

console.log("main");
			},{"./foo.js":1}],
				
	1: [function (require, module, exports){
		"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

(0, _bar.bar)();

function foo() {
  console.log("foo");
}
			},{"./bar.js":2}],
				
	2: [function (require, module, exports){
		"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log('bar');
}
			},{}],
				
					});
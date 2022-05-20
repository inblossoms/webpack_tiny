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

var _user = require("./user.json");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _foo.foo)();
console.log(_user2.default, "user");
console.log("main");
			},{"./foo.js":1,"./user.json":2}],
				
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
			},{"./bar.js":3}],
				
	2: [function (require, module, exports){
		"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\r\n  \"name\": \"zhangsan\",\r\n  \"hobby\": \"law\"\r\n}\r\n";
			},{}],
				
	3: [function (require, module, exports){
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
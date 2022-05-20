import fs from 'fs';
import path from 'path';
import parser from '@babel/parser'; // 将提取的文件内容转译成ast
import traverse from '@babel/traverse'; // 解析ast获取依赖路径
import ejs from 'ejs';
import { transformFromAst } from 'babel-core';// 将esm规范转换成cjs规范
import { jsonLoader } from "./jsonLoader.js";
import { ChangeOutputPath } from "./ChangeOutputPath.js";
import { SyncHook } from "tapable";

let id = 0

const webpackConfig = {
	module: {
		rules: [{
			test: /\.json$/, // 处理文件类型
			use: [jsonLoader] // 本案例只支持JSON函数
		}]
	},
	plugins: [new ChangeOutputPath()]
}


const hooks = {
	// 初始化钩子
	emitFile: new SyncHook(["context"])
}

function createAsset(filePath) {
	// 1. 目的： 获取文件内容
	let source = fs.readFileSync((filePath), {
		encoding: 'utf-8'
	})

	// 在获取文件信息之后解析之前 将文件进行合法转换
	// initLoader
	const loaders = webpackConfig.module.rules;
	// 添加依赖
	const loaderContext = {
		addDeps(dep) {
			console.log("addDeps", dep);
		}
	}
	loaders.forEach(({ test, use }) => {
		if (test.test(filePath)) {
			if (Array.isArray(use)) {
				use.forEach((fn) => {
					source = fn.call(loaderContext, source);
				});
			}
		}
	});

	// 2. 获取依赖关系（文件之间的引用）
	const ast = parser.parse(source, {
		sourceType: 'module', // 通过配置module 通过es的模块导入
	})

	const deps = [] // 存储依赖关系
	traverse.default(ast, { // traverse: 遍历ast 获取节点拿到关键信息
		ImportDeclaration({ node }) {
			deps.push(node.source.value)
		}
	})

	const { code } = transformFromAst(ast, null, {
		presets: ['env'], // 提供转换预设，但存在问题（且该问题并没有错误提示）
	})
	// console.log(code);

	return {
		path,
		code,
		deps,
		mapping: {},
		id: id++
	}
}

// const asset = createAsset()
// console.log(asset);

// 将依赖关系进行合并 生成一个图对象
function createGraph() {
	const mainAsset = createAsset('./example/main.js') // 获取入口

	const queue = [mainAsset] // 依赖队列  

	for (const asset of queue) { // 通过广度优先收索 对依赖遍历
		asset.deps.forEach((relativePath) => {
			const child = createAsset(path.resolve('./example', relativePath))
			asset.mapping[relativePath] = child.id
			queue.push(child)
		});
	}
	return queue

}
// 初始化pligin
function initPlugins() {
	const plugins = webpackConfig.plugins;
	plugins.forEach((plugin) => {
		// 注册事件
		plugin.apply(hooks);
	});
}

initPlugins();

const graph = createGraph()

function build(graph) {
	const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' }) // 获取要编译的模板

	// 生成bundle.ejs文件所需的配置参数
	const data = graph.map((asset) => {
		const { id, code, mapping } = asset
		return {
			id, code, mapping
		}
	})

	// console.log(data);
	let outputPath = './dist/bundle.js'
	const code = ejs.render(template, { data })

	const context = {
		changeOutputPath(path) {
			outputPath = path;
		}
	}
	// 触发事件
	hooks.emitFile.call(context);

	fs.writeFileSync(outputPath, code) // 对渲染后的文件 创建出对应的文件

	// 将数据给到模板 通过模板进行渲染
}

build(graph)
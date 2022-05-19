import fs from 'fs';
import path from 'path';
import parser from '@babel/parser'; // 将提取的文件内容转译成ast
import traverse from '@babel/traverse'; // 通过ast获取依赖路径
import ejs from 'ejs';
import { transformFromAst } from 'babel-core';// 将esm规范转换成cjs规范

let id = 0

function createAsset(filePath) {
	// 1. 目的： 获取文件内容
	const source = fs.readFileSync((filePath), {
		encoding: 'utf-8'
	})

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
	console.log(code);

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


const graph = createGraph()

function build(graph) {
	const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' }) // 获取要编译的模板

	// 生成bundle.ejs文件所需的配置参数
	const data = graph.map(({ id, code, mapping }) => {
		return {
			id, code, mapping
		}
	})

	// console.log(data);
	const code = ejs.render(template, { data })
	fs.writeFileSync('./dist/bundle.js', code) // 对渲染后的文件 创建出对应的文件

	// 将数据给到模板 通过模板进行渲染
}

build(graph)
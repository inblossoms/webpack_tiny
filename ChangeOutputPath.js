export class ChangeOutputPath {
	apply(hooks) {
		hooks.emitFile.tap("changeOutputPath", (context) => {
			context.changeOutputPath("./dist/test.js")
			console.log("changeOutputPath");
		})
	}
}
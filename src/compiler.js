


function build() {

	// Get code
	source = document.getElementById("source").value;

	d = preprocessor(source)

	code = d['code']

	//Get output regex flavor
	flavor = "javascript"

	tokens = tokenise(code)

	display_tokens(tokens)

	ast = parse(tokens)

	console.log("Compiler.js - ast: " + ast.display())

	symbols = symbol_tree(ast)

	//console.log("Compiler.js - symbols:")
	//console.log(symbols)

	if (!semantics_checker(ast, symbols)) {
		//Semantics checker failed, error
		console.log("semantics_checker failed, err.r");
	}

	ir = ir_generate(ast, symbols)

	optimised_ir = optimise(ir)

	regex = translate(ir, new IRTranslator())

	console.log(regex)
}
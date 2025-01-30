

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

    consoleWrite(ast.display())

	symbols = symbol_table(ast)

	semantics_checker(ast, symbols)

	ir = ir_generate(ast, symbols)

	optimised_ir = optimise(ir)

	regex = generate_regex(ir, flavor)
}
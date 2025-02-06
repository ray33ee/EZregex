

class Symbol {
	constructor(refs) {
		this.refs = refs //Count the number of times the symbol is referenced
	}
}

class SymbolTable {

}

class SymbolVisitor extends NodeVisitor {
	constructor() {
		super();
		this.symbol_map = {} //Map symbol names to Symbol class
	}

	visit_Assignment(t, node) {
		t.symbol_map[node.id] = new Symbol(0)
		t.visit(t, node.expr)
	}

	visit_Name(t, node) {
		if (t.symbol_map[node.id] == undefined) {
			throw new UsedBeforeDeclared(node.id)
		}
		t.symbol_map[node.id].refs += 1
	}


}

function symbol_tree(ast) {

	tv = new SymbolVisitor();

	tv.visit(tv, ast)

	console.log(tv.symbol_map)

	return tv.symbol_map
}
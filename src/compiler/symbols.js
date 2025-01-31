

class Symbol {
	constructor(map, expr) {
		this.map = map;
		this.expr = expr;
	}
}

class SymbolTable {

}

class SymbolVisitor extends NodeVisitor {
	constructor() {
		super();
		this.map = {}
		this.working_id = ""
	}

	visit_Assignment(t, node) {
		t.map[node.id] = new Symbol({}, node.expr)
		t.working_id = node.id
		t.visit(t, node.expr)
	}

	visit_Name(t, node) {
		t.map[t.working_id].map[node.id] = t.map[node.id]
	}


}

function symbol_tree(ast) {
	console.log("Warning: We don't make a symbol tree just yet so the next line of code skips this step and returns null")
	return null

	tv = new SymbolVisitor();

	tv.visit(tv, ast)

	console.log(tv.map[tv.working_id])

	return tv.map[tv.working_id]
}
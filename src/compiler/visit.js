
class NodeVisitor {
	visit(t, node) {
		var method = "visit_" + String(node.constructor.name);
		var visitor = t[method];
		if (visitor === undefined) {
			visitor = t.generic_visit;
		}
		return visitor(t, node);
	}

	generic_visit(t, node) {
		var field
		for (field in node) {
			var value = node[field]

			if (value instanceof Array) {
				var item
				for (item of value) {
					t.visit(t, item)
				}
			} else if (value instanceof ASTNode) {
				t.visit(t, value)
			}


		}
	}
}


class IRTranslator {
	constructor() {
		this.regex = ""
	}

	append(str) {
		this.regex += str
	}

	translate(t, ir) {
		var item
		for (item of ir) {
			t.translate_node(t, item);
		}
	}

	translate_node(t, node) {
		var method = "translate_" + String(node.constructor.name)
		var translator = t[method]
		if (translator === undefined) {
			console.log("Error: Function '" + method + "' is not implemented")
		}
		return translator(t, node)
	}

	translate_EscapedString(t, node) {
		t.append(node.str);
	}

	translate_LeftSet(t, node) {
		t.append("["); 
	}

	translate_RightSet(t, node) {
		t.append("]"); 
	}

	translate_CharacterSet(t, node) {
		t.append(node.set)
	}

	translate_Anchor(t, node) {
		console.log("Error: Anchors not implemented")
	}

	translate_WordBoundary(t, node) {
		t.append("\\b");
	}

	translate_Alternate(t, node) {
		t.append("|")
	}

	translate_NonCaptureLeft(t, node) {
		t.append("(?:")
	}

	translate_NonCaptureRight(t, node) {
		t.append(")")
	}

	translate_NamedCaptureLeft(t, node) {
		t.append("(?<" + node.name + ">")
	}

	translate_NamedCaptureRight(t, node) {
		t.append(")")
	}

	translate_Limiting(t, node) {
		t.append("{" + node.min + "," + node.max + "}")
	}

	translate_Exact(t, node) {
		t.append("{" + node.n + "}")
	}

	translate_Optional(t, node) {
		t.append("?")
	}

	translate_Plus(t, node) {
		t.append("+")
	}

	translate_Star(t, node) {
		t.append("*")
	}
	
}

function translate(ir, translator) {

	translator.translate(translator, ir);

	return translator.regex
}
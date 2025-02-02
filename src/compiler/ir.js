

//RegexIR := 			List[Item]
//Item := 				EscapedString(str: string) |
//						CharacterSet(set: string) |
//						Anchor(type: AnchorType) |
//						WordBoundary |
//						Alternate |
//						# Groups
//						NonCaptureLeft(close: NonCaptureRight) |
//						NonCaptureRight |
//						NamedCaptureLeft(name: string, close: NamedCaptureRight) |
//						NamedCaptureRight |
//						# Repeating
//						Limiting(min: number, max: number) |
//						Exact(n: number) |
//						Optional |
//						Plus |
//						Star |



class IrNode {
	constructor() {

	}

	display() {
		var key = []
		var pairs = "" + this.constructor.name + "("	
		for (key in this) {
			if (this[key] instanceof Array) {
				var list = "["
				var element;
				for (element of this[key]) {
					list += element.display() + ", "
				}
				pairs += key + ": " + list + "], "
			} else {

				var s;

				if (typeof this[key] === 'string') {
					s = "'" + this[key] + "'"
				} else if (typeof this[key] === 'number') {
					s = this[key] + ""
				} else if (this[key] instanceof IrNode) {
					s = this[key].display()
				} else {
                    //Error, unrecognised node
                    console.log("Unknown token in IrNode '" + this[key] + "' - " + typeof(this[key]))
                }

				pairs += key + ": " + s + ", ";
			}
		}
		return pairs + ")"
	}
}

class EscapedString extends IrNode {
	constructor(str) {
		super();
		this.str = str
	}
}

class CharacterSet extends IrNode {
	constructor(set) {
		super();
		this.set = set
	}
}

class LeftSet extends IrNode {
	constructor() {
		super();
	}
}

class RightSet extends IrNode {
	constructor() {
		super();
	}
}

class Anchor extends IrNode {
	constructor(type) {
		super();
		this.type = type
	}
}

class WordBoundary extends IrNode {
	constructor() {
		super();
	}
}

class Alternate extends IrNode {
	constructor() {
		super();
	}
}

class NonCaptureLeft extends IrNode {
	constructor(close) {
		super();
		this.close = close
	}
}

class NonCaptureRight extends IrNode {
	constructor() {
		super();
	}
}

class NamedCaptureLeft extends IrNode {
	constructor(name, close) {
		super();
		this.name = name
		this.close = close
	}
}

class NamedCaptureRight extends IrNode {
	constructor() {
		super();
	}
}

class Repeating extends IrNode {
	constructor() {
		super();
	}
}

class Limiting extends Repeating {
	constructor(min, max) {
		super();
		this.min = min
		this.max = max
	}
}

class Exact extends Repeating {
	constructor(n) {
		super();
		this.n = n
	}
}

class Optional extends Repeating {
	constructor() {
		super();
	}
}

class Plus extends Repeating {
	constructor() {
		super();
	}
}

class Star extends Repeating {
	constructor() {
		super();
	}
}

class IrCreator extends NodeVisitor {

	constructor(symbols) {
		super();
		this.symbol_map = new Map();
		this.ir = []
		this.name_set = new Set();
	}

	wrap_named(name, inner) {
		var l = []
		l = l.concat(inner);
		var right = new NamedCaptureRight()
		l.unshift(new NamedCaptureLeft(name, right))
		l.push(right)	
		return l
	}

	wrap_unnamed(inner) {
		var l = []
		l = l.concat(inner);
		var right = new NonCaptureRight()
		l.unshift(new NonCaptureLeft(right))
		l.push(right)	
		return l
	}

	visit_Return(t, node) {
		t.ir = t.visit(t, node.expr)
	}

	visit_Assignment(t, node) {
		t.symbol_map.set(node.id, t.visit(t, node.expr));
	}

	visit_Name(t, node) {
		if (t.symbol_map.has(node.id)) {

			return t.wrap_named(node.id, t.symbol_map.get(node.id));
			
		} else {
			//If control flow reaches here, a variable is used before it is defined, error
			console.log("Variable '" + node.id + "' is used before it is declared")
		}
	}

	//Do we need to wrap the operands in non-capturing groups to preserve precedence?
	visit_Concatenate(t, node) {
		var l = t.visit(t, node.left);
		var r = t.visit(t, node.right);
		return l.concat(r)
	}
 
	visit_Alternation(t, node) {
		var l = t.wrap_unnamed(t.visit(t, node.left));
		var r = t.wrap_unnamed(t.visit(t, node.right));
		return l.concat(new Alternate(), r)
	}

	visit_Literal(t, node) {
		//When converting from EZR language into regex IR, we must ensure we escape regex-specific characters
		var escaped = node.value.replace(/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|\/]/g, (m) => "\\" + m);
		return [new EscapedString(escaped)];
	}

	visit_Repetition(t, node) {

		var rep;

		if ((node.start == 0 || node.start == "") && node.end === "") {
			//Star
			rep = new Star();
		} else if (node.start == 1 && node.end === "") {
			//Plus
			rep = new Plus();
		} else if (node.start == 0 && node.end == 1) {
			//optional
			rep = new Optional();
		} else if (node.start === node.end) {
			//Exact
			rep = new Exact(node.start);
		} else {
			//Limiting
			rep = new Limiting(node.start, node.end);
		}

		return t.wrap_unnamed(t.visit(t, node.expr)).concat(rep)
	}

	visit_CharacterClass(t, node) {
		return [new CharacterSet(node.set)]
	}

	visit_Complement(t, node) {
		console.lop("Character set complement not implemented yet")
	}

	visit_Intersection(t, node) {
		console.lop("Character set intersection not implemented yet")
	}

}

function ir_generate(ast, symbols) {

	creator = new IrCreator(symbols);

	creator.visit(creator, ast)

	return creator.ir
}

function ir_display(ir) {
	s = "["

	for (item of ir) {
		s += item.display() + ", "
	}
	return s + "]"
}

//AST nodes:
//----------------------------------------------------------------------------------------
//Source := 			List[Statement]
//----------------------------------------------------------------------------------------
//Statement := 			Assignment(id: identifier, expr: Expr)
//----------------------------------------------------------------------------------------
//Expr :=   	        Name(id: identifier) |
//						Concatenate(left: Expr, right: Expr) |
//						Alternate(left: Expr, right: Expr) |
//						Literal(value: String)	|
//						Repetition(expr: Expr, start: Integer, end: Integer) |
//						CharacterClass(set: String) | 
//						Not(set: Expr) |
//						Intersection(seta: Expr, setb: Expr) |
//----------------------------------------------------------------------------------------

class ASTNode {
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
					s = this[key]
				} else if (this[key] instanceof Number) {
					s = this[key] + ""
				} else {
					s = this[key].display()
				}

				pairs += key + ": " + s + ", ";
			}
		}
		return pairs + ")"
	}
}

class Source extends ASTNode {
    constructor(statements) {
    	super();
        this.statements = statements;
    }
}

class Statement extends ASTNode {
    constructor(id, expr) {
    	super();
        this.id = id;
        this.expr = expr;
    }
}

class Expr extends ASTNode {
	constructor() {
		super();
	}
}

class Name extends Expr {
    constructor(id) {
        super();
        this.id = id;
    }
}

class Concatenate extends Expr {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
}

class Alternate extends Expr {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
}

class Literal extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }
}

class Repetition extends Expr {
    constructor(expr, start, end) {
        super();
        this.expr = expr;
        this.start = start;
        this.end = end;
    }
}

class CharacterClass extends Expr {
    constructor(set) {
        super();
        this.set = set;
    }
}

class Not extends Expr {
    constructor(set) {
        super();
        this.set = set;
    }
}

class Intersection extends Expr {
    constructor(seta, setb) {
        super();
        this.seta = seta;
        this.setb = setb;
    }
}

function parse(tokens) {
	const n = new Name("things");
	const assign = new Statement("thingy", n)
	const source = new Source([assign]);
	console.log(source.display());
    
}
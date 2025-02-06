
//AST nodes:
//----------------------------------------------------------------------------------------
//Source := 	       	List[Statement]
//----------------------------------------------------------------------------------------
//Statement := 			Assignment(id: identifier, expr: Expr) | Return(expr: Expr)
//----------------------------------------------------------------------------------------
//Expr :=   	        Name(id: identifier) |
//						Concatenate(left: Expr, right: Expr) |
//						Alternate(left: Expr, right: Expr) |
//						Literal(value: String)	|
//						Repetition(expr: Expr, start: Integer, end: Integer) |
//						CharacterClass(set: String) | 
//						Complement(set: Expr) |
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
					s = "'" + this[key] + "'"
                } else if (typeof this[key] === 'number') {
					s = this[key] + ""
				} else if (this[key] instanceof ASTNode) {
					s = this[key].display()
				} else {
                    throw new UnrecognisedASTNode(this[key])
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
    constructor() {
        super();
    }
}

class Assignment extends Statement {
    constructor(id, expr) {
    	super();
        this.id = id;
        this.expr = expr;
    }
}

class Return extends Statement {
    constructor(expr) {
        super();
        this.expr = expr
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

class Alternation extends Expr {
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

class Complement extends Expr {
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

function parseExpr(tokens) {

    //Identifier, +, |, Characterset, Range, not, or, (, ), Quote

    //Binary operators: +, |, or
    //Unary operators: not, Range
    //Literals: Identifier, Characterset, Quote

    operator_stack = [] //array of tokens

    queue = [] //array of ast nodes

    //TODO: Think about these numbers:
    precedence = {
        CONCATENATION: 0,
        ALTERNATION: 0,
        OR_KEYWORD: 0,
        NOT_KEYWORD: 0,
        REPETITION: 0,
    }

    function pop_operator() {
        popped = operator_stack.pop();

        if (popped.type == CONCATENATION) {
            right = queue.pop();
            left = queue.pop();
            queue.push(new Concatenate(left, right));
        } else if (popped.type == ALTERNATION) {
            right = queue.pop();
            left = queue.pop();
            queue.push(new Alternation(left, right));
        } else if (popped.type == OR_KEYWORD) {
            setb = queue.pop();
            seta = queue.pop();
            queue.push(new Intersection(seta, setb));
        } else if (popped.type == NOT_KEYWORD) {
            queue.push(new Complement(queue.pop()))
        } else if (popped.type == REPETITION) {

            const r = new RegExp(/^(?<min>[0-9]*)(?<range>(..)?)(?<max>[0-9]*)$/);

            const m = r.exec(popped.data)

            if (m == null) {
                //Invalid repetition format, error
                throw new BadRepetition(popped)
            }

            min = m["groups"]["min"] == "" ? "" : Number(m["groups"]["min"])
            max = m["groups"]["max"] == "" ? "" : Number(m["groups"]["max"])

            //If the user omits the '..' then the repetition must be treated as an 'Exact', so we set max and min as the same
            if (m["groups"]["range"] == "") {
                max = min;
            }

            queue.push(new Repetition(queue.pop(), min, max))

        }
    }

    for (token of tokens) {

        if (token.type == IDENTIFIER) {
            queue.push(new Name(token.data));
        } else if (token.type == CHARACTER_SET) {
            queue.push(new CharacterClass(token.data));
        } else if (token.type == STRING_QUOTE) {
            queue.push(new Literal(token.data))
        } else if (token.type == CONCATENATION || token.type == ALTERNATION || token.type == OR_KEYWORD || token.type == NOT_KEYWORD || token.type == REPETITION) {
            while (true) {

                if (operator_stack.length == 0) {
                    break;
                }

                if (operator_stack[operator_stack.length-1].type === LEFT_PARENTHESIS) {
                    break;
                }

                if (precedence[operator_stack[operator_stack.length-1].type] < precedence[token.type]) {
                    break;
                }

                pop_operator();

            }

            operator_stack.push(token);


        } else if (token.type == LEFT_PARENTHESIS) {
            operator_stack.push(token);
        } else if (token.type == RIGHT_PARENTHESIS) {

            while (true) {

                if (operator_stack.length == 0) {
                    throw new MismatchedParenthesis();
                }

                if (operator_stack[operator_stack.length - 1].type == LEFT_PARENTHESIS) {
                    break;
                }

                pop_operator();

            }

            operator_stack.pop();
        }
    }

    for (let i = 0; i < operator_stack.length; i++) {
        if (operator_stack[operator_stack.length-1].type == LEFT_PARENTHESIS) {
            throw new MismatchedParenthesis();   
        }

        pop_operator();
    }

    if (queue.length != 1) {
        throw new ShuntingYardError(queue.length)
    }

    node = queue[0];

    return node;
}

function parse(tokens) {

    statements = []

    for (line of tokens) {



        if (line.length == 0) {
            //Empty line, skip
            continue;
        }



        if (line[0].type != IDENTIFIER && line[0].type != RETURN) {
            throw new InvalidFirstTokenStatement(line[0])
        }

        if (line.length == 1) {
            throw new InvalidNumberOfTokens(line[0])
        }

        if (line[0].type == IDENTIFIER) {

            if (line[1].type != ASSIGNMENT) {
                throw new AssertAssignment(line[1])
            }

            const e = parseExpr(line.slice(2));

            statement = new Assignment(line[0].data, e);

            statements.push(statement)


        } else if (line[0].type == RETURN) {
            //Return

            const e = parseExpr(line.slice(1));

            ret = new Return(e);

            statements.push(ret)
        } else {
            //error
            throw new UnreachableCode()
        }
    }

	const s = new Source(statements);

    return s
    
}
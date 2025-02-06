//Type of error raised when source with invalid syntax is used, recoverable
class SyntaxError extends Error {
	constructor(message) {
		super("Syntax Error: " + message);
	}
}

//Type of error raised when something goes wrong that probably shouldn't, unrecoverable
class FatalError extends Error {
	constructor(message) {
		super("Fatal Error: " + message);
	}
}

class UnreachableCode extends FatalError {
	constructor() {
		super("Overly confident programmer asserts that control flow should not reach this point. If it does then oh dear :(")
	}
}

class NotImplemented extends FatalError {
	constructor(message) {
		super(message)
	}
}

class UnrecognisedTokenType extends FatalError {
	constructor(type) {
		super("Token type '" + type + "' is not recognised. Hint: Is there a missing branch in the Token.type_str if statement?")
	}
}

class UnrecognisedASTNode extends FatalError {
	constructor(type) {
		super("Unrecognised AST node: '" + type + "' Typeof: '" + typeof(type) + "', constructor: '" + type.constructor.name + "'. Hint: I have no idea why this would happen good luck lol")
	}
}

class UsedBeforeDeclared extends SyntaxError {
	constructor(variable) {
		super("Variable '" + node.id + "' is used before it is declared")
	}
}

class BadRepetition extends SyntaxError {
	constructor(repetition) {
		super("Invalid repetition: '{" + repetition.data + "}'")
	}
}

class MismatchedParenthesis extends SyntaxError {
	constructor() {
		super("Mismatched parenthesis")
	}
}

class ShuntingYardError extends FatalError {
	constructor(queue_len) {
		super("There should only be 1 item left on the output queue in the shunting yard algorithm, found '" + queue_len + "'")
	}
}

class InvalidFirstTokenStatement extends SyntaxError {
	constructor(token) {
		super("Statements must be assignments or returns. The first token in each statement must be either an identifier or return, not a " + token.type_str() + "")
	}
}

class InvalidNumberOfTokens extends SyntaxError {
	constructor(token) {
		super("Statements must be assignments or returns. Not " + token.type_str())
	}
}

class AssertAssignment extends SyntaxError {
	constructor(token) {
		super("If the first token is an identifier, the second must be an assignment. Not '" + token.type_str() + "'")
	}
}

class InvalidStatement extends SyntaxError {
	constructor(token) {
		super("Statements must be assignments or returns. Statement starting with '" + token.type_str() + "' is invalid")
	}
}

class UnrecognisedIRNode extends FatalError {
	constructor(type) {
		super("Unrecognised IR node: '" + type + "' Typeof: '" + typeof(type) + "', constructor: '" + type.constructor.name + "'. Hint: I have no idea why this would happen good luck lol")
	}
}

class UndeclaredVariable extends SyntaxError {
	constructor(variable) {
		super("Variable '" + variable + "' is used before it is declared or it is not declared at all")
	}
}

class TranslateFunctionMissing extends FatalError {
	constructor(method) {
		super("Function '" + method + "' not implemented. Hint: Is there an implementation for the method in the IRTranslator class?")
	}
}
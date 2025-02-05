
const IDENTIFIER = 0;
const ASSIGNMENT = 2;
const CONCATENATION = 3;
const ALTERNATION = 4;
const CHARACTER_SET = 5;
const REPETITION = 6;
const NOT_KEYWORD = 9;
const OR_KEYWORD = 10;
const LEFT_PARENTHESIS = 11;
const RIGHT_PARENTHESIS = 12;
const STRING_QUOTE = 13;
const RETURN = 14;




class Token {
	constructor() {
		this.type = -1;
		this.data = "";
		this.start = -1
		this.end = -1
	}

	isempty() {
		return this.type == -1 && this.data == ""
	}

	append_data(data) {
		this.data += data
	}

	type_str() {
		if (this.type == IDENTIFIER) {
			return "Identifier"
		} else if (this.type == ASSIGNMENT) {
			return "Assignment"
		} else if (this.type == CONCATENATION) {
			return "Concatentation"
		} else if (this.type == ALTERNATION) {
			return "Alternation"
		} else if (this.type == CHARACTER_SET) {
			return "CharacterSet"
		} else if (this.type == REPETITION) {
			return "Repetition"
		} else if (this.type == NOT_KEYWORD) {
			return "Not"
		} else if (this.type == OR_KEYWORD) {
			return "Or"
		} else if (this.type == LEFT_PARENTHESIS) {
			return "LeftParenthesis"
		} else if (this.type == RIGHT_PARENTHESIS) {
			return "RightParenthesis"
		} else if (this.type == STRING_QUOTE) {
			return "String"
		} else if (this.type == RETURN) {
			return "Return"
		} else {
			//Unrecognised type, error
			console.log("ERROR: Unrecognised token type '" + this.type + "'")
		}
	}
}

function split_lines(source) {
	r = []
	
	s = ""

	index = 0

	for (char of source) {
		if (char == "\n" ) {
			if (index != source.length - 1) {
				r.push(s)
				s = ""
			}
		} else {
			s += char
		}
		index++;
	}

	r.push(s)

    return r


}

function tokenise(source) {

	tokens = []

	rows = []

	current_token = new Token();

	back_slash_count = 0

	function send_token() {

		if (current_token.isempty()) {
			return
		}

		if (current_token.type == IDENTIFIER) {
			if (current_token.data == "not") {
				//current_token = new Token(NOT_KEYWORD, "")
				current_token.type = NOT_KEYWORD
				current_token.data = ""
			} else if (current_token.data == "or") {
				//current_token = new Token(OR_KEYWORD, "")
				current_token.type = NOT_KEYWORD
				current_token.data = ""
			} else if (current_token.data == "return") {
				//current_token = new Token(RETURN, "")
				current_token.type = RETURN
				current_token.data = ""
			}
		}



		tokens.push(current_token);
		current_token = new Token()
	}

	var index = 0;

	console.log("split")
	console.log("'" + source + "'")
	console.log(split_lines(source))

	for (line of split_lines(source)) {

		for (char of line) {

			if (current_token.type == STRING_QUOTE) {

				if (char == "\"") {
					if (back_slash_count % 2 == 0) {
						current_token.end = current_token.data.length + current_token.start + 2
						console.log(char)
						send_token();
						index++;
						continue;
					}

				}

				if (char == "\\") {
					back_slash_count += 1
				} else {
					back_slash_count = 0
				}

				current_token.append_data(char)
				index++;
				continue;
			}

			if (current_token.type == CHARACTER_SET) {

				if (char == "]") {
					if (back_slash_count % 2 == 0) {
						current_token.end = current_token.data.length + current_token.start + 2
						send_token();
						index++;
						continue;
					}

				}

				if (char == "\\") {
					back_slash_count += 1
				} else {
					back_slash_count = 0
				}

				current_token.append_data(char)
				index++;
				continue;
			}

			if (current_token.type == REPETITION) {
				if (char == "}") {
					current_token.end = current_token.data.length + current_token.start + 2
					send_token();
					index++;
					continue;
				}

				current_token.append_data(char);
				index++;
				continue;
			}

			if (char === "#") {
				send_token();
				index += line.length - index
				break;
			} else if (char == "\n" || char == "\r" || char == "\t" || char == " ") {
				send_token();
			} else if (char.charCodeAt(0) >= "0".charCodeAt(0) && char.charCodeAt(0) <= "9".charCodeAt(0) || char.charCodeAt(0) >= "a".charCodeAt(0) && char.charCodeAt(0) <= "z".charCodeAt(0) || char.charCodeAt(0) >= "A".charCodeAt(0) && char.charCodeAt(0) <= "Z".charCodeAt(0) || char == "_") {
				if (current_token.type != IDENTIFIER) {
					send_token();
					current_token.type = IDENTIFIER;
				}
				current_token.append_data(char)
			} else if (char == "=") {
				send_token();
				current_token.start = index
				current_token.end = index+1
				current_token.type = ASSIGNMENT;
				send_token();
			} else if (char == "+") {
				send_token();
				current_token.start = index
				current_token.end = index+1
				current_token.type = CONCATENATION;
				send_token();
			} else if (char == "|") {
				send_token();
				current_token.start = index
				current_token.end = index+1
				current_token.type = ALTERNATION;
				send_token();
			} else if (char == "(") {
				send_token();
				current_token.type = LEFT_PARENTHESIS;
				send_token();
			} else if (char == ")") {
				send_token();
				current_token.type = RIGHT_PARENTHESIS;
				send_token();
			} else if (char == "{") {
				send_token();
				current_token.start = index
				current_token.type = REPETITION;
			} else if (char == '"') {
				send_token()
				current_token.start = index
				current_token.type = STRING_QUOTE
				current_token.data = ""
			} else if (char == '[') {
				send_token()
				current_token.start = index
				current_token.type = CHARACTER_SET
				current_token.data = ""
			}

			index++;
		}

		send_token();

		if (tokens.length != 0) {
			rows.push(tokens);
			tokens = [];
		}

		index ++;

	}

	return rows

	
}

function display_tokens(tokens) {
	console.log("Tokens:")
	for (row of tokens) {
		s = "["
		for (token of row) {
			if (token.data == "") {
				s += token.type_str() + ", "
			} else {
				s += "(" + token.type_str() + ", '" + token.data + "'), "
			}

		}
		console.log("    " + s + "]")
	}
}
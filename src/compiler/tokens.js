
const IDENTIFIER = 0;
const INTEGER = 1;
const ASSIGNMENT = 2;
const CONCATENATION = 3;
const ALTERNATION = 4;
const CHARACTER_SET = 5;
const RANGE = 6;
const LEFT_BRACE = 7;
const RIGHT_BRACE = 8;
const NOT_KEYWORD = 9;
const OR_KEYWORD = 10;
const LEFT_PARENTHESIS = 11;
const RIGHT_PARENTHESIS = 12;
const STRING_QUOTE = 13;
const SECTION = 14;

function tokenise(source) {

	tokens = []

	rows = []

	type = -1

	token = ""

	back_slash_count = 0

	function send_token() {

		if (token == "" && type == -1) {
			return
		}

		if (type == IDENTIFIER) {
			if (token == "not") {
				type = NOT_KEYWORD
				token = ""
			} else if (token == "or") {
				type = OR_KEYWORD
				token = ""
			}
		}



		tokens.push([type, token]);
		type = -1
		token = ""
	}

	for (line of source.split('\n')) {

		if (line[0] == "@") {
			type = SECTION
			token = line.substring(1)
			send_token()
			continue;
		}

		for (char of line) {

			if (type == STRING_QUOTE) {

				if (char == "\"") {
					if (back_slash_count % 2 == 0) {
						send_token();
						continue;
					}

				}

				if (char == "\\") {
					back_slash_count += 1
				} else {
					back_slash_count = 0
				}

				token += char;
				continue;
			}

			if (type == CHARACTER_SET) {

				if (char == "]") {
					if (back_slash_count % 2 == 0) {
						send_token();
						continue;
					}

				}

				if (char == "\\") {
					back_slash_count += 1
				} else {
					back_slash_count = 0
				}

				token += char;
				continue;
			}

			if (char === "#") {
				send_token();
				break;
			} else if (char === ".") {
				if (token === ".") {
					type = RANGE
					token = ".."
					send_token()
				} else {
					send_token();
					token = "."
				}
			} else if (char == "\n" || char == "\r" || char == "\t" || char == " ") {
				send_token();
			} else if (char.charCodeAt(0) >= "0".charCodeAt(0) && char.charCodeAt(0) <= "9".charCodeAt(0)) {
				console.log("HERE")	
				console.log("type: " + type)
				if (type == INTEGER || type == IDENTIFIER) {
					token += char;
				} else {
					send_token();
					type = INTEGER;
					token += char;
				}
			} else if (char.charCodeAt(0) >= "a".charCodeAt(0) && char.charCodeAt(0) <= "z".charCodeAt(0) || char.charCodeAt(0) >= "A".charCodeAt(0) && char.charCodeAt(0) <= "Z".charCodeAt(0) || char == "_") {
				if (type == INTEGER || type == IDENTIFIER) {
					token += char;
					type = IDENTIFIER
				} else {
					send_token();
					type = IDENTIFIER;
					token += char;
				}
			} else if (char == "=") {
				send_token();
				type = ASSIGNMENT;
				send_token();
			} else if (char == "+") {
				send_token();
				type = CONCATENATION;
				send_token();
			} else if (char == "|") {
				send_token();
				type = ALTERNATION;
				send_token();
			} else if (char == "(") {
				send_token();
				type = LEFT_PARENTHESIS;
				send_token();
			} else if (char == ")") {
				send_token();
				type = RIGHT_PARENTHESIS;
				send_token();
			} else if (char == "{") {
				send_token();
				type = LEFT_BRACE;
				send_token();
			} else if (char == "}") {
				send_token();
				type = RIGHT_BRACE;
				send_token();
			} else if (char == '"') {
				send_token()
				type = STRING_QUOTE
				token = ''
			} else if (char == '[') {
				send_token()
				type = CHARACTER_SET
				token = ''
			}


		}

		send_token();

		if (tokens.length != 0) {
			rows.push(tokens);
			tokens = []
		}
	}

	return rows

	
}
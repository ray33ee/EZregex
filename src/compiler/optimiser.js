
//Fiven the IR and the index of the open bracket, return the index of the corresponding closing bracket for non capturing and named groups
function find_close(ir, index) {
	//Get the node
	var node = ir[index]

	//Get the closing bracket type
	var closing_bracket_type;
	var open_bracket_type;

	if (node instanceof NamedCaptureLeft) {
		open_bracket_type = NamedCaptureLeft;
		closing_bracket_type = NamedCaptureRight;
	} else if (node instanceof NonCaptureLeft) {
		open_bracket_type = NonCaptureLeft;
		closing_bracket_type = NonCaptureRight;
	} else {
		console.log(node.constructor.name)
		console.log("Error: Invalid node")
	}

	var nesting = 0;

	for (var i = index+1; i < ir.length; i++) {

		if (ir[i] instanceof closing_bracket_type) {
			if (nesting == 0) {
				return i
			}
			nesting--;
		} else if (ir[i] instanceof open_bracket_type) {
			nesting++;
		}
	}

	console.log("Error: Mismatched brackets")
}

function optimise_names(ir) {
	names = new Map();

	//Loop over ir and create a map containing the number of uses of each name
	for (node of ir) {
		if (node instanceof NamedCaptureLeft) {
			if (names.has(node.name)) {
				names.set(node.name, names.get(node.name)+1)
			} else {
				names.set(node.name, 1)
			}
		}
	}

	change_list = []

	var count = 0

	// Iterate over ir and for each name with a count more than 1, add this to change_list
	for (node of ir) {
		if (node instanceof NamedCaptureLeft) {
			if (names.get(node.name) > 1) {
				change_list.push([count, find_close(ir, count)])
			}
		}
		count++
	}

	//Iterate over the change list and replace all the named captures with unnamed
	for (pair of change_list) {
		var named_left_index = pair[0]
		var named_right_index = pair[1]

		var new_right = new NonCaptureRight();

		ir.splice(named_left_index, 1, new NonCaptureLeft(new_right))
		ir.splice(named_right_index, 1, new_right)

	}

	return ir

}

//Remove any NON CAPTURING brackets if they:
//		- contain only 'CharacterSet', 'EscapedString' and 'Repeating' and do NOT have a repeating after
//		- Contains a single element
function optimise_units(ir) {

	indices_to_remove = []
	count = 0

	for (node of ir) {
		if (node instanceof NonCaptureLeft) {
			closing = find_close(ir, count)
			if (closing == count + 2) {
				//If there's only one item in the non capturing group, remove the group
				indices_to_remove.push(count)
				indices_to_remove.push(closing)	
			}
		}
		count++;
	}

	for (index of indices_to_remove.sort(function(a, b){return a-b}).reverse()) {
		ir.splice(index, 1)
	}

	console.log(translate(ir, new IRTranslator()))

	return ir
}

//Remove any NON CAPTURING brackets if they:
//		- immediately contain a capture 
function optimise_overlaps(ir) {

	indices_to_remove = []

	count = 0;

	for (node of ir) {
		if (node instanceof NonCaptureLeft) {
			outer_closing = find_close(ir, count)
			if (ir[count+1] instanceof NonCaptureLeft || ir[count+1] instanceof NamedCaptureLeft) {
				inner_closing = find_close(ir, count+1)
				if (inner_closing = outer_closing - 1) {
					indices_to_remove.push(count)
					indices_to_remove.push(outer_closing)
				}
			}
		}
		count++;
	}

	for (index of indices_to_remove.sort(function(a, b){return a-b}).reverse()) {
		ir.splice(index, 1)
	}

	return ir
}

function optimise(ir) {

	old_ir = optimise_names(ir)

	//Keep iterating over the optimisation passes until no more changes are made
	while (old_ir !== translate(ir, new IRTranslator())) {

		old_ir = translate(ir, new IRTranslator())

		ir = optimise_units(ir)

		ir = optimise_overlaps(ir)

	}

	return ir
}

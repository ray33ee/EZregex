

# EZRegex

EZ regex is a scripting language used to generate regexes. With an intuitive syntax, ___ and ____ EZ regex is a _____ way to generate regexes.

## Character sets

EZR lets users define their own character sets in a regex-like syntax and also has plenty of commonly used built in character sets.

For example

```Python
hex = [0-9a-f]
```

generates a character set called 'hex' which matches lower case hex digits. Note: Quotes are not needed, but can be used. Also C escape sequences are supported

## Built ins

EZR comes with several built in character sets for convenience, such as 'hex', 'octal', 'letters', etc.

## Set composition

We can define our own character sets based on the normal regex notation, or we can define them by combining and complementing other sets. We support complementing (not keyword) and the union of two sets (or keyword)

## Fragments

Character sets can be used to make fragments of regexes (which are technically regexes themselves). For example

```Python
hex_digit = hex
```

which creates a fragment named `hex_digit` which, as the name suggests, matches a single digit. 

Also, EZRegex contains a number of useful built in fragments.

## Repetition

The above example can be expanded with repetition using the \{\} syntax:

```Python
two_hex_digits = hex{2}
```

which matches two hex digits. Repetition can be represented in several ways:

- Singular: \{a\} Matches `a` repeats
- Bounded: \{a..b\} Matches between `a` and `b` repeats
- Lower bounded: \{a..\} Matches between `a` or more repeats
- Upper bounded: \{..a\} Matches between `a` or fewer repeats

## Literals

Fragments can be made of literal strings:

```Python
foo = "bar"
```

## Unicode

Unicode is supported for both character sets and string literals and as escaped or literal characteres

## Concatenation

Fragments can be combined with the `+` operator to match longer strings:

```Python

hello = "hello"

helloworld = hello + " world!"

``` 

## Alternation

Fragments can be combined in a 'match a or b or c' way with `|`:

```Python
animals = "dog" | "cat" | "bat"
```

## Non-capturing groups

Operations use brackets for precedence (this has the affect of creating non-capturing groups in the final regex). Take the following EZregex

```Python

a = ...
b = ...
c = ...

thing = (a | b) + c
```

which matches either a or b, then c after, i.e. ac or bc.

## Capturing groups

Each named fragment used in the final regex is turned into a capture group with the variable as the name

## Regex flavors

EZRegex compiles into an IR which itself is converted into several of the most popular regex flavors

## Anchors

EZRegex allows start and end anchors.

Todo: Figure out the syntax to use

## Tests

To fascilitate modifying and updating EZRegexes, a list of 'pass' and 'fail' strings can be supplied, which together form the tests. The regex is used on the 'pass' list and 'fail' list, and as long as all the pass strings pass and all the fail strings fail, the EZRegex passes.

Todo: Expand tests to more than just a simple 'pass' and 'fail' set, to include tests for named captures too.

## Source

Source code is split into the following sections:

- Code: This section contains the script that will be converted into a regex
- Tests: This (optional) section contains a set of tests which are performed on the regex. If any tests fail the user will be notified
- Scratch: This (optional) section contains text which the regex is used on. This can be used to experiment, test and verify on the fly before creating formal tests

## Compiler

1. Tokenise: Convert source into a stream of tokens
2. Parser: Convert a stream of tokens into an AST
3. IR: Convert the AST into IR
4. Backend: Convert this IR into the specified flavor of regex
5. Tests: Compile the generated regex and use it on the tests

The compiler can deduce the type (i.e. character set or fragment) of each variable. 

The compiler can deduce the output regex by looking at the top-level fragment

## IDE

EXRegex will have an online IDE structured as follows:

- Most of the screen will be comprised of the code window, on the LHS of the window
- Then, to the right of this (side by side) we have the output window which contains two tabs:
	- THe output of the console (any errors, warnings from the compiler plus the results of any tests)
		- The Console output should have a button to clear output
	- The output of the regex when applied to the scratch portion of the source code
	- The regex itself, with the option to choose the flavor
- On the top of the page we have the tool bar, which contains the run, build, test and scratch buttons as well as buttons for saving/loading to disk and copying URL.
	- Build: Converts code into a regex and displays output to console
	- Test: Builds + applies the regex to the tests
	- Scratch: Builds + applies the regex to the scratch portion, highlighting any matches and displaying any capture groups in a popup window when the user mouses over highlights
	- Run: Build + Test + Scratch
- A popup message (in the bottom right) should appear informing the user of succcess/fail from the compiler and pass/fail from the tests
- There also needs to be a way to choose the flavor of the final output regex

## Technical breakdown

### Tokens

Valid EZR source can be defined as an array of tokens, which are

- Comment
- Identifier
- Assignment
- Character set \[\]
- Repetition \{\}
- 'not' keyword
- 'or' keyword
- Parenthesis \(\)
- String \" or \'
- Concatenation operator \+
- Alternation operator \|
- Range ..
- Integer
- Section (@code, @tests, @scratch, etc.)
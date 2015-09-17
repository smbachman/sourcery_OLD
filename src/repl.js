import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/runmode/runmode";

let history = [];
let historyPointer = -1;

let editor = CodeMirror.fromTextArea(document.getElementById('input'), {
	mode: 'text/javascript',
	theme: 'twilight',
	extraKeys: {
		Enter: submit,
		Up: backHistory,
		Down: forwardHistory
	}
});

document.getElementById('busy-mask').style.display = 'none';

function submit() {
	var input = editor.getValue();
  	if (isBalanced(input)) {
    	historyPointer = history.push(input);		                                      
      	outputLine("> " + input);
		let result = eval(input);
        outputLine(result);
		editor.focus();
		editor.setValue('');		                           
  	} else {
   		return CodeMirror.Pass;
  	}
}

function backHistory() {
  if (historyPointer > 0) {                            
      var input = history[--historyPointer];                            
      if (input) editor.setValue(input);
  }
}

function forwardHistory() {
  if (historyPointer < history.length - 1) {
      var input = history[++historyPointer];
      editor.setValue(input);
  } else {
      editor.setValue("");
  }
}

function outputLine(line, dontHighlight) {
    line = line+'';
    var pre = '', post = '';
    if (!dontHighlight) {
        var highlighted = document.createElement('div');
        CodeMirror.runMode(line, 'text/javascript', highlighted);            
    }
    document.getElementById('output').innerHTML += pre + (highlighted ? highlighted.innerHTML : line) + post + "</br>";
    //var content = document.getElementById('repl-panel');
    //content.scrollTop = content.scrollHeight - content.offsetHeight;
}

function outputError(message, url, line) {
    var errorLine = "<span class=\"error\">" + message;
    if (url && line) 
        errorLine += "<span class=\"secondary\">url: <i>" + url + "</i> line: <i>" + line + "</i></span></span>";
    outputLine(errorLine, true);
}

window.onerror = outputError;

function isBalanced(code) {
    var length = code.length;
    var delimiter = '';
    var brackets = [];
    var matching = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (var i = 0; i < length; i++) {
        var char = code.charAt(i);

        switch (delimiter) {
        case "'":
        case '"':
        case '/':
            switch (char) {
            case delimiter:
                delimiter = "";
                break;
            case "\\":
                i++;
            }

            break;
        case "//":
            if (char === "\n") delimiter = "";
            break;
        case "/*":
            if (char === "*" && code.charAt(++i) === "/") delimiter = "";
            break;
        default:
            switch (char) {
            case "'":
            case '"':
                delimiter = char;
                break;
            case "/":
                var lookahead = code.charAt(++i);
                delimiter = char;

                switch (lookahead) {
                case "/":
                case "*":
                    delimiter += lookahead;
                }

                break;
            case "(":
            case "[":
            case "{":
                brackets.push(char);
                break;
            case ")":
            case "]":
            case "}":
                if (!brackets.length || matching[char] !== brackets.pop()) {
                    repl.print(new SyntaxError("Unexpected closing bracket: '" + char + "'"), "error");
                    return null;
                }
            }
        }
    }

    return brackets.length ? false : true;
};
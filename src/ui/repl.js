import React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import "codemirror/addon/runmode/runmode";

export default React.createClass({  
  getInitialState: function () {
    return { history: [], historyPointer: -1, output: [] };
  },
  componentDidMount: function () {
    let options = {
      mode: 'javascript',
      extraKeys: {
        Enter: this.submit,
        Up: this.backHistory,
        Down: this.forwardHistory
      }
    }
    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), options);
    window.onerror = this.outputError;        
  },
	render: function () {
    return React.createElement('div', null,
      React.createElement('div', { className: 'CodeMirror cm-s-default' },
        this.state.output.map(function (it, i) { 
          return React.createElement('div', {
            key: i,
            dangerouslySetInnerHTML: {__html: it}});
        })),
      React.createElement('div', null,
        React.createElement('span', {className: 'prompt'}, '> '),
        React.createElement('textarea', {
          ref: 'editor',
          autoFocus: true,
          autoCapitalize: false,
          autoCorrect: false,
          autoComplete: false,
          spellCheck: false
        })),
      React.createElement('div', null,
        React.createElement('button', {onClick: this.backHistory}, 'up'),
        React.createElement('button', {onClick: this.forwardHistory}, null, 'dn'),
        React.createElement('button', {onClick: this.submit}, 'go')));   
	},
  submit: function () {
    let input = this.editor.getValue();
    if (isBalanced(input)) {   
      let history = this.state.history;   
      let historyPointer = history.push(input);
      this.setState({
        historyPointer: historyPointer, 
        history: history,
        output: this.state.output
      });
      this.outputLine("> " + input);
		  let result = eval(input);
      this.outputLine(result);
		  this.editor.focus();
		  this.editor.setValue('');		                           
  	} else {
   		return CodeMirror.Pass;
  	}
  },
  outputLine: function (line, dontHighlight) {
    line = line+'';    
    if (!dontHighlight) {
        var highlighted = document.createElement('div');
        CodeMirror.runMode(line, 'text/javascript', highlighted);            
    }
    let final = (highlighted ? highlighted.innerHTML : line);
    this.setState({ 
      output: this.state.output.concat(final) 
    });      
  },
  outputError: function (message, url, line) {
    var errorLine = "<span class=\"error\">" + message;
    if (url && line) 
        errorLine += "<span class=\"secondary\">url: <i>" + url + "</i> line: <i>" + line + "</i></span></span>";
    this.outputLine(errorLine, true);
  },
  backHistory: function () {
    let historyPointer = this.state.historyPointer;        
    if (this.historyPointer > 0) {
      let input = this.state.history[--historyPointer];
      this.editor.setValue(input);
    } else {
      this.editor.setValue('');
    }
    this.setState({
      historyPointer, 
      history: this.state.history,
      output: this.state.output
    });
  },
  forwardHistory: function () {
    let historyPointer = this.state.historyPointer;
    if (historyPointer < this.state.history.length - 1) {
      let input = this.state.history[++historyPointer];
      this.editor.setValue(input);
    } else {
      this.editor.setValue("");
    }
    this.setState({
      historyPointer, 
      history: this.state.history,
      output: this.state.output
    });
  }
});

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

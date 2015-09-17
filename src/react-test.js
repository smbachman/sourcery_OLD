import React from 'react';

let HelloMessage = React.createClass({
	render: function () {
		return <div>Hello {this.props.name}</div>;
	}
});

React.render(<HelloMessage name="John" />, document.getElementById('repl'));

document.getElementById('busy-mask').style.display = 'none';
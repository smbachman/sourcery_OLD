import React from 'react';

let Shell = React.createClass({
	render: function () {
		return (<div>Hello {this.props.name}</div>);
	}
});

export default Shell;
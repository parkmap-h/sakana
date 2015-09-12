import React from 'react';

var Page = React.createClass({
  render: function () {
    return (
      <div className="app">
      Hello, World!
      </div>
    );
  }
});

React.render(<Page />, document.body);

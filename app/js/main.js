import React from 'react';

var Page = React.createClass({
  render: function () {
    var features = this.props.featureCollection.features;
    var spaces = features.map(function (s) {
      return (
        <div>
          {s.geometry.coordinates[0]},{s.geometry.coordinates[1]}に空き駐車場が{s.properties.value}件あります。
        </div>);
    });
    console.log(spaces);
    return (
      <div className="app">
        {spaces}
      </div>
    );
  }
});

var req = new XMLHttpRequest();
req.open('GET', 'https://parkmap-h.appspot.com/spaces');
req.onreadystatechange = function(){
  if (req.readyState === 4 && req.status === 200){
    var featureCollection = JSON.parse(req.responseText);
    console.log(JSON.parse(req.responseText));
    React.render(<Page featureCollection={featureCollection} />, document.body);
  }
};
req.send();

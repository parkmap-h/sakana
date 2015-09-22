import React from 'react';
import Space from './space';
import prettydate from "pretty-date";

var Page = React.createClass({
  render: function () {
    var features = this.props.featureCollection.features;
    var spaces = features.map(function (s) {
      var space =  Space.fromFeature(s);
      return (
        <div>
          {prettydate.format(space.createAt)} {space.point.longitude},{space.point.latitude}に空き駐車場が{s.properties.value}件あります。
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

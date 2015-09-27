import React, {Component}  from 'react';
import Space from './space';
import prettydate from "pretty-date";
import spaceStore from './spaceStore';
import {dispatch} from './spaceDispatcher';
import {Container} from 'flux/utils';

var base_url = "https://parkmap-h.appspot.com/";

function getSpaces() {
  var req = new XMLHttpRequest();
  req.open('GET', base_url + 'spaces');
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200){
      var featureCollection = JSON.parse(req.responseText);
      var spaces = featureCollection.features.map(function (s) {
        return Space.fromFeature(s);
      });
      dispatch({ type: "space/load", spaces: spaces});
    };
  };
  req.send();
}

function createSpace(point, value) {
  var req = new XMLHttpRequest();
  req.open('POST', base_url + 'spaces');
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200){
      var feature = JSON.parse(req.responseText);
      var space = Space.fromFeature(feature);
      dispatch({ type: "space/load", spaces: [space]});
    };
  };
  var obj = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [point.longitude, point.latitude]
    },
    "properties": { "value": value }
  };
  req.send(JSON.stringify(obj));
}

function getCurrentPosition(callback) {
  if( navigator.geolocation )
  {
    navigator.geolocation.getCurrentPosition(
      function(position){ callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }); },
      function (){} );
  }
}

var currentPoint = null;

class Page extends Component<{}, {}, State> {
  static getStores(): Array<Store> {
    return [spaceStore];
  }

  static calculateState(prevState: ?State): State {
    return {
      spaces: spaceStore.getState(),
      currentPoint: currentPoint
    };
  }

  componentWillMount() {
    getSpaces();
    getCurrentPosition((point) => {
      currentPoint = point;
      this.setState({currentPoint: point});
    });
  }

  _handleNoSpace() {
    createSpace(this.state.currentPoint, 0);
  }

  _handleOneSpace(e) {
    createSpace(this.state.currentPoint, 1);
  }

  _handleTwoSpace(e) {
    createSpace(this.state.currentPoint, 2);
  }

  _handleThreeGreatorSpace(e) {
    createSpace(this.state.currentPoint, 3);
  }

  render(): ?ReactElement {
    var spaces = this.state.spaces.map(function (s) {
      return (
        <div>
          <div>{prettydate.format(s.createAt)}</div>
          <div>{s.point.longitude.toString().substring(0,5)},{s.point.latitude.toString().substring(0,5)}に空きが{s.value}件あります。</div>
        </div>);
    });
    var postButton = "";
    if (this.state.currentPoint) {
      postButton = (
          <div>
            <div>
              現在地 緯度:{this.state.currentPoint.latitude.toString().substring(0, 5)} 経度:{this.state.currentPoint.longitude.toString().substring(0, 5)}
            </div>
            <button onClick={this._handleNoSpace.bind(this)}>空いてない</button>
            <button onClick={this._handleOneSpace.bind(this)}>1台</button>
            <button onClick={this._handleTwoSpace.bind(this)}>2台</button>
            <button onClick={this._handleThreeGreatorSpace.bind(this)}>3台</button>
          </div>
      );
    }
    return (
      <div className="app">
        {postButton}
        <div className="spaces">
        {spaces}
        </div>
      </div>
    );
  };
}

const PageContainer = Container.create(Page);
React.render(<PageContainer />, document.body);
